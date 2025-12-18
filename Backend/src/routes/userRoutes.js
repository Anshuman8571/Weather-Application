const express = require("express")
const router = express.Router()
const authMiddleware = require("../midleware/authMiddleware")
const { getMe, updateMe,changeMyPassword } = require("../controllers/userController")


router.get("/me", authMiddleware, getMe)
router.put("/me",authMiddleware, updateMe);
router.put("/change-password",authMiddleware,changeMyPassword)

module.exports = router