import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { RequestUser } from "src/auth/interfaces/requestUser.interface";
import { CreateChannelDto } from "./chat.dto";
import { ChanI } from "./interfaces/channel.interface";
import { ChanServices } from "./services/chan.service";
import { ChatServices } from "./services/chat.service";

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor(
        private readonly chanService: ChanServices,
    ){}

    @Post('protectedroom') //localhost:3000/chat/protectedroom
    protectedRoom(/*arguments*/){
        //logic
    }

    @Post('privateroom') //localhost:3000/chat/privateroom
    privateRoom(/*arguments*/){
        //logic
    }

    @Post('publicroom') //localhost:3000/chat/publicroom
    async publicRoom(@Req() req: RequestUser, param: CreateChannelDto): Promise<Boolean> {
       console.log(req); // jus cheking for test
       let newChan : ChanI = {chanName: param.channame, publicChannel: true, password: ''}
       try {
        await this.chanService.createChannel(newChan, req.user)
       } catch {
           console.log('error while creating public channel');
           return false;
       }
       return (true);
    }


}