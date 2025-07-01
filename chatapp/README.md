# ChatApp 백엔드 API

실시간 채팅 애플리케이션을 위한 Express.js 기반 백엔드 API

## 기술 스택

- **Node.js & Express**: RESTful API 구현
- **Socket.io**: 실시간 채팅 및 온라인 상태 관리
- **MongoDB**: 사용자 및 메시지 데이터 저장
- **JWT**: 사용자 인증
- **Cloudinary**: 이미지 업로드 및 저장 

## 주요 기능

- **사용자 관리**: 회원가입, 로그인, 로그아웃, 인증 상태 확인
- **메시지 처리**: 실시간 메시지 전송, 이미지 첨부, 대화 내역 조회
- **실시간 상태**: 사용자 온라인/오프라인 상태 실시간 업데이트
- **보안**: JWT 기반 인증 관리

## 주요 API 엔드포인트

### 인증 관련 (Auth)
- POST `/api/auth/signup`: 새 사용자 등록
- POST `/api/auth/login`: 로그인 및 JWT 토큰 발급
- POST `/api/auth/logout`: 로그아웃
- GET `/api/auth/check`: 인증 상태 확인

### 메시지 관련 (Message)
- GET `/api/message/:id`: 특정 사용자와의 대화 내역 조회
- POST `/api/message/send/:id`: 특정 사용자에게 메시지 전송
- GET `/api/message/users`: 본인 제외한 사용자 목록 조회

## 관련 프론트엔드: [react-chatapp](https://github.com/yhs-2551/react-next/tree/main/react-chatapp)