const bcrypt = require("bcrypt")
const db = require("../db")

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10",10)

async function getUserById(userId) {
    const q = `SELECT id, username, email, created_at FROM users WHERE id = $1`;
    const { rows } = await db.query(q, [userId])
    return rows[0] || null;
}

async function updateUser(userId, {username, email}) {
    const q =`
        UPDATE users
        SET username = COALESCE($2, username),
            email = COALESCE($3, email)
        WHERE id = $1
        RETURNING id, username, email, created_id    
    `;
    const { rows } = await db.query(q,[ userId, username, email ])
    return rows[0];
}

async function changePassword(userId, oldPassword, NewPassword) {
    const q = `
        SELECT password_hash
        FROM users WHERE id = $1    
    `
    const { rows } = await db.query(q, [userId])
    if(!rows){
        const err = new Error("User not found");
        err.status = 400
        throw err;
    }

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password_hash)
    if(!isMatch){
        const err = new Error("Old Password is not correct.")
        err.status = 400;
        throw err;
    }

    const newHash = await bcrypt.hash(NewPassword,SALT_ROUNDS)
    await db.query(`UPDATE users SET password_hash = $2 WHERE id = $1`,[userId,newHash])
    return true;
}

module.exports = { getUserById, updateUser, changePassword};