const errorResponse = require("../utils/errorResponse")
const {registerUser,loginUser} = require("../services/authService")
const { generateAccessToken, generateRefreshToken } = require("../utils/token")
const { saveRefreshToken, findRefreshToken, deleteRefreshToken} = require("../services/refreshTokenService")

async function register(req,res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return errorResponse(res,400,"Username, email and password is required.")
        }

        const user = await registerUser({ username,email,password })
        return res.status(201).json({success:true, user})
    } catch (error) {
        return errorResponse(res,error.status || 500, error.message || "Regsitration Failed.")
    }
}

async function login(req,res){
    try {
        const { email, password } = req.body;
        if(!email || !password) return errorResponse(res,400,"email and password are required.")
        const result = await loginUser({email,password});
        console.log(`🧨🧨UserId:${result.user.id}`)
        const accessToken = generateAccessToken({ id: result.user.id }) //
        const refreshToken = generateRefreshToken()
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate()+7);
        await saveRefreshToken(result.user.id,refreshToken, expiresAt)

        return res.json({ success:true, accessToken, refreshToken });
    } catch (error) {
        return errorResponse(res,error.status || 500, error.message || "Login Failed.")
    }
}

async function refresh(req,res) {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) return errorResponse(res,400,"Refresh token is required.");
        
        const storedToken = await findRefreshToken(refreshToken)
        if(!storedToken) return errorResponse(res,401,"Invalid or expired refreshToken.")

        const newAccessToken = generateAccessToken({
            id: storedToken.user_id // 
        })
        
        return res.json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        return errorResponse(res, 500, "Failed to refresh Token")
    }
}

async function logout(req, res) {
    try {
        const {refreshToken} = req.body;
        if(refreshToken) await deleteRefreshToken(refreshToken)
                
        return res.json({ success: true })
    } catch (error) {
        return errorResponse(res, 500, "Logout failed.")
    }
}

module.exports = { register, login, refresh, logout};