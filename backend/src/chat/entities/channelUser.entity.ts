import { boolean } from 'joi';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class ChanUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int') // plus simple quune relation lets go
  userID: number;

  @Column({ nullable: true, type: 'timestamptz' })
  mute: Date;

  @Column('boolean')
  isOwner: boolean;

  /* no sure the followings are needed */
/*
  @Column('boolean')
  isBan: boolean;
*/
  @Column('boolean')
  isAdmin: boolean; // redondant

  // add owener field ?

  /*
  @Column({ nullable: true, type: 'timestamptz' })
  ban: Date; 
  */


  /*-------------------------------------
               - Relations -
    --------------------------------------*/

 /*
	@ManyToOne(() => Channel, channel => channel.socketJoined, {onDelete:'CASCADE'})
	@JoinColumn()
	channel: Channel;
  */
  /*
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  */

  // en fait c'est peut etre une relation manyToOne que dont jai besoin :O

  @ManyToOne(() => Channel, channel => channel.chanUsers, {onDelete: 'CASCADE'} )
  @JoinColumn()
  channel: Channel;
}
