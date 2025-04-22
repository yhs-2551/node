// "type": "module" 을 package.json에 추가하여 ES6 모듈을 사용.
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js"; 
import messageRoutes from "./routes/message.route.js"; 
import { app, server } from "./lib/socket.js";

dotenv.config();
 

const PORT = process.env.PORT;

// CORS 미들웨어를 다른 미들웨어보다 먼저 적용
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// 이미지를 base64 형식으로 전송할 때 기본 제한(약 1MB)보다 크면 이런 오류가 발생할 수 있는데, 최대 50MB로 설정
// 근데 프론트에서 base64 형식 대신 파일 크기를 줄여서 보내는 방법이 좋음. 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);  

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
    connectDB();
});
