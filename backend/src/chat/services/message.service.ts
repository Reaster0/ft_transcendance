import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { ChannelI } from '../interfaces/channel.interface';
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

  async findMessagesForChannel(channelId: string, user: User): Promise<MessageI[]> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .where('channel.id = :channelID', { channelID: channelId })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.date', 'ASC');
    const messagesFound: MessageI[] = await query.getMany();

    const updateMessageFound: MessageI[] = [];
    for (const message of messagesFound) {
      const blocked: number = user.blockedUID.find(
        (element) => element === message.user.id,
      );
      if (blocked) message.content = '... 🛑 ...';
      updateMessageFound.push(message);
    }
    return updateMessageFound;
  }
}
