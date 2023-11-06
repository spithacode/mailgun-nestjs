import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      isGlobal:true,
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
