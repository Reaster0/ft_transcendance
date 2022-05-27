import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
 
@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number, description: 'Id to identify avatar.'})
  id: number;
 
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ type: String, description: 'User\'s avatar filename.'})
  avatarFilename?: string;

  @Column({ type: 'bytea', nullable: true })
  @ApiProperty({ type: Buffer, description: 'User\'s avatar buffer.'})
  avatarBuffer?: Uint8Array;
}
