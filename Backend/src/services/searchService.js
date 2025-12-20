const db = require("../db")
const { v4: uuidv4 } = require("uuid");

async function saveSearch({userId, city, result}){
    if(!userId) throw new Error("userId required to save search.")
    
    const id = uuidv4();
    const q = `INSERT INTO search_history (id, user_id, city, result) VALUES ($1, $2, $3, $4) RETURNING id, created_at`
    const { rows } = await db.query(q, [id,userId,city,JSON.stringify(result)])
    return rows[0];
}

async function getSearchHistoryByUser(userId, limit = 5,offset = 0) {
    const q = `SELECT id, city, result, created_at FROM search_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`
    const { rows } = await db.query(q, [userId,limit,offset]);
    return rows.map(r => ({
        id: r.id,
        city: r.city,
        result: r.result,
        created_at: r.created_at
    }));
}

module.exports = { saveSearch, getSearchHistoryByUser}