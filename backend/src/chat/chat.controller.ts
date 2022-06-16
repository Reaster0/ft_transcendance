import { Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { InviteDto } from "./chat.dto";
import { ChanServices } from "./services/chan.service";
import { UrlGeneratorService } from 'nestjs-url-generator';
import console from "console";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/users/guards/userAuth.guard";
import { ChanUserService } from "./services/chanUser.service";
import { UsersService } from "../users/services/users.service";
import { ChannelI } from './interfaces/channel.interface';

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor(
        private readonly chanServices: ChanServices,
        private readonly urlGeneratorService: UrlGeneratorService,
        private readonly chanUserServices: ChanUserService,
        private readonly userService: UsersService,
    ) { }

    @Get('genJoinUrl')
    async makeUrl(@Query() invite: InviteDto): Promise<string> {
        console.log('generating url');
        console.log(invite);
        const params = {
            chanID: invite.chanID,
            invitedUser: invite.invitedUser,
            
        };
        const query = {
            k: 'queryTest',
        }

        const res: string= this.urlGeneratorService.generateUrlFromController({
            controller: ChatController,
            controllerMethod: ChatController.prototype.joinChannel,
            query: query,
            params: params,
          });

          console.log(res);
          return (res);
        }

        @Get('joinChannel/:id/:nickname')
        @UseGuards(AuthGuard('jwt'), AuthUser) // try
        async joinChannel(@Param('id') id: string, @Req() req: RequestUser): Promise<void> {
        console.log('try to join channel whit link');
        const channelFound = await this.chanServices.getChan(id);
        if (!channelFound) {
            console.log('channel whit id: ', id, ' not found' );
            return ;
        }
        
        //const messages = await this.messageServices.findMessagesForChannel(channelFound, client.data.user)

        await this.chanServices.pushUserToChan(channelFound, req.user);
        await this.chanUserServices.addUserToChan(channelFound, req.user);
        //this.server.to(req.user.chatSocket).emit('previousMessages', messages);
        console.log(req.user, ' joined: ', channelFound.channelName);
        //return 'lets join this private channel';
  }

  // test ----------------------------------------------------------------
  @Get('/channeltest')
  async createChannelTest() {
    const creator = await this.userService.findUserById('1');
    const chan: ChannelI = {
        channelName: "channeltest3",
        owner: 1, //owner id
        password: '',
        publicChannel: true,
    };
    return await this.chanServices.createChannel(chan, creator);
  }

  @Get('/msgtest')
  async createMsgTest() {
  }

  @Get('joinnableChannel')
  async joinnableChannel(@Query() chanName: string): Promise<ChannelI[]> {
    return await this.chanServices.filterJoinableChannel(chanName);
  }
}
