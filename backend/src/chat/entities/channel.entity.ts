import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany,
  PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './role.entity'
import { Message } from './message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from 'src/users/enums/channelType.enum';

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

  // todo change this to number if front is ok
  @Column({ type: 'int', default: ChannelType.PUBLIC})
  @ApiProperty({ enum: ChannelType, type: String, description: 'channel type, either public/private/protected/pm.' })
  type: ChannelType;

  @ApiProperty({ type: String, description: 'encrypted password' })
  @Column('text', { default: '' })
  password: string;

  @ApiProperty({ type: Number, description: 'array of blocked User id' })
  @Column({ type: 'int', array: true, default: {} })
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

  @ApiProperty({ type: Roles, description: 'Relation | channels <=> ChannelUser | OneToMany : User that have bein join that channel + there status' })
  @OneToMany(() => Roles, roles => roles.channel, { cascade: true })
  channelUsers: Roles[];

  @ApiProperty({ type: Message, description: 'Relation | OneMany: all message posted on that Channel' })
  @OneToMany(() => Message, (message) => message.channel, { cascade: true }) // all message in that channel
  messages: Message[];

}
