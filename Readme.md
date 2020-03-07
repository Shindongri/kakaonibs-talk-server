# KAKAONIBS Chat Service - Server

[![typescript](https://img.shields.io/badge/typescript-v.3.7.2-blue)](https://www.typescriptlang.org/)
[![express](https://img.shields.io/badge/express-v.4.17.1-yellow)](https://expressjs.com/ko/)
[![mongoose](https://img.shields.io/badge/mongoose-v.5.9.2-critical)](https://mongoosejs.com/)
[![socket.io](https://img.shields.io/badge/socket.io--client-v.2.3.0-black)](https://socket.io)

## Prerequisites

- [Node.js](https://nodejs.org/ko/)
- [Yarn](https://yarnpkg.com/)

## Installation

### 1. Clone the project

```bash
$ git clone https://github.com/Shindongri/kakaonibs-talk-server.git
```

### 2. Install Packages

```bash
$ yarn (install)
```

### 3. Environment Variables (.env)

```
PORT = 8080
COOKIE_SECRET = @#@$KAKAONIBS#@$#$
MONGO_URI = mongodb+srv://kakao:166366@cluster0-dxrc8.mongodb.net
MONGO_DB = kakao
```

### 4. Start Application

```bash
$ yarn start
```

## Description

> ### 과제
>
> - 채팅 어플리케이션 만들기
>
> ### 기능
>
> - 사용자는 첫 진입 시, ID를 입력하여 접속할 수 있다.
> - 채팅방 리스트에서 채팅방을 선택하여 들어갈 수 있다.
> - 채팅방에 다른 사용자를 초대할 수 있다.
> - 사용자는 채팅방에서 텍스트를 입력할 수 있다.
> - 사용자는 채팅방에서 이미지를 입력할 수 있다.

> ### 과제 요구사항
>
> - Client side rendering으로 개발
> - 언어에 대한 제한은 없음
> - 서버 구현 방법에 대한 제한 없음 (REST API, Long Polling, Socket...)
> - 프론트엔드 구현 방법은 제한 없음 (Angular, React, Preact, Vue, jQuery...)
> - UI 구현에 대한 제약은 없음
> - 단위 테스트 필수, UI 테스트(Storybook, Selenium)와 통합 테스트는 선택
> - README.md 파일에 문제해결 전략 및 프로젝트 빌드, 실행 방법 명시

> ### 예시 및 설명
>
> - 위 언급되지 않은 내용에 대해서는 자유롭게 작성할 수 있다.

## DB

**MongoDB Altas** ([https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

### API Endpoints

_- Room_

- [GET] 채팅방 목록 조회 (`/room`)
- [GET] 채팅방 상세 조회 (`/room/:roomId`)
- [POST] 채팅방 생성 (`/room`)
- [DELETE] 채팅방 제거 (`/room/:roomId`)
- [POST] 채팅방 초대 (`/room/:roomId/invite`)
- [POST] 채팅하기 (`/room/:roomId/chat`)
- [POST] 이미지 전송하 (`/room/:roomId/image`)

_- User_

- [GET] 유저 목록 (`/user`)
- [POST] 로그인 (`/user/signin`)
- [POST] 로그아웃 (`/user/signout`)

### 구조 설계

```
src
├── assets
│   └── images
├── routes
│   ├── index.ts
│   ├── room.ts
│   └── user.tsx
├── schemas
│   ├── chat.ts
│   ├── room.ts
│   └── user.ts
├── server.ts
└── socket.ts
```

## Main Dependencies

- **socket.io |** https://socket.io/
- **express |** https://expressjs.com/ko/
  : Node.js Web Framework
- **mongoose |** https://mongoosejs.com/
  : elegant mongodb object modeling for node.js (ODM)
- **lodash |** https://lodash.com/docs/4.17.15
  : A modern JavaScript utility library delivering modularity, performance & extras.
- **multer |** https://www.npmjs.com/package/multer
  : Multer is a node.js middleware for handling multipart/form-data.
