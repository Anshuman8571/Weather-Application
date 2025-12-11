const errorResponse = require("../utils/errorResponse")
const {registerUser,loginUser} = require("../services/authService")
async function register(req,res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password){
            return errorResponse(res,400,"Username, email and password is required.")
        }

        const user = await registerUser({username,email,password})
        return res.status(201).json({success:true, user})
    } catch (error) {
        return errorResponse(res,error.status || 500, error.message || "Regsitration Failed.")
    }
}

async function login(req,res){
    try {
        const { email, password } = req.body;
        if(!email || !password) return errorResponse(res,400,"email and password are required.")
        const result= await loginUser({email,password});
        return res.json({ success:true, ...result });
    } catch (error) {
        return errorResponse(res,error.status || 500, error.message || "Login Failed.")
    }
}

module.exports = { register, login};