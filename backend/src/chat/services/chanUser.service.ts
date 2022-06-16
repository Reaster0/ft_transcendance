import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { ChanUser } from "../entities/channelUser.entity";
import { ChannelI } from "../interfaces/channel.interface";
import { ChanUserI } from "../interfaces/channelUser.interface";

@Injectable()
export class ChanUserService {
  constructor(
    @InjectRepository(ChanUser)
    private readonly chanUserRepository: Repository<ChanUser>,
  ) {}

  async addUserToChan(channel: ChannelI, user: User): Promise<ChanUser> {
      const newChanUser = this.chanUserRepository.create({mute: null, isAdmin: false, isOwner: false, userID: user.id, channel: channel});
      return this.chanUserRepository.save(newChanUser);
  }

  //maybe add owner field in it...
  async addOwnerToChan(channel: ChannelI, user: User): Promise<ChanUser> {
//      const newChanUser: ChanUser = this.chanUserRepository.create({mute: null, isBan: false, isAdmin: true, user: user, channel: channel});
      return this.chanUserRepository.save({mute:null, isAdmin: true, isOwner: true, userID: user.id, channel});
  }

  async findUserOnChannel(channel: ChannelI, user: User): Promise<ChanUserI> {
    return this.chanUserRepository.findOne({ 
      select: ['mute', 'isAdmin', 'isOwner'],
      where: { channel: channel, user: user} });
  }

  async deletChanUser(channel: ChannelI, user: User) {
    const chanUser: ChanUser = await this.chanUserRepository.findOne({ where: { channel: channel, user: user} });
    return this.chanUserRepository.remove(chanUser);
  }
}