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

  async addUserToChan(channel: ChannelI, user: User) {
      const newChanUser: ChanUserI = {mute: null, isBan: false, isAdmin: false, user: user, channel: channel};
      this.chanUserRepository.save(newChanUser);
  }

  //maybe add owner field in it...
  async addAdminToChan(channel: ChannelI, user: User) {
      const newChanUser: ChanUserI = {mute: null, isBan: false, isAdmin: true, user: user, channel: channel};
      this.chanUserRepository.save(newChanUser);
  }

  async findUserOnChannel(channel: ChannelI, user: User): Promise<ChanUserI> {
    return this.chanUserRepository.findOne({ where: { channel: channel, user: user} });
  }

  async deletChanUser(channel: ChannelI, user: User) {
    const chanUser: ChanUser = await this.chanUserRepository.findOne({ where: { channel: channel, user: user} });
    return this.chanUserRepository.remove(chanUser);
  }
}