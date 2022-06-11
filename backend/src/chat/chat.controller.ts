import { Controller, Get, Post, Req } from "@nestjs/common";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { CreateChannelDto } from "./chat.dto";
import { ChanI } from "./interfaces/channel.interface";
import { ChanServices } from "./services/chan.service";
import { UrlGeneratorService } from 'nestjs-url-generator';

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor(
        private readonly chanService: ChanServices,
        private readonly urlGeneratorService: UrlGeneratorService,
    ) { }

    @Get('genJoinUrl')
    async makeUrl(channel: ChanI): Promise<string> {
        const params = {
            id : channel.id,
        };
        const query = {
            k: 'queryTest',
        }

        return this.urlGeneratorService.generateUrlFromController({
            controller: ChatController,
            controllerMethod: ChatController.prototype.joinChannel,
            query: query,
            params: params,
          });
        }

        @Get('joinChannel')
        async joinChannel(): Promise<string> {
        return 'lets join this private channel';
  }
}
