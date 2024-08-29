import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
// import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
  ],
  providers: [ BotUpdate],
})
export class AppModule {}
