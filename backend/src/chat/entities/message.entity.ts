import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  date: Date;

  /*
  @UpdateDateColumn()
  update_at: Date;
*/

  /*-------------------------------------
        - Relations -
    --------------------------------------*/

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
  @JoinTable()
  channel: Channel;

  /*
	@Column('boolean', {default: false})
	isChallenge: boolean;
*/
}
