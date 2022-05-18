import { Controller, Get, Param, UseInterceptors, ClassSerializerInterceptor,
		Res, StreamableFile } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { Readable } from 'stream';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('avatars')
@Controller('avatars')
@UseInterceptors(ClassSerializerInterceptor)
export default class AvatarsController {
	constructor(
		private readonly avatarsService: AvatarsService
	) {}

	@Get(':id')
	async getAvatarById(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		const avatar = await this.avatarsService.getAvatarById(parseInt(id));
		const stream = Readable.from(avatar.avatarBuffer);
		res.set({ 'Content-Disposition': `inline; filename="${avatar.avatarFilename}"`,
			'Content-Type': 'image' })
		return new StreamableFile(stream);
	}
}
