// For match history in DB table
// Need : Match id, winner, looser, score winner, score looser, manytomany relation with users

import { IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('gameHistory')
export class GameHistory {
	@PrimaryGeneratedColumn()
	@ApiProperty({ type: Number, description: 'An unique id number attributed to each finished match.' })
	id: number;

	@ApiProperty({ description: 'Winner of match, relation to corresponding user.' })
	@ManyToOne(() => User, user => user.gamesWon)
	winner: User;

	@ApiProperty({ description: 'Looser of match, relation to corresponding user.' })
	@ManyToOne(() => User, user => user.gamesLost)
	looser: User;

	@Column({ type: 'int' })
	@ApiProperty({ type: Number, description: 'Winner score.' })
	@IsNumber()
	winnerScore: number;

	@Column({ type: 'int' })
	@ApiProperty({ type: Number, description: 'Looser score.' })
	@IsNumber()
	looserScore: number;	
}
