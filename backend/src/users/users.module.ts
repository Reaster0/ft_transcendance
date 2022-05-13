import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({defaultStrategy: 'jwt'}),
		ConfigModule,
		JwtModule.register({ //or registerAsync
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: process.env.JWT_EXPIRATION,
			},
			}),
		],
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	exports: [UsersService, JwtStrategy, PassportModule],
})
export class UsersModule {}
