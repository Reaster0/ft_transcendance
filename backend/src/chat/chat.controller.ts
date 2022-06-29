import { Controller, Get, Param, Post, Query, Redirect, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { ChanServices } from "./services/chan.service";
import { UrlGeneratorService, SignedUrlGuard} from 'nestjs-url-generator';
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/users/guards/userAuth.guard";
import { UsersService } from "../users/services/users.service";
import { ChannelI } from './interfaces/back.interface';
import { ChannelType } from "src/users/enums/channelType.enum";
import { FrontChannelI } from "./interfaces/front.interface";
import { User } from "src/users/entities/user.entity";
import { ChatGateway } from "./chat.gateway";
import { UrlGeneratorFilter } from './url-generator-filter';

@Controller('chat')
@UseFilters(UrlGeneratorFilter)
export class ChatController {
  constructor(
      private readonly chanServices: ChanServices,
      private readonly urlGeneratorService: UrlGeneratorService,
      private readonly userService: UsersService,
      private readonly chatGateway: ChatGateway,
  ) { }

  @Get('genJoinUrl')
  async makeUrl(@Query('chanId') channelId: string): Promise<string> {
    try {
      const params = {
          chanId: channelId,
      };
      let date = new Date();
      const res: string = this.urlGeneratorService.signControllerUrl({ controller: ChatController,
          controllerMethod: ChatController.prototype.joinChannel,
          params: params,
          expirationDate: new Date(date.getTime() + 10 * 60000),
        });
        return (res);
      } catch (e) {
        console.log(e);
      }
  }

  @Get('joinChannel/:chanId')
  @UseGuards(AuthGuard('jwt'), AuthUser)
  @UseGuards(SignedUrlGuard)
  @Redirect(process.env.FRONTEND + '/thechat')
  async joinChannel(@Param('chanId') id: string, @Req() req: RequestUser) {
    try {
      const channel = await this.chanServices.findChannelWithUsers(id);
      if (!channel) {
        return ;
      }
      const user = req.user;
      const already = await this.chanServices.getUserOnChannel(channel, user.id)
      if (already) {
        return ;
      }
      const result = await this.chanServices.pushUserToChan(channel, user);
      if (!result) {
        return ;
      }
      this.chatGateway.emitChannelModif(channel.id);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('joinableChannel/:id')
  async joinableChannel(@Param('id') id: number): Promise<FrontChannelI[]> {
    try {
      return await this.chanServices.filterJoinableChannel(id);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('findUser/:name')
  async findUser(@Param('name') name: string): Promise<User[]> {
    try {
      return await this.userService.filterUserByName(name);
    } catch (e) {
      console.log(e);
    }
  }
}
