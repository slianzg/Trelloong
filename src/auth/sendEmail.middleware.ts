import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // 메일 서비스 이름, 나중에 env로 숨김처리
  auth: {
    // 연동하고자 하는 이메일의 주소와 비밀번호
    user: 'mgeun97@gmail.com',
    pass: 'dgdsfgdfgdgdfgdfgfdgsdf', // 나중에 env로 숨김처리
  },
});

export const sendInvitationEmail = (email, token) => {
    return new Promise((resolve, reject) => {
  // 발송 메일의 발송자, 수신자, 제목, 내용 등 설정
  const mailOptions = {
    from: 'mgeun97@gmail.com', // 발송자 이메일 주소
    to: email, // 넘겨받을 수신자 이메일 주소
    subject: 'Trelloong 초대 메세지', // 발송 메일 제목
    text: `아래에 인증코드를 입력하시면 가입이 완료 됩니다. ${token}`, // 발송 메일 내용
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        reject(error)
    } else {
        resolve(info)
    }
  })
})
};
