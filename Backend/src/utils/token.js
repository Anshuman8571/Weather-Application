const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateAccessToken(payload) {
  console.log("🔥 generateAccessToken called with payload:", payload);
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken
};
