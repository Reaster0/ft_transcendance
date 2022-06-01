import { Controller, Post } from "@nestjs/common";

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor() {}; //import service there

    @Post('protectedroom') //localhost:3000/chat/protectedroom
    protectedRoom(/*arguments*/){
        //logic
    }

    @Post('privateroom') //localhost:3000/chat/privateroom
    privateRoom(/*arguments*/){
        //logic
    }

    @Post('publicroom') //localhost:3000/chat/publicroom
    publicRoom(/*arguments*/){
        //logic
    }


}