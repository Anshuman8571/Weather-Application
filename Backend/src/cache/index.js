const { createClient } = require("redis")
const { LRUCache } = require("lru-cache")

const useRedis = (process.env.USE_REDIS || "true").toLowerCase() === "true"; 
const ttlSeconds = parseInt(process.env.WEATHER_CACHE_TTL || "300",10)

if(useRedis && process.env.REDIS_URL){
    const client = createClient({ url: process.env.REDIS_URL });

    client.on("error", (err) =>{
        console.error("Redis Client error.",err);
    })

    async function connectRedis() {
        if(!client.isOpen){
            await client.connect();
            console.log("Connected to Redis");
        }
    }
    // Optional
    connectRedis().catch((err) => {
        console.error("Failed to connect to Redis",err)
    })
    
    async function get(key) {
        try {
            const raw = await client.get(key)
            if(!raw) return null;
            return JSON.parse(raw)
        } catch (error) {
            console.error("Redis GET error.",error)
            return null;
        }
    }
    
    async function set(key, value, ttl = ttlSeconds) {
        try {
            await client.set(key, JSON.stringify(value), {EX: ttl});
        } catch (error) {
            console.error("Redis DEL error:", error)
        }
    }

    async function del(key) {
        try {
            await client.del(key);
        } catch (error) {
            console.error("Redis DEL error:", error)
        }
    }
    module.exports = { get, set, del, client}
}  else {
    const cache = new LRUCache({
        max: 500,
        ttl: ttlSeconds * 1000
    });

    async function get(key) {
        const v = cache.get(key);
        return v === undefined ? null : v;
    }

    async function set(key, value, ttl = ttlSeconds) {
        cache.set(key,value, {ttl:(ttl || ttlSeconds) * 1000});
    }

    async function del(key) {
        cache.delete(key);
    }

    console.log("Using in-memory cache(LRU). Set USE_REDIS=tru and REDIS_URL to use REDIS")
    module.exports = { get, set, del, cache}
}

