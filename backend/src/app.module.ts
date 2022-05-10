import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'randompass',
      database: 'postgres',
      //host: process.env.DATABASE_HOST,
      //port: +process.env.DATABASE_PORT,
      //username: process.env.DATABASE_USER,
      //password: process.env.DATABASE_PASSWORD,
      //database: process.env.DATABASE_NAME,
      autoLoadEntities: true, //Load automatically entities without specifying the array
      synchronize: true // Synch DB with entities each time we load the app TODO disable when production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
