import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chan } from './chan.entity';

@Entity()
export class ChanUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  userID: number;

  @Column({ nullable: true, type: 'timestamptz' })
  ban: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  mute: Date;

  /*-------------------------------------
               - Relations -
    --------------------------------------*/

	@ManyToOne(() => Chan, chan => chan.socketJoined, {onDelete:'CASCADE'})
	@JoinColumn()
	chan: Chan;
}
