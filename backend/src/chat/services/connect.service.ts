import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Status } from 'src/common/enums/status.enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { SocketConnected } from '../entities/socketsUser';
import { connectedSocketI } from '../interfaces/socketUser.interface';

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
        await this.connectedRepository.save({socketID: client.id, user: user});
    }

    async disconnectUser(socketID: string, user: User) {
        if (user)
          await this.userService.changeStatus(user, Status.OFFLINE); // maybe useless;
        await this.connectedRepository.delete({socketID});
    }

  async findAll(): Promise<connectedSocketI[]> {
    console.log('try');
    //const connections = await this.connectedUserRepository.find({ relations: ["user"] });
    try {
      const connections = await this.connectedRepository.find({ relations: ["user"] });
      //console.log(connections);
      return connections;
    } catch {
      console.log('fail to retrive relation user for connectec repo');
      return undefined;
    }
  }


}
