import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chan } from "./chan.entity";

@Entity()
export class SocketJoined {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text")
	socketID: string;

	// TODO please Aime, check that following is correct
	//@ManyToOne(() => User, user => user.joinedChannels, {onDelete:'CASCADE'})
	@ManyToOne(() => User, user => user.channels, {onDelete:'CASCADE'})
	@JoinColumn()
	user: User;
	// TODO End of TODO

	@ManyToOne(() => Chan, channel => channel.socketJoined, {onDelete:'CASCADE'})
	@JoinColumn()
	chan: Chan;
}
