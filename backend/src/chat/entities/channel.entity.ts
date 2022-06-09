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
import { ChanUser } from './channelUser.entity';
import { Message } from './message.entity';
import { SocketJoined } from './sockets-connected-to-channel';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { number, string } from 'joi';

@Entity()
export class Chan {
  @ApiProperty({
    type: String,
    description: 'channel uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
    description: 'channel name, should be Unique',
  })
  @Column('text', { default: 'unamed', unique: true}) // how front end deal whit this uniqness ?
  channelName: string;

  @ApiProperty({
    type: Date,
    description: 'channel creation date',
  })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({
    type: Date,
    description: 'channel last update date',
  })
  @UpdateDateColumn()
  update_at: Date;

  @ApiProperty({
    type: Number,
    description: 'channel owner / creator',
  })
  @Column('int', { default: 0 })
  owner: number;

  @ApiProperty({
    type: Boolean,
    description: 'is the channel public ?',
  })
  @Column('boolean', { default: false })
  publicChannel: boolean;

  @ApiProperty({
    type: String,
    description: 'encrypted password',
  })
  @Column('text', { default: '' })
  password: string;

  @ApiProperty({
    type: Number,
    description: 'array of administrator id',
  })
  @Column('simple-array', { default: [] })
  adminUsers: number[];

  @ApiProperty({
    type: Boolean,
    description: 'is this a private conversation / direct message',
  })
	@Column('boolean', {default: false})
	privateMessage: boolean;

  @Column({ type: 'bytea', nullable: true })
  @ApiProperty({ type: Buffer, description: "avatar buffer for chat" })
  avatar?: Uint8Array;

  /*-------------------------------------
        - Relations -
    --------------------------------------*/

  @ApiProperty({
    type: User,
    description: 'Relation | channels <=> Users | ManyToMany: Users that have join the channel <=> Channels that have bein join that channel ',
  })
  @ManyToMany(() => User, { onDelete: 'CASCADE' }) //All user in that channel
  @JoinTable()
  users: User[];

  @ApiProperty({
    type: ChanUser,
    description: 'Relation | channels <=> ChannelUser | OneToMany : User that have bein join that channel + there Role',
  })
  @OneToMany(() => ChanUser, chanUser => chanUser.chan, { cascade: true }) // Users roles
  chanUsers: ChanUser[]; //rool

  
  @ApiProperty({
    type: Message,
    description: 'Relation | OneMany: all message posted on that Channel' 
  })
  @OneToMany(() => Message, (message) => message.channel, { cascade: true }) // all message in that channel
  messages: Message[];

  @ApiProperty({
    type: SocketJoined,
    description: 'Relation | OneToMany: all the socket connected to that Channel'
  })
  @OneToMany(() => SocketJoined, (socketJoined) => socketJoined.chan, {
    cascade: true,
  })
  socketJoined: SocketJoined[];
}
