import { Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { InviteDto } from "./chat.dto";
import { ChanServices } from "./services/chan.service";
import { UrlGeneratorService } from 'nestjs-url-generator';
import console from "console";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/users/guards/userAuth.guard";

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor(
        private readonly chanServices: ChanServices,
        private readonly urlGeneratorService: UrlGeneratorService,
    ) { }

    @Get('genJoinUrl')
    async makeUrl(@Query() invite: InviteDto): Promise<string> {
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
        const channelFound = await this.chanServices.getChan(id);
        if (!channelFound)
            return ;
        


        //return 'lets join this private channel';
  }
}
