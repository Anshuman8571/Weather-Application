const db = require("../db")
const { hashToken } = require("../utils/token")

async function saveRefreshToken(userId,refreshToken,expires_at) {
    const tokenHash = hashToken(refreshToken);
    await db.query(
        `INSERT INTO refresh_token (user_id, token_hash, expires_in)
        VALUES ($1, $2, $3)`,
        [userId, tokenHash,expires_at]
    );
}

async function findRefreshToken(refreshToken) {
    const tokenHash = hashToken(refreshToken)
    const { rows } = await db.query(
        `SELECT * FROM refresh_token
        WHERE token_hash = $1 AND expires_in > NOW()`,
        [tokenHash]
    )
    return rows[0] || null;
}

async function deleteRefreshToken(refresh_token) {
    const tokenHash = hashToken(refresh_token)
    await db.query(
        `DELETE FROM refresh_token
        WHERE token_hash = $1`,
        [tokenHash]
    )
}

module.exports = { saveRefreshToken, findRefreshToken, deleteRefreshToken}