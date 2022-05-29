import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chan } from "./chan.entity";

@Entity()
export class SocketJoined {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text")
	socketID: string;

	@ManyToOne(() => User, user => user.joinedChannels, {onDelete:'CASCADE'})
	@JoinColumn()
	user: User;

	@ManyToOne(() => Chan, channel => channel.socketJoined, {onDelete:'CASCADE'})
	@JoinColumn()
	chan: Chan;
}
