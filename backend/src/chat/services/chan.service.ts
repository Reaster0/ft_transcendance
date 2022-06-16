import { Inject, forwardRef, Injectable, InternalServerErrorException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { Muted } from '../entities/muted.entity';
import { ChannelI } from '../interfaces/back.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users.service';
import { FrontChannelI } from '../interfaces/front.interface';

@Injectable()
export class ChanServices {
  constructor(
    @InjectRepository(Channel)
    private readonly chanRepository: Repository<Channel>,
    @InjectRepository(Muted)
    private readonly mutedRepository: Repository<Muted>,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
  ) {}

  async createChannel(channel: ChannelI, creator: User): Promise<Channel> {
    let { channelName, type, password } = channel;
    const name = await this.chanRepository.findOne({ channelName: channelName });
		if (name) //channel name already exist
			return null;
		if (/^([a-zA-Z0-9-]+)$/.test(channelName) === false) //isalphanum()
			return null;
    channel.users = [creator];
		channel.admins = [creator.id]; //Alina asking for this
		channel.owner = creator.id;
		if (type === 'protected') {
			const salt = await bcrypt.genSalt();
			channel.password = await bcrypt.hash(password, salt);
		}
		return this.chanRepository.save(channel);
	}

	async deleteChannel(channel: ChannelI) {
    const channelFound: Channel = await this.chanRepository.findOne(channel.id);
    if (channelFound) {
      try {
        await this.chanRepository.delete(channelFound.id);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('failed to delete channel');
      }
    }
  }

  async pushUserToChan(channel: ChannelI, user: User){
    let update: Channel = await this.chanRepository.findOne(channel.id);
    update.users.push(user);
    this.chanRepository.update(channel.id, update);
  }

  async removeUserFromChan(channel: ChannelI, user: User) {
    let update: Channel = await this.chanRepository.findOne(channel.id);
    const index = update.users.indexOf(user);
    if (index != -1) {
      update.users.splice(index, 1);
    }
    this.chanRepository.update(channel.id, update);
  }

  async updateChannel(channel: ChannelI, info: any): Promise<Boolean> {
		const { addPassword, password, removePassword } = info;

    if (addPassword && password) {
      if (/^([a-zA-Z0-9]+)$/.test(password) === false)
        return false;
      const salt = await bcrypt.genSalt();
      channel.password = await bcrypt.hash(password, salt);
    }
    if (removePassword)
      channel.password = '';
    
    await this.chanRepository.save(channel);
  return true;
  }

  async getChannelsFromUser(id: number): Promise<FrontChannelI[]> {
    let query = await this.chanRepository
      .createQueryBuilder('channel')
      .select(['channel.id', 'channel.channelName', 'channel.avatar']) //Test
      .leftJoin('channel.users', 'users')
      .where('users.id = :id', { id })
      .orderBy('channel.date', 'DESC');

    let channels = await query.getMany() as FrontChannelI[];
    return channels;
  }

  async findChannelWithUsersAndMuted(channelID: string): Promise<Channel> {
    return this.chanRepository.findOne(channelID, { relations: ['users', 'muted'] });
  }

  async findChannelWithUsers(channelID: string): Promise<ChannelI> {
    return this.chanRepository.findOne(channelID, { relations: ['users'] });
  }

  async findChannel(channelName: string): Promise<Channel> {
    return this.chanRepository.findOne({channelName});
  }

  async getAllChanUser(channelId: string): Promise<User[]> {
    const currentChanUsers: Channel = await this.chanRepository.findOne(
      channelId,
      { relations: ['users'] }
    );
    return currentChanUsers.users;
  }

  async filterJoinableChannel(name: string): Promise<Channel[]> {

    return this.chanRepository.find({ //or findAndCount
      skip: 0,
      take: 10,
      order: {channelName: "DESC"},
      select: ['id', 'channelName', 'avatar'],
      where: [ { channelName: Like(`%${name}%`), publicChannel: true} ]
    })
  }

  async userIsInChannel(user: User, channelId: string): Promise<boolean> {
    console.log(await this.chanRepository.findOne(channelId));
    const currentChanUsers = await this.getAllChanUser(channelId);
    const me: User = currentChanUsers.find( (element) => element.id === user.id);
    if (user)
      return true;
    return false;
  }

  async findSocketByChannel(channel: ChannelI): Promise<string[]> {
    const member: ChannelI = await this.chanRepository.findOne({
      where: {id: channel.id},
      relations: ['users'],
    });
    let res: string[]
    for (const user of member.users) {
      res.push(user.chatSocket);
    }
    return (res);
  }

  async muteUser(channel: Channel, userId: number): Promise<Muted> {
    const now = Date.now();
    const newChanUser = await this.mutedRepository.create({ userId: userId, date: now, channel: channel });
    return this.mutedRepository.save(newChanUser);
}

  async getMutedUsers(channelId: string): Promise<Channel> {
    const muted = await this.chanRepository.findOne(channelId, { relations: ['muted', 'muted.userId', 'muted.date'] });
    // TODO maybe get special output ?
    return muted;
  }

  async unmuteUser(channel: Channel, user: User) {
    const chanUser: Muted = await this.mutedRepository.findOne({ where: { channel: channel, user: user} });
    return this.mutedRepository.remove(chanUser);
  }
}
