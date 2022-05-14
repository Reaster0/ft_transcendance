import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/users/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		ConfigModule,
		JwtModule.registerAsync({
			useFactory: async () => {
				return {
					secret: process.env.JWT_SECRET,
					signOptions: {
						expiresIn: '3600s',
					},
				};
			},
			inject: [ConfigService],
		})
	],
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	exports: [UsersService, JwtStrategy, PassportModule, JwtModule], //check again
})
export class UsersModule { }
