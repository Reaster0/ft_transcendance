import { Inject, forwardRef, Injectable, InternalServerErrorException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { ChanUser } from '../entities/channelUser.entity';
import { ChannelI } from '../interfaces/channel.interface';
import { ChanUserI } from '../interfaces/channelUser.interface';
import * as bcrypt from 'bcrypt';
import { timeStamp } from 'console';
import { UsersService } from 'src/users/services/users.service';
import { FrontChannelI } from '../interfaces/frontChannel.interface';

@Injectable()
export class ChanServices {
  constructor(
    @InjectRepository(Channel)
    private readonly chanRepository: Repository<Channel>,
    @InjectRepository(ChanUser)
    private readonly chanUserRepository: Repository<ChanUser>,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
  ) {}

  async createChannel(channel: ChannelI, creator: User): Promise<Channel> {
    let { channelName, publicChannel, password } = channel;
    //console.log(channelName);
    const name = await this.chanRepository.findOne({ channelName: channelName });

		if (name) //channel name already exist
			return null;

		if (/^([a-zA-Z0-9-]+)$/.test(channelName) === false) //isalphanum()
			return null;

    channel.users = [creator];
		channel.adminUsers = [creator.id]; //Alina asking for this
		channel.owner = creator.id;

  //will see 
		if (publicChannel === false) {
			if (password) {
				const salt = await bcrypt.genSalt();
				channel.password = await bcrypt.hash(password, salt);
      }
		}
		//console.log(channel);

		return this.chanRepository.save(channel);
	}

	async deleteChannel(channel: ChannelI) {
		/*
 		 if (!channel.id)
	  		throw new InternalServerErrorException('bad request: deleteChannel');
	  */
    const channelFound: Channel = await this.chanRepository.findOne(channel.id);
    if (channelFound) {
      /*
					 channelFound.users = []; //is this necessary ?
						 try {
							 await this.chanRepository.save(channelFound);
						 } catch (error) {
							 console.log(error);
							 throw new InternalServerErrorException('failed to empty user list');
						 }
			 */
      try {
        await this.chanRepository.delete(channelFound.id);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('failed to delete channel');
      }
    }
  }

  //try
  async pushUserToChan(channel: ChannelI, user: User){
    let update: Channel = await this.chanRepository.findOne(channel.id);
    update.users.push(user);
    this.chanRepository.update(channel.id, update);
  }

  //test
  async removeUserToChan(channel: ChannelI, user: User) {
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

  async getChan(channelID: string): Promise<ChannelI> {
    return this.chanRepository.findOne(channelID, { relations: ['users'] });
  }

  async findChannel(channelName: string): Promise<Channel> {
    return this.chanRepository.findOne({channelName});
  }

  async getAllChanUser(channelId: string): Promise<User[]> {
    const currentChanUsers: Channel = await this.chanRepository.findOne(
      { id: channelId } ,
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

  //-------------------------------------------------//
  async findSocketByChannel(channel: ChannelI): Promise<string[]> {
    
    const member: ChannelI = await this.chanRepository.findOne({
      where: {id: channel.id},
      relations: ['users'],
    });


      var res: string[]
      for (const user of member.users) {
        res.push(user.chatSocket);
      }
      return (res);
    /*
    return this.joinedSocketRepository.find({
      where: { channel: channel },
      relations: ['user'],
    });
    */
  }

  /*
  async addSocket(joinedChannel: JoinedSocketI): Promise<JoinedSocketI> {
    return this.joinedSocketRepository.save(joinedChannel);
  }
  async removeSocket(socketID: string) {
    return this.joinedSocketRepository.delete({ socketID });
  }
  */
}
