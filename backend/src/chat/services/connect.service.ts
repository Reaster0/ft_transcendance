import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class ConnectUserService {
    constructor(
        private readonly userService: UsersService
    ) {}


}