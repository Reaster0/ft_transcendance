import { ApiProperty } from '@nestjs/swagger';
import { ERoles } from 'src/users/enums/roles.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('int') // plus simple quune relation lets go
  userId: number;

  //change this to number is front end is ok
  @Column({ type: 'text', default: ERoles.user })
  @ApiProperty({ enum: ERoles, type: String, description: 'channel user roles, either owner/admin/user.' })
  role: ERoles;

  @Column({ nullable: true, type: 'timestamptz' })
  muteDate: Date;

  @ManyToOne(() => Channel, channel => channel.channelUsers, {onDelete: 'CASCADE'} )
  @JoinColumn()
  channel: Channel;
}
