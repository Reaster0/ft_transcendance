import { Injectable, NotFoundException, StreamableFile, InternalServerErrorException,
  Res, BadRequestException, Inject, forwardRef} from '@nestjs/common';
import { Repository, Connection, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../user.dto';
import { Status } from '../enums/status.enum';
import { AvatarsService } from './avatars.service';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Avatar } from '../entities/avatar.entity';
import { ChatGateway } from '../../chat/chat.gateway';
import { Channel } from 'src/chat/entities/channel.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly avatarsService: AvatarsService,
    private readonly connection: Connection,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User ${id} (id) not found.`);
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ username: username });
    if (!user) {
      throw new NotFoundException(`User ${username} (username) not found.`);
    }
    return user;
  }

  async findUserByNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.findOne({ nickname: nickname });
    if (!user) {
      throw new NotFoundException(`User ${nickname} (nickname) not found.`);
    }
    return user;
  }

  async retrieveOrCreateUser(createUserDto: CreateUserDto): Promise<{ user: User, first: boolean }> {
    const { username } = createUserDto;
    let user = await this.userRepository.findOne({ username: username });
    if (user)
      return {user, first: false};

    const nickname = await this.generateNickname(username);
    user = this.userRepository.create({ username: username, nickname: nickname });

    return { user: await this.userRepository.save(user), first: true };
  }

  async generateNickname(nickname: string): Promise<string> {
    let user = null;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while ((user = await this.userRepository.findOne({ nickname: nickname })) || nickname.length < 4) {
      const randomChar = letters[Math.floor(Math.random() * letters.length)];
      if (nickname.length > 15) {
        nickname = randomChar;
      } else {
        nickname += randomChar;
      }
    }
    return nickname;
  }

  async updateUser(user: User, updateUser: UpdateUserDto): Promise<User> {
    const { nickname } = updateUser;
    if (nickname.length > 15) {
      throw new BadRequestException('Nickname is too long');
    }
    if (!nickname.match(/^[0-9a-zA-Z]+$/)) {
      throw new BadRequestException('Nickname is not alphanumeric');
    }
    let find = await this.userRepository.findOne({ nickname: nickname });
    if (find && find != user)  {
      throw new BadRequestException('Nickname already taken');
    }
    user.nickname = nickname;
    return this.userRepository.save(user);
  }

  async removeUser(user: User): Promise<void> {
    const friends = user.friends;
    const id = user.id;
    for (let i = 0; i < friends.length; i++) {
      const otherUser = await this.userRepository.findOne({ id: friends[i] });
      this.removeFriend(otherUser, id);
    }
    await this.userRepository.remove(user);
  }

  async changeStatus(user: User, newStatus: Status, chatSocketId: string | null): Promise<void> {
    await this.userRepository.update(user.id, { status: newStatus, chatSocket: chatSocketId });
    this.chatGateway.sendUsersList();
  }

  async modifyElo(user: User, opponentElo: number, userWon: boolean): Promise<void> {
    const eloRating = await require('elo-rating');
    const result = eloRating.calculate(user.eloScore, opponentElo, userWon);
    user.eloScore = result.playerRating;
    await this.userRepository.save(user);
  }

  async addFriend(user: User, friendId: number): Promise <void> {
    const found = await user.friends.find((element) => element === friendId);
    if (found) {
      throw new BadRequestException('User is already a friend');
    }
    user.friends.push(friendId);
    await this.userRepository.save(user);
  }

  async removeFriend(user: User, friendId: number): Promise<void> {
    const found = user.friends.indexOf(friendId);
    if (found == -1) {
      throw new BadRequestException('User is not a friend');
    }
    user.friends.splice(found, 1);
    await this.userRepository.save(user);
  }

  async listFriends(user: User): Promise<{}> {
    if (user.friends.length === 0) {
      return { 'friends': { 'names': {}, 'status': {} }};
    }
    let names = [];
    let status = [];
    for (let friendId of user.friends) {
      let friend = await this.findUserById('' + friendId);
      if (friend) {
        names.push(friend.nickname);
        status.push(friend.status);
      }
    }
    return { 'friends': { 'names': names, 'status': status }};
  }

  async addAvatar(user: User, avatarBuffer: Buffer): Promise<Avatar> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const oldAvatarId = user.avatarId;
      const newAvatar = await this.avatarsService.uploadAvatar(avatarBuffer, queryRunner);
      await queryRunner.manager.update(User, user.id, { avatarId: newAvatar.id });
      if (oldAvatarId) {
        await this.avatarsService.deleteAvatarById(oldAvatarId, queryRunner);
      }
      await queryRunner.commitTransaction();
      return newAvatar;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async getAvatarByAvatarId(avatarId: number, @Res({ passthrough: true }) res): Promise<StreamableFile> {
    const avatar = await this.avatarsService.getAvatarById(avatarId);
    if (!avatar) {
      const filename = process.env.DEFAULT_AVATAR;
      const stream = createReadStream(join(process.cwd(), process.env.DEFAULT_AVATAR),);
      res.set({
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Type': 'image',
      });
      return new StreamableFile(stream);
    }
    const stream = Readable.from(avatar.avatarBuffer);
    const filename = avatar.avatarFilename;
    res.set({
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  async setTwoFASecret(user: User, secret: string): Promise<void> {
    user.twoFASecret = secret;
    user.twoFASecret = user.encryptSecret();
    await this.userRepository.save(user);
  }

  async enableTwoFA(id: number): Promise<void> {
    await this.userRepository.update(id, { is2FAEnabled: true });
  }

  async disableTwoFA(id: number): Promise<void> {
    await this.userRepository.update(id, { is2FAEnabled: false, twoFASecret: null });
  }

  getSecret(user: User): string {
    return user.decryptSecret();
  }

  currentUser(user: User): Partial<User> {
    const { username, twoFASecret, ...res } = user;
    return res;
  }

  async getPartialUserInfo(nickname: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ nickname: nickname });
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return { nickname: user.nickname, eloScore: user.eloScore, id: user.id, status: user.status };
  }

  async getConnectedUsers(): Promise<User[]> {
    const connectedUser = await this.userRepository.find({
      select: ['id', 'nickname', 'avatarId', 'status'],
      where: [{ status: Status.ONLINE }],
    });
    return connectedUser;
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      select: ['id', 'nickname', 'status']
    });
    return users;
  }

  async updateBlockedUser(userId: number, block: boolean, targetId: number): Promise<boolean> {
    const currentUser = await this.userRepository.findOne(userId);
    const userToBlock = await this.userRepository.findOne(targetId);
    if (!userToBlock) { 
      return null;
    }
    const userFound = currentUser.blockedIds.find((element) => element === userToBlock.id);
    if (block === true && !userFound) {
      currentUser.blockedIds.push(userToBlock.id);
      await this.userRepository.save(currentUser);
      return true;
    } else if (block === false && userFound) {
      const index = currentUser.blockedIds.indexOf(userToBlock.id);
      currentUser.blockedIds.splice(index, 1);
      await this.userRepository.save(currentUser);
      return true;
    }
    return false;
  }

  async getGameHistory(id: number): Promise<{}> {
    const user = await this.userRepository.findOne(id, { relations: ['gamesWon', 'gamesLost', 'gamesWon.looser', 'gamesLost.winner'] });
    if (!user) {
      throw new NotFoundException(`User ${id} (id) not found.`);
    }
    let gameHistory = {};
    let score = [];
    let opponent = [];
    let opponentScore = [];
    if (user.gamesWon) {
      for (let game of user.gamesWon) {
        score.push(game.winnerScore);
        opponentScore.push(game.looserScore);
        if (game.looser && game.looser.nickname) {
          opponent.push(game.looser.nickname);
        } else {
          opponent.push('deleted user');
        }
      }

      gameHistory = { 'nb': user.gamesWon.length, 'infos': { 'score': score, 'opponent': opponent, 'opponentScore': opponentScore } };
    } else {
      gameHistory = { nb: 0, infos: {} };
    }
    score = [];
    opponent = [];
    opponentScore = [];
    if (user.gamesLost) {
      for (let game of user.gamesLost) {
        score.push(game.looserScore);
        opponentScore.push(game.winnerScore);
        if (game.winner && game.winner.nickname) {
          opponent.push(game.winner.nickname);
        } else {
          opponent.push('deleted user');
        }
      }
      gameHistory = { 'won': gameHistory, 'lost': { 'nb': user.gamesLost.length, 'infos': { 'score': score, 'opponent': opponent, 'opponentScore': opponentScore } } };
    } else {
      gameHistory = { 'won': gameHistory, 'lost': { nb: 0, infos: {} } };
    }
    return gameHistory;
  }

  async filterUserByName(name: string): Promise<User[]> {
    return this.userRepository.find({ //or findAndCount
      skip: 0,
      take: 10,
      order: { nickname: "DESC" },
      select: ['id', 'nickname', 'eloScore', 'avatarId'],
      where: [{ nickname: Like(`%${name}%`) }]
    })
  }

  isMyFriend(user: User, friendId: number): boolean {

    const friend = user.friends.find(element => element === friendId);
    const value = (friend === undefined) ? false : true;
    return value;
  }

  async getUserChannels(userId: number): Promise<Channel[]> {
    const user = await this.userRepository.findOne(userId, 
      {
        relations: ['channels']
      });
    if (!user) { return null; }
    return user.channels;
  }

  async getUserChannelsId(userId: number): Promise<string[]> {
    const channels = await this.getUserChannels(userId);
    if (channels === null) { return null}

    let result: string[] = [];
    for (const chan of channels) {
     result.push(chan.id);
    }
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({select: ['id', 'nickname']});
    return users;
  }
}
