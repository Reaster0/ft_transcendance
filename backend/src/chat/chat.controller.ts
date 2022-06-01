import { Controller, Post } from "@nestjs/common";

@Controller('chat') // localhost:3000/chat/....
export class ChatController {
    constructor() {}; //import service there

    @Post('protectedroom') //localhost:3000/chat/protectedroom
    protectedRoom(/*arguments*/){
        //logic
    }


}