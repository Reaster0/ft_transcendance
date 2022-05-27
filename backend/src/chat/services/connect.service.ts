import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Status } from 'src/common/enums/status.enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { SocketConnected } from '../entities/socketConnected';
import { connectedSocketI } from '../interfaces/connectSocket.interface';

@Injectable()
export class ConnectService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(SocketConnected)
    private readonly connectedRepository: Repository<SocketConnected>,
    private readonly userServices: UsersService,
  ) {}

  async connectUser(client: Socket, user: User) {
    await this.userService.changeStatus(user, Status.ONLINE); // maybe useless;
    await this.connectedRepository.save({ socketID: client.id, user });
  }

  async disconnectUser(socket: string) {
    const connectSocket = await this.connectedRepository.find({
      where: { socketID: socket },
    });
    await this.userService.changeStatus(connectSocket[0].user, Status.OFFLINE); // maybe useless;
    await this.connectedRepository.delete(socket);
  }

  async findAll(): Promise<connectedSocketI[]> {
    const connections = await this.connectedRepository.find({
      relations: ['user'],
    });
    return connections;
  }
}
