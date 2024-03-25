# Trelloong  
- <a href="https://www.youtube.com/watch?v=5LRXkGrG3n8">시연 영상</a> 
- <a href="https://drawsql.app/teams/team-2920/diagrams/trelloong">ERD</a>
- <a href="https://www.notion.so/teamsparta/b62780932c6d43daa8967fdc561ec2b7?v=398f642500b04107a67f84cb94d489d8">API 명세서</a>
- <a href="https://www.notion.so/teamsparta/d3a492dafc0745f7b2ebbe2b0c4be74b?pvs=4#0d5bd3f407764d8cb3a45823a0d795fd">와이어프레임</a>
- <a href="https://www.notion.so/teamsparta/d3a492dafc0745f7b2ebbe2b0c4be74b">팀 노션 링크</a>
- `.env`
  - DB_HOST
  - DB_PORT
  - DB_USERNAME
  - DB_PASSWORD
  - DB_NAME
  - DB_SYNC
  - JWT_SECRET_KEY
  - Mail_Type
  - My_Email
  - My_Passowrd
   
- ***keyword***  
  `Nest.js` `TypeORM` `jsonwebtoken` `nodemailer` `bcrypt` `mysql` `AWS EC2` `AWS RDS` `swagger`

개발 기간 : 2024.03.18 ~ 2024.03.25 프로젝트 기간 끝

## 웅웅!(10조) 팀원

**서 린** https://github.com/slianzg 
역할: 팀장, PR 관리, 유저관련CRUD, Guard 기능

**김성진** https://github.com/castlejinni1226
역할: 댓글 CRUD, 카드 마감날짜 지정 기능, 발표, 시연영상제작

**노세웅** https://github.com/cocojerry1
역할: 컬럼 CRUD, 컬럼 순서이동 기능, 와이어프레임 제작

**문상웅** https://github.com/tkddnd010
역할: 카드 CRUD, 카드의 이동(컬럼,순서) 기능

**조민근** https://github.com/alsgeun
역할: 서기, 보드 CRUD, nodemailer로 초대 기능, Guard 기능, EC2 배포

## 구현 기능
- 필수 구현 목록
    - **사용자 관리 기능**
        - [x]  로그인 / 회원가입 기능
        - [x]  사용자 정보 수정 및 삭제 기능
    - **보드 관리 기능**
        - [x]  보드 생성
        - [x]  보드 수정
            - 보드 이름
            - 배경 색상
            - 설명
        - [x]  보드 삭제
            - 생성한 사용자만 삭제를 할 수 있습니다.
        - [x]  보드 초대
            - 특정 사용자들을 해당 보드에 초대시켜 협업을 할 수 있어야 합니다.
    - **컬럼 관리 기능**
        - [x]  컬럼 생성
            - 보드 내부에 컬럼을 생성할 수 있어야 합니다.
            - 컬럼이란 위 사진에서 Backlog, In Progress와 같은 것을 의미해요.
        - [x]  컬럼 이름 수정
        - [x]  컬럼 삭제
        - [x]  컬럼 순서 이동
            - 컬럼 순서는 자유롭게 변경될 수 있어야 합니다.
                - e.g. Backlog, In Progress, Done → Backlog, Done, In Progress
    - **카드 관리 기능**
        - [x]  카드 생성
            - 컬럼 내부에 카드를 생성할 수 있어야 합니다.
        - [x]  카드 수정
            - 카드 이름
            - 카드 설명
            - 카드 색상
            - 작업자 할당
            - 작업자 변경
        - [x]  카드 삭제
        - [x]  카드 이동
            - 같은 컬럼 내에서 카드의 위치를 변경할 수 있어야 합니다.
            - 카드를 다른 컬럼으로 이동할 수 있어야 합니다.
    - **카드 댓글 기능**
        - [x]  댓글 CRUD
            - 협업하는 사람들끼리 카드에 대한 토론이 이루어질 수 있어야 합니다.
        - [x]  마감 날짜 지정
            - 카드에 마감일을 설정하고 관리할 수 있어야 합니다.
---
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
