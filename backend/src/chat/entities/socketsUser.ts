import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SocketConnected {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  socketID: string;

	@ManyToOne(() => User, user => user.connections, {onDelete:'CASCADE'})
	@JoinColumn()
	user: User;
}
