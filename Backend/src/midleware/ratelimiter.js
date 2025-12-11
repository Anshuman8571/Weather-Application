const rateLimit = require("express-rate-limit")

const apiRateLimiter = rateLimit({
    windowMs: 1*60*1000, // 15 minutes
    max:10,
    message: {
        success: false,
        error: "Too many requests. Please try again."
    },
    standardHeaders: true, // These are latest standard rate limit headers which are meant to be used.
    legacyHeaders: false // these headers are older one and not prefered to use as they are not standardized
})

module.exports = apiRateLimiter