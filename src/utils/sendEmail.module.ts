import { Module } from "@nestjs/common";
import { SendEmailService } from "./sendEmail.service";


@Module({
    controllers: [SendEmailService],
    providers: [SendEmailService],
    exports: [SendEmailService],
  })
  export class SendMailModule {}