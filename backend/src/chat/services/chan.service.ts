import { Inject, forwardRef, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { Roles } from '../entities/role.entity';
import { ChannelI, RolesI } from '../interfaces/back.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users.service';
import { FrontChannelI } from '../interfaces/front.interface';
import { ChannelType } from 'src/users/enums/channelType.enum';
import { ERoles } from 'src/users/enums/roles.enum';
import { relative } from 'path';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChanServices {
  constructor(
    @InjectRepository(Channel)
    private readonly chanRepository: Repository<Channel>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
  ) {}

  async createChannel(channel: ChannelI, creator: User): Promise<{channel: string, error: string}> {
    let { name, type, password } = channel;
    if (!name) return {channel:null, error: 'Channel name must not be empty'};

		if (/^([a-zA-Z0-9-]+)$/.test(name) === false)
			return {channel:null, error: 'Channel name must be alphabetical'};

    const sameName = await this.chanRepository.findOne({ name: name });
		if (sameName) return {channel:null, error: 'This channel name is already taked'};

    channel.users = [creator];
		if (type === ChannelType.PROTECTED || password) {
			const salt = await bcrypt.genSalt();
			channel.password = await bcrypt.hash(password, salt);
		}
		const newChannel = await this.chanRepository.save(channel);
    const user: RolesI = {userId: creator.id, role: ERoles.OWNER, muteDate: null, channel: newChannel}
    this.roleRepository.save(user);

    return {channel: newChannel.name, error: ''};
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
    const newUser: RolesI = {userId: user.id, role: ERoles.USER, muteDate: null, channel: update}
    this.roleRepository.save(newUser);
  }

  async removeUserFromChan(channel: ChannelI, user: User) {
    let update: Channel = await this.chanRepository.findOne(channel.id);
    const index = update.users.indexOf(user);
    if (index != -1) {
      update.users.splice(index, 1);
    }
    this.chanRepository.update(channel.id, update);
    ////////////////////////////////////////////////////////////////
    const chanUser = await this.roleRepository.findOne({ where: { channel: channel, userId: user.id} });
    console.log(chanUser);
    try {
      this.roleRepository.remove(chanUser)
    } catch (err) {
      console.log(err);
    }
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
    let query = this.chanRepository
      .createQueryBuilder('channel')
      .select(['channel.id', 'channel.name', 'channel.avatar']) //Test
      .leftJoin('channel.users', 'users')
      .where('users.id = :id', { id })
      .orderBy('channel.date', 'DESC');

    let channels = await query.getMany() as FrontChannelI[];
    return channels;
  }

  async getChannelUsers(channelID: string): Promise<Roles[]> {
    const channel = await this.chanRepository.findOne(channelID, { relations: ['channelUsers'] });
    return channel.channelUsers;
  }


  async getChannelFromId(channelID: string): Promise<Channel> {
    return this.chanRepository.findOne(channelID);
  }

  async findChannelWithUsers(channelID: string): Promise<ChannelI> {
    return this.chanRepository.findOne(channelID, { relations: ['users'] });
  }

  async findChannelByName(name: string): Promise<Channel> {
    return this.chanRepository.findOne({name});
  }

  async getAllChanUser(channelId: string): Promise<User[]> {
    const currentChanUsers: Channel = await this.chanRepository.findOne(
      channelId,
      { relations: ['users'] }
    );
    return currentChanUsers.users;
  }

  async filterJoinableChannel(name: string): Promise<Channel[]> {

    console.log('coucou: ', name);
    return this.chanRepository.find({ //or findAndCount
      skip: 0,
      take: 10,
      order: {name: "DESC"},
      select: ['id', 'name', 'avatar'],
      where: [ { name: Like(`%${name}%`) }]
    })
  }

  async userIsInChannel(user: User, channelId: string): Promise<boolean> {
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

  async muteUser(channel: Channel, userId: number, time: number): Promise<Roles> {
    const chanUser = await this.roleRepository.findOne({ where: { channel, userId} });

    const muteDate = new Date;
    muteDate.setDate(muteDate.getDate() + time)

    chanUser.muteDate = muteDate;
    return this.roleRepository.save(chanUser);
}

  async unmuteUser(channel: Channel, userId: number): Promise<Roles> {
    const chanUser: Roles = await this.roleRepository.findOne({ where: { channel, userId} });
    chanUser.muteDate = null;
    return this.roleRepository.save(chanUser);
  }

  /*
    I belive that the request to channelRepository is not necessary, it should be able to retrive the User only whit the channelId
    remember to test that !
  */
  async getUserOnChannel(channel: ChannelI, userId: number): Promise<Roles> {
    return this.roleRepository.findOne({channel, userId});
  }
}
