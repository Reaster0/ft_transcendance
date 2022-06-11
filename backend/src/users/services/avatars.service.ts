import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Avatar } from '../entities/avatar.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar)
    private AvatarsRepository: Repository<Avatar>,
  ) {}

  async uploadAvatar(avatarBuffer: Buffer, queryRunner: QueryRunner): Promise<Avatar> {
    let avatarFilename = uuid();
    let avatar = await this.AvatarsRepository.findOne({ avatarFilename: avatarFilename });
    while (avatar) {
      avatarFilename = uuid();
      avatar = await this.AvatarsRepository.findOne({ avatarFilename: avatarFilename });
    }
    const newAvatar = await this.AvatarsRepository.create({ avatarFilename: avatarFilename, avatarBuffer: avatarBuffer });
    await queryRunner.manager.save(Avatar, newAvatar);
    return newAvatar;
  }

  async getAvatarById(avatarId: number): Promise <Avatar> {
    const avatar = await this.AvatarsRepository.findOne(avatarId);
    if (!avatar) {
      return null;
    }
    return avatar;
  }

  async deleteAvatarById(avatarId: number, queryRunner: QueryRunner): Promise<void> {
    const avatar = await queryRunner.manager.delete(Avatar, avatarId);
    if (!avatar.affected) {
      throw new NotFoundException();
    }
  }
}
