import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { ChatGateway } from "./chat.gateway";
import { Chan } from "./entities/chan.entity";
import { ChanUser } from "./entities/chanUser.entity";
import { Message } from "./entities/message.entity";
import { SocketConnected } from "./entities/socketConnected";
import { SocketJoined } from "./entities/socketJoined";
import { ChanServices } from "./services/chan.service";
import { ChatServices } from "./services/chat.service";
import { ConnectService } from "./services/connect.service";
import { MessageService } from "./services/message.service";
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chan, ChanUser, Message, SocketConnected, SocketJoined]),
        UsersModule,
    ],
    controllers: [],
    providers: [ChatGateway, ChanServices, ChatServices, ConnectService, MessageService, AuthService],
    exports: [ChatGateway],
})
export class ChatModule {}
