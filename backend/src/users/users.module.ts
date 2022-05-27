import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';
import { AvatarsService } from 'src/users/services/avatars.service';
import { Avatar } from './entities/avatar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Avatar]),
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
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, AvatarsService],
  exports: [UsersService, JwtStrategy, PassportModule, JwtModule], //check again
})
export class UsersModule {}
