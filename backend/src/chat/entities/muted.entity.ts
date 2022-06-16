import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Muted {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('int') // plus simple quune relation lets go
  userId: number;

  @Column({ nullable: true, type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Channel, channel => channel.muted, {onDelete: 'CASCADE'} )
  @JoinColumn()
  channel: Channel;
}
