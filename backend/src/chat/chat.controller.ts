import { Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { InviteDto } from "./chat.dto";
import { ChanServices } from "./services/chan.service";
import { UrlGeneratorService } from 'nestjs-url-generator';
import console from "console";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/users/guards/userAuth.guard";
import { UsersService } from "../users/services/users.service";
import { ChannelI } from './interfaces/back.interface';
import { ChannelType } from "src/users/enums/channelType.enum";
import { truncate } from "fs";
import { FrontChannelI } from "./interfaces/front.interface";
import { User } from "src/users/entities/user.entity";

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor(
        private readonly chanServices: ChanServices,
        private readonly urlGeneratorService: UrlGeneratorService,
        private readonly userService: UsersService,
    ) { }

    @Get('genJoinUrl')
    async makeUrl(@Query() invite: InviteDto): Promise<string> {
        //console.log('generating url');
        //console.log(invite);
        const params = {
            chanId: invite.chanId,
            invitedUserId: invite.invitedUserId,
            
        };
        const query = {
            k: 'secretQuery',
        }

        const res: string= this.urlGeneratorService.generateUrlFromController({
            controller: ChatController,
            controllerMethod: ChatController.prototype.joinChannel,
            //query: query,
            params: params,
          });

          return (res);
        }

        @Get('joinChannel/:chanId/:invitedUserId')
        @UseGuards(AuthGuard('jwt'), AuthUser) // try
        async joinChannel(@Param('chanId') id: string, @Req() req: RequestUser): Promise<boolean> {
        console.log('try to join channel whit link');
        /*
        const channelFound = await this.chanServices.findChannelWithUsers(id);
        if (!channelFound) {
            return false;
        }
        */
        
        //const messages = await this.messageServices.findMessagesForChannel(channelFound, client.data.user)

        const channel = await this.chanServices.pushUserToChan(id, req.user);
        if (!channel) { return false; }
        //this.server.to(req.user.chatSocket).emit('previousMessages', messages);
        return true;
        //return 'lets join this private channel';
  }

  // test ----------------------------------------------------------------
  @Get('/channeltest')
  async createChannelTest() {
    const creator = await this.userService.findUserById('2');
    const chan: ChannelI = {
        name: "channeltest3",
        password: '',
        type: ChannelType.PUBLIC
    };
    return await this.chanServices.createChannel(chan, creator);
  }

  @Get('/msgtest')
  async createMsgTest() {
  }

  @Get('joinnableChannel/:id')
  async joinnableChannel(@Param('id') id: number): Promise<FrontChannelI[]> {
    return await this.chanServices.filterJoinableChannel(id);
  }

  @Get('findUser/:name')
  async findUser(@Param('name') name: string): Promise<User[]> {
    return await this.userService.filterUserByName(name);
  }
}
