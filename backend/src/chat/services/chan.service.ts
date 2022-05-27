import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Chan } from "../entities/chan.entity";
import { ChanUser } from "../entities/chanUser.entity";
import { SocketConnected } from "../entities/socketConnected";
import { SocketJoined } from "../entities/socketJoined";
import { ChanI } from "../interfaces/channel.interface";
import { ChanUserI } from "../interfaces/chanUser.interface";
import { connectedSocketI } from "../interfaces/connectSocket.interface";
import { JoinedSocketI } from "../interfaces/joinedSocket.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChanServices {
    constructor(
        @InjectRepository(Chan)
        private readonly chanRepository: Repository<Chan>,
        @InjectRepository(ChanUser)
        private readonly chanUserRepository: Repository<ChanUser>,
        @InjectRepository(SocketJoined)
        private readonly joinedSocketRepository: Repository<SocketJoined>,
    ) { }

    async createChannel(channel: ChanI, creator: User): Promise<ChanI> {
		let { chanName, publicChannel, password } = channel;
		const name = await this.chanRepository.findOne({channelName: chanName});

		if (name) //channel name already exist
			return null;
		if (/^([a-zA-Z0-9-]+)$/.test(chanName) === false) //isalphanum()
			return null;
        
		channel.users.push(creator);
		channel.adminUsers = [];
		channel.owner = creator.id;

		if (!password)
			password = null;

  //will see 
		if (publicChannel === false) {
			if (password) {
				const salt = await bcrypt.genSalt();
				channel.password = await bcrypt.hash(password, salt);
            }
		}
		return this.chanRepository.save(channel);
	}
	async deleteChannel(channel: ChanI) {
		/*
 		 if (!channel.id)
	  		throw new InternalServerErrorException('bad request: deleteChannel');
	  */
		const channelFound: Chan = await this.chanRepository.findOne(channel.id);
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

	async getChannelsFromUser(userID: number): Promise<ChanI[]> {
		let query = this.chanRepository
			.createQueryBuilder('chan')
			.where('chan.publicChannel = true')
		const publicChannels: ChanI[] = await query.getMany(); // gater all public channel

		query = this.chanRepository
			.createQueryBuilder('chan')
			.leftJoin('chan.users', 'users')
			.where('users.id = :userID', { userID })
			.andWhere('chan.publicChannel = false')
			.leftJoinAndSelect('chan.users', 'all')
			.leftJoinAndSelect('chan.chanUsers', 'all')
			.orderBy('chan.date', 'DESC');

		const privateChannels: ChanI[] = await query.getMany();
		console.log(privateChannels);

		const channels = publicChannels.concat(privateChannels);

		channels.sort(function (date1, date2) {
			let d1 = new Date(date1.date);
			let d2 = new Date(date2.date);
			if (d1 < d2) return 1;
			else if (d1 > d2) return -1;
			else return 0;
		});
		return channels;
	}

	async getChan(channelID: string): Promise<ChanI> {
		return this.chanRepository.findOne(channelID, { relations: ['users'] });
	}

	async findUserByChannel(channel: ChanI, userId: number): Promise<ChanUserI> {
		return this.chanUserRepository.findOne({ where: { chan: channel, userId: userId } });
	}

	//-------------------------------------------------//
	async findSocketByChannel(channel: ChanI): Promise<JoinedSocketI[]> {
		return this.joinedSocketRepository.find({ where: { channel: channel }, relations: ['user'] });
	}

	async addSocket(joinedChannel: JoinedSocketI): Promise<JoinedSocketI> {
		return this.joinedSocketRepository.save(joinedChannel);
	}
	async removeSocket(socketID: string) {
		return this.joinedSocketRepository.delete({ socketID });
	}
}
