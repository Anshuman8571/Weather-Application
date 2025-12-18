const express = require("express"); // This is a web framework 
const cors = require("cors"); // This is required so that browsers from other origin can also call this backend.
const weatherroutes = require("./routes/weatherRoutes")
const apiRateLimiter = require("./midleware/ratelimiter")
const globalErrorHandler = require("./midleware/globalErrorHandler") // This middleware is created to just handle all the errors can be solved simultaneously.
const authMiddleware = require("./midleware/authMiddleware")
const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoutes")
const morgan = require("morgan")


const app = express()
app.use(cors()) // Enables cross origin resource sharing 
app.use(express.json()) // Parses the incoming JSON request bodies and makes them available on req.body. Useful whenyou accept POST/PUT JSON.
app.use(morgan("dev"))
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)

app.use("/api",authMiddleware,apiRateLimiter,weatherroutes)
app.get("/health",(req,res) =>{
    res.send("Server is running...");
})

app.use(globalErrorHandler);
module.exports = app;