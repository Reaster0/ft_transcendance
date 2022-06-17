import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany,
  PrimaryGeneratedColumn } from 'typeorm';
import { Muted } from './muted.entity'
import { Message } from './message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Channel {
  @ApiProperty({ type: String, description: 'channel uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, description: 'channel name, should be unique' })
  @Column('text', { default: 'unamed', unique: true})
  name: string;

  @ApiProperty({ type: Date, description: 'channel creation date' })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ type: Number, description: 'channel owner / creator id' })
  @Column('int', { default: 0 })
  owner: number;

  @ApiProperty({ type: String, description: 'channel type (public/protected/private/pm)' })
  @Column('text', { default: 'public' })
  type: string;

  @ApiProperty({ type: String, description: 'encrypted password' })
  @Column('text', { default: '' })
  password: string;

  @ApiProperty({ type: Number, description: 'array of administrator id' })
  @Column('simple-array', { default: [] })
  admins: number[];

  @ApiProperty({ type: Number, description: 'array of blocked User id' })
  @Column('simple-array', { default: [] })
  blocked: number[];

  @Column({ type: 'bytea', nullable: true })
  @ApiProperty({ type: Buffer, description: "avatar buffer for chat" })
  avatar?: Uint8Array;

  /*-------------------------------------
        - Relations -
    --------------------------------------*/

  @ApiProperty({ type: User, description: 'Relation | channels <=> Users | ManyToMany: Users that have join the channel <=> Channels that have bein join that channel ' })
  @ManyToMany(() => User, (users: User) => users.channels, { onDelete: 'CASCADE' }) //All user in that channel
  @JoinTable()
  users: User[];

  @ApiProperty({ type: Muted, description: 'Relation | channels <=> ChannelUser | OneToMany : User that have bein join that channel + there status' })
  @OneToMany(() => Muted, muted => muted.channel, { cascade: true })
  muted: Muted[];

  @ApiProperty({ type: Message, description: 'Relation | OneMany: all message posted on that Channel' })
  @OneToMany(() => Message, (message) => message.channel, { cascade: true }) // all message in that channel
  messages: Message[];

}
