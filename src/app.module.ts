import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController, ChatController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ChatController],
  providers: [AppService],
})
export class AppModule {}
