import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // ne는 not equal의 약자
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId }, // 내가 보낸 메시지
                { sender: userToChatId, receiver: myId }, // 상대방이 보낸 메시지
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; // 상대방의 ID
        const senderId = req.user._id; // 내 ID

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // 업로드된 이미지 URL
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId); // 상대방의 소켓 ID를 가져옴
        if (receiverSocketId) {
            // to() 메서드를 통해 1:1 소켓 통신을 할 수 있음
            io.to(receiverSocketId).emit("newMessage", newMessage); // 상대방에게 새 메시지 전송
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
