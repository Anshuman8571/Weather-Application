const express = require("express");
const { getWeather, getHistory } = require("../controllers/weatherController");
const validateRequest = require("../midleware/validateRequest");
const { weatherQueryschema } = require("../validators/weatherValidator");
const authMiddleware = require("../midleware/authMiddleware")
const router = express.Router();

router.get("/weather",validateRequest(weatherQueryschema,"query"),getWeather);
router.get("/history", authMiddleware, getHistory)
module.exports = router