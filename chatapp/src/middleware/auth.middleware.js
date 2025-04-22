import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        // user를 찾고 비밀번호 필드 제외, MongoDB의 버전 관리용 내부 필드(VersionKey)제외. -__v는 불필요한 필드를 제외할 때 사용
        const user = await User.findById(decoded.id).select("-password -__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};
