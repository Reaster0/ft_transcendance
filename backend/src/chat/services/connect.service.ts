import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Status } from '../../users/enums/status.enum';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectService {
  constructor(
    private readonly userService: UsersService,
  ) {}

    async connectUser(client: Socket, user: User) {
        await this.userService.connectUserToChat(user, client.id);
    }

    async disconnectUser(user: User) {
          await this.userService.disconectUserToChat(user)
    }

  /*
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
  */


}
