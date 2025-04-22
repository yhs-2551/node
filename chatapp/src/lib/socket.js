import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// 온라인된 모든 사용자 관리를 위한 객체, {userId: socketId} 형식
const userSocketMap = {};

//message.controller.js에서 사용하기 위한 함수. userId를 통해 socketId를 얻어옴
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit은 "모든" 클라이언트에게 이벤트를 전송(방출)하는 데 사용.이때 프론트측에서 getOnlineUsers 이름으로 이벤트를 on으로 수신
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        // 삭제된 사용자 정보를 프론트측 getOnlineUsers에 알림
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
