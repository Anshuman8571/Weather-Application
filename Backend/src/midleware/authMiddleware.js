const jwt = require("jsonwebtoken")
const errorResponse = require("../utils/errorResponse")
const { findUserById } = require("../services/authService")

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return errorResponse(res,401,"Authorization token missing")
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token,JWT_SECRET);
        const user = await findUserById(payload.userId);
        if(!user) return errorResponse(res, 401, "Invalid token: user not found.")
        req.user = { id: user.id, email:user.email, username:user.username}
        next();
    } catch (error) {
        return errorResponse(res,401,"Invalid or expired token.")
    }
}

module.exports = authMiddleware
 