import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { measureMemory } from 'vm';
import { Message } from '../entities/message.entity';
import { ChannelI } from '../interfaces/channel.interface';
import { FrontMessageI } from '../interfaces/frontChannel.interface';
import { MessageI } from '../interfaces/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForChannel(
    channel: ChannelI,
    user: User,
  ): Promise<FrontMessageI[]> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :channelID', { channelID: channel.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.date', 'ASC');

    const messagesFound: MessageI[] = await query.getMany();

    const updateMessageFound: FrontMessageI[] = [];

    for (var message of messagesFound) {
      const blocked: number = user.blockedUID.find(
        (element) => element === message.user.id,
      );
      if (blocked) message.content = '... 🛑 ...';

      var frontMessage: FrontMessageI;
      frontMessage.content = message.content;
      frontMessage.date = message.date;
      frontMessage.userId = message.user.id;

      updateMessageFound.push(frontMessage);
    }
    return updateMessageFound;
  }
}
