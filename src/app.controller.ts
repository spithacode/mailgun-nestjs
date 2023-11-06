import { Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly emailService:EmailService
  ) {}

 @Post()
 async sendEmail(){
  return this.emailService.send({
    data:{
      title:"Sidlai Assoul",
      content:"content"
    },
    email:"assoulsidali@gmail.com",
    subject:"test",
    templatePath:join("./email-template.ejs")
  })
 }
}
