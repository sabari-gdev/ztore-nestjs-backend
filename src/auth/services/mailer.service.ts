import { Injectable, Logger } from '@nestjs/common';
import { MailerConfig } from '../mailer.config';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private readonly logger: Logger;

  constructor(private mailerConfig: MailerConfig) {
    this.logger = new Logger(MailerService.name);
  }

  async sendVerificationEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<boolean> {
    this.logger.log('Sending verification email!');

    const mailOptions: Mail.Options = {
      from: process.env.SMPT_MAIL,
      to,
      subject,
      text: body,
    };

    try {
      const info = await this.mailerConfig.transporter.sendMail(mailOptions);
      this.logger.log('Verification email sent: ', info.response);

      return true;
    } catch (e) {
      this.logger.error('Error while sending verification email: ', e);

      return false;
    }
  }
}
