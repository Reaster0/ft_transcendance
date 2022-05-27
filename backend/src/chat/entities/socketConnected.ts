import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocketConnected {

	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text")
	socketID: string;

	// TODO please Aime, check that following is correct
	//@ManyToOne(() => User, user => user.connections, {onDelete:'CASCADE'})
	@ManyToOne(() => User, user => user.socketID, {onDelete:'CASCADE'})
	@JoinColumn()
	user: User;
	// TODO End of TODO
}
