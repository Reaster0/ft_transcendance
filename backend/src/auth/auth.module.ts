import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
//import { JwtStrategy } from './strategies/jwt.strategy';
import { OauthStrategy42 } from './strategies/oauth-42.strategy';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    /*
    PassportModule,
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
    */
   forwardRef(() => UsersModule)
  ],
  providers: [AuthService, /*JwtStrategy,*/ OauthStrategy42],
  controllers: [AuthController]
})

export class AuthModule {}
