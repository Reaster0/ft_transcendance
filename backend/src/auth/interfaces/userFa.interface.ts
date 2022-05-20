import { User } from "src/users/entities/user.entity";

export interface UserFA{
    user: User;
    twoFA: boolean;
}