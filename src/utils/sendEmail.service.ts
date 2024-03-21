import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class SendEmailService {
    private transporter : Transporter

    constructor (private configService : ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: this.configService.get('Mail_Type'), // 메일 서비스 이름, 나중에 env로 숨김처리
            auth: {
              user: this.configService.get('My_Email'),
              pass: this.configService.get('My_Passowrd'), // 나중에 env로 숨김처리
            },
        });
    }

    async sendInvitationEmail(email : string, token : number) {
        return new Promise((resolve, reject) => {
          const mailOptions = {
            from: this.configService.get('Mail_Type'),
            to: email,
            subject: 'Trelloong 초대 메세지',
            text: `아래에 인증코드를 입력하시면 가입이 완료 됩니다. ${token}`,
          };
    
          this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
          });
        });
    }    
}