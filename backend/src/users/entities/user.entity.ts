import { IsEmail, IsNumber, IsAlphanumeric } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate,
  OneToOne, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../common/enums/status.enum';
import * as crypto from 'crypto';
import { Avatar } from './avatar.entity';
import { Exclude } from 'class-transformer';
import { Chan } from '../../chat/entities/channel.entity';
import { Message } from '../../chat/entities/message.entity';
import { GameHistory } from '../../game/entities/gamehistory.entity';
import { SocketConnected } from '../../chat/entities/socketsUser';
import { SocketJoined } from '../../chat/entities/sockets-connected-to-channel';

@Entity('users') // sql table will be name 'users'
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number, description: 'An unique id number attributed to user inside database upon creation.' })
  id: number;

  @Column({ type: 'text', unique: true })
  @ApiProperty({ type: String, description: 'User private name. Cannot be modified and must only contains alphabetical characters.' })
  username: string;

  @Column({ type: 'text', unique: true })
  @ApiProperty({ type: String, description: 'User nickname. Can be modified and must only contains alphabetical characters.' })
  @IsAlphanumeric()
  nickname: string;

  @Column({ type: 'text', unique: true })
  @ApiProperty({ type: String, description: 'User email. Must be under email format.' })
  @IsEmail()
  email: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ type: Number, description: "Avatar id (inside avatar table) of user's avatar." })
  avatarId?: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ type: String, description: 'User personal 2FA Secret (optional field)' })
  twoFASecret?: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ type: Boolean, description: 'User as activate 2FA)' })
  is2FAEnabled: boolean;

  @Column({ type: 'int', array: true, default: {} })
  @ApiProperty({ type: [Number], description: 'User friends, identified by unique ids inside an array.' })
  @IsNumber({}, { each: true })
  friends: number[];

  @Column({ type: 'text', default: Status.OFFLINE })
  @ApiProperty({ enum: Status, type: String, description: 'User status, either offline/online/playing.' })
  status: Status;

  // CHAT STUFF --------
  @ApiProperty({ type: [Chan], description: 'Channel the user as joined/created' })
  @ManyToMany(() => Chan, (channel) => channel.users)
  channels: Chan[];

  @ApiProperty({ type: [Message], description: 'Message list the user as sended' })
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ApiProperty({ type: [SocketConnected], description: 'Socket list for all chat service' })
  @OneToMany(() => SocketConnected, (connection) => connection.user)
  connections: SocketConnected[];

  @ApiProperty({ type: [SocketJoined], description: 'Socket list for every channel the user is connected.' })
  @OneToMany(() => SocketJoined, (joinedChannel) => joinedChannel.chan)
  joinedChannels: SocketJoined[];

  @Column({ type: 'int', array: true, default: {} })
  @ApiProperty({ type: [Number], description: 'Blocked user identified by id.' })
  blockedUID: number[];
  //-----------------------

  // GAME -----------------
  @Column({ type: 'int', default: 1000 })
  @ApiProperty({ type: Number, description: 'Elo score, based on Elo chess system and modified after each match.' })
  eloScore: number;

  @ApiProperty({ type: [GameHistory], description: 'History of games won in relation with corresponding gameHistory entity.' })
  @OneToMany(() => GameHistory, (game) => game.winner, { cascade: true })
  gamesWon: GameHistory[];

  @ApiProperty({ type: [GameHistory], description: 'History of games lost in relation with corresponding gameHistory entity.' })
  @OneToMany(() => GameHistory, (game) => game.looser, { cascade: true })
  gamesLost: GameHistory[];
  // ------------------------

  async encryptSecret() {
    if (!this.twoFASecret) {
      return;
    }
    const key = process.env.ENCRYPTION_KEY || '';
    const iv = Buffer.from(crypto.randomBytes(parseInt(process.env.ENCRYPTION_IV_LENGTH)))
      .toString('hex')
      .slice(0, parseInt(process.env.ENCRYPTION_IV_LENGTH));
    const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, Buffer.from(key), iv);
    const encrypted = Buffer.concat([cipher.update(this.twoFASecret), cipher.final()]);
    this.twoFASecret = iv + ':' + encrypted.toString('hex');
    return this.twoFASecret;
  }

  decryptSecret() {
    if (!this.twoFASecret) {
      return null;
    }
    const parts = this.twoFASecret.includes(':') ? this.twoFASecret.split(':') : [];
    const iv = Buffer.from(parts.shift() || '', 'binary');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM,
      Buffer.from(process.env.ENCRYPTION_KEY), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
  }
}
