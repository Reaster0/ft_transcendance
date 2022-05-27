import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Socket } from "socket.io"
import { parse } from 'cookie'
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/users/interfaces/jwt-payload.interface";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/services/users.service";
import { ChanI } from "../interfaces/channel.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Chan } from "../entities/chan.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { SocketConnected } from "../entities/socketConnected";

@Injectable()
export class ChatServices {
    constructor (
    @InjectRepository(Chan)
    private readonly chanRepository: Repository<Chan>,

    ){}


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
        if (!channel.chanID)
            throw new InternalServerErrorException('bad request: deleteChannel');
		const channelFound: Chan = await this.chanRepository.findOne(channel.chanID);
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
}
