import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
 
@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar)
    private AvatarsRepository: Repository<Avatar>,
  ) {}
 
  async uploadAvatar(avatarFilename: string, avatarBuffer: Buffer, queryRunner: QueryRunner) {
	const newAvatar = await this.AvatarsRepository.create({
      avatarFilename : avatarFilename,
      avatarBuffer: avatarBuffer
    });
    await queryRunner.manager.save(Avatar, newAvatar);
    return newAvatar;
  }
 
  async getAvatarById(avatarId: number) {
    const avatar = await this.AvatarsRepository.findOne(avatarId);
    if (!avatar) {
      return null;
    }
    return avatar;
  }

  async deleteAvatarById(avatarId: number, queryRunner: QueryRunner) {
    const avatar = await queryRunner.manager.delete(Avatar, avatarId);
    if (!avatar.affected) {
      throw new NotFoundException();
    }
  }
}
