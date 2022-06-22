import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { FrontMessageI } from '../interfaces/front.interface';
import { MessageI } from '../interfaces/back.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForChannel(channelId: string, user: User)
    : Promise<FrontMessageI[]> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :channelId', { channelId: channelId })
      .leftJoinAndSelect('message.user', 'user') // mmmhhh
      .select(['message.content', 'user.id', 'message.date'])
      .orderBy('message.date', 'ASC');

    const messagesFound: MessageI[] = await query.getMany();
    const updateMessageFound: FrontMessageI[] = [];
    for (var message of messagesFound) {
      const blocked: number = user.blockedIds
        .find((element) => element === message.user.id);
      if (blocked) {
        message.content = '... 🛑 ...';
      }
      const frontMessage = { content: message.content, date: message.date.toUTCString(), userId: message.user.id };
      updateMessageFound.push(frontMessage);
    }
    return updateMessageFound;
  }
}
