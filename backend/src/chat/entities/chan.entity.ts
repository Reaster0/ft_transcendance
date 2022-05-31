import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChanUser } from './chanUser.entity';
import { Message } from './message.entity';
import { SocketJoined } from './socketJoined';

@Entity()
export class Chan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { default: 'unamed' })
  channelName: string;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  update_at: Date;

  @Column('int', { default: 0 })
  owner: number;

  @Column('boolean', { default: false })
  publicChannel: boolean;

  @Column('text', { default: '' })
  password: string;

  @Column('simple-array', { default: [] })
  adminUsers: string[];

  /*-------------------------------------
        - Relations -
    --------------------------------------*/

  @ManyToMany(() => User, { onDelete: 'CASCADE' }) //All user in that channel
  @JoinTable()
  users: User[];

	@OneToMany(() => ChanUser, chanUser => chanUser.chan, { cascade: true }) // Users roles
	chanUsers: ChanUser[]; //rool

  @OneToMany(() => Message, (message) => message.channel, { cascade: true }) // all message in that channel
  messages: Message[];

  @OneToMany(() => SocketJoined, (socketJoined) => socketJoined.chan, {
    cascade: true,
  })
  socketJoined: SocketJoined[];

  /*
	@Column("simple-array", {default: []})
	authPrivateChannelUsers: number[];

	@Column('boolean', {default: false})
	directMessage: boolean;
*/
}
