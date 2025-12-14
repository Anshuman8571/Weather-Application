const express = require("express");
const { getWeather, getHistory, getForecastWeather } = require("../controllers/weatherController");
const validateRequest = require("../midleware/validateRequest");
const { weatherQueryschema } = require("../validators/weatherValidator");
const authMiddleware = require("../midleware/authMiddleware")
const router = express.Router();

router.get("/weather",validateRequest(weatherQueryschema,"query"),getWeather);
router.get("/weather/forecast", authMiddleware, validateRequest(weatherQueryschema,"query"),getForecastWeather)
router.get("/history", authMiddleware, getHistory)
module.exports = router