const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
// const { findUserByEmail, findUserById, saveUser} = require("../utils/userStore")
const db = require("../db/index")

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPRESS_IN || "1h";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10",10)

if(!JWT_SECRET){
    console.warn("Warning: JWT_SECRET is not set. Set it in .env for production.")
}

async function findUserByEmail(email) {
    const q = `SELECT id, username, email, password_hash FROM users WHERE email = $1 LIMIT 1`;
    const { rows } = await db.query(q, [email]);
    return rows[0] || null;
}

async function findUserById(id) {
    const q = `SELECT id, username, email FROM users WHERE id = $1 LIMIT 1`;
    const { rows } = await db.query(q,[id]);
    return rows[0] || null;
}

async function registerUser({username, email,password}) {
    const existing = await findUserByEmail(email);
    if(existing){
        const err = new Error("User already exists with this email.")
        err.status = 400
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = uuidv4();

    const insertQ = `INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username, created_at`;
    const { rows } = await db.query(insertQ, [id, username, email, passwordHash])
    return rows[0]
}

async function loginUser({ email,password }){
    if(!email || !password){
        const err = new Error("email and password are required.")
        err.status = 400
        throw err;
    }

    const user = await findUserByEmail(email)
    if(!user){
        const err = new Error("Invalid Credentials.")
        err.status = 401
        throw err;
    }

    if(!user.password_hash){
        const err = new Error("User record invalid(no password hash)")
        err.status = 500
        throw err;
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if(!match){
        const err = new Error("Invalid Credentials");
        err.status = 401
        throw err;
    }

    const payload = {userId: user.id, email:user.email}
    const token = jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

    return {token, expiresIn:JWT_EXPIRES_IN, user:{id:user.id, username:user.username, email:user.email}}
}


module.exports = { registerUser,loginUser,findUserById };
