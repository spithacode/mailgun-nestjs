import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import { IMailgunClient  } from 'mailgun.js/Interfaces';
interface SendEmailParams {
  email: string;
  subject: string;
  templatePath?: string;
  data: Object;
  attachment?: any;
  inline?: any;
}

@Injectable()
export class EmailService {
  private readonly mailgun: Mailgun;
  private readonly mailGunClient: IMailgunClient;
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly configService: ConfigService) {
    this.mailgun = new Mailgun(FormData);
    this.mailGunClient = this.mailgun.client({
      key: this.configService.get('MAILGUN_API_KEY'),
      username: 'api',
      url:this.configService.get('MAILGUN_HOST'),
    });
  }
  async send({ email, subject, templatePath, data , attachment = undefined,inline=undefined}: SendEmailParams) {
    this.logger.log(
      `sending email to ${email} with subject ${subject} , payload: ${JSON.stringify(
        data,
      )}`,
    );
      const file = await fs.readFile(templatePath, 'utf8');
       const html = ejs.render(file, {
        email,
        frontendUrl: this.configService.get('FRONTEND_URL'),
        ...data,
      });
      
      try {
        
        const options: MailgunMessageData = {
          from: this.configService.get('FROM_EMAIL'),
          to: email,
          subject,
          inline,
          html,
          attachment
        };
      return await this.mailGunClient.messages.create(
        this.configService.get('DOMAIN'),
        options,
      );
    } catch (err) {
      this.logger.error(
        `Error sending email to ${email} with subject ${subject} , payload: ${JSON.stringify(
          data,
        )} ` + err,
      );
      throw new InternalServerErrorException(
        `Error sending email to ${email} with subject ${subject} , payload: ${JSON.stringify(
          data,
        )}`,
      );
    }
 

}}
