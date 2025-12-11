const express = require("express");
const { getWeather } = require("../controllers/weatherController");
const validateRequest = require("../midleware/validateRequest");
const { weatherQueryschema } = require("../validators/weatherValidator");
const router = express.Router();

router.get("/weather",validateRequest(weatherQueryschema,"query"),getWeather);

module.exports = router