import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
<<<<<<< HEAD
import { JwtStrategy } from 'src/users/jwt.strategy';
=======
>>>>>>> 1f5650ce0aac2f0fa512a606048a0e5f420f5ab2

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
<<<<<<< HEAD
		PassportModule.register({ defaultStrategy: 'jwt' }),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async () => {
				return {
					secret: process.env.JWT_SECRET,
					signOptions: {
						expiresIn: process.env.JWT_EXPIRATION_TIME,
					},
				};
			},
			inject: [ConfigService],
		})
	],
=======
		PassportModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
				},
			}),
		})],
>>>>>>> 1f5650ce0aac2f0fa512a606048a0e5f420f5ab2
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	exports: [UsersService, JwtStrategy, PassportModule, JwtModule], //check again
})
export class UsersModule { }
