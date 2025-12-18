const errorResponse = require("../utils/errorResponse")
const { getUserById,updateUser, changePassword } = require("../services/userService")

async function getMe(req,res) {
    try {
        const user = await getUserById(req.user.id);
        if(!user) return errorResponse(res,404,"User not found.")
        return res.json({success:true,user})
    } catch (error) {
        return errorResponse(res, 500, "Failed to fetch profile.")
    }
}

async function updateMe(req, res) {
    try {
        const { username, email } = req.body
        const user = await updateUser(req.user.id, { username,email });
        return res.json({ success: true, user})
    } catch (error) {
        return errorResponse(res, 500, "Failed to update profile.")
    }
}

async function changeMyPassword(req,res) {
    try {
        const { oldPassword, newPassword } = req.body;
        if(!oldPassword || !newPassword) return errorResponse(res, 400,"Both passwords are required.")
        await changePassword( req.user.id, oldPassword, newPassword )
        return res.json({ success: true, message: "Password updated"}) 
    } catch (error) {
        return errorResponse(res, error.status || 500, error.message)
    }
}

module.exports = { getMe, updateMe, changeMyPassword}