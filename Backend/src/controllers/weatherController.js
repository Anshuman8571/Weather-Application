const errorResponse = require("../utils/errorResponse")
const { getWeatherInfo } = require("../services/weatherService")
const { saveSearch, getSearchHistoryByUser } = require("../services/searchService")
const { getForecast } = require("../services/forecastService")
async function getWeather(req,res) {
    try {
        const city = (req.query.city || "").trim()
        if(!city){
            return errorResponse(res,400,"Please enter the city name...");
        }

        const apikey = process.env.key;
        if(!apikey){
            return errorResponse(res,500,"Server Configuration Error")
        }

        const result = await getWeatherInfo(city,apikey);
        if(req.user && req.user.id){
            try {
                await saveSearch({ userId: req.user.id, city, result })
            } catch (error) {
                console.error("Failed to save search history",error)
            }
        }
        console.log("req.user =", req.user)
        return res.json(result);

    } catch (error) {
        if(error.status === 404){
            return errorResponse(res,404,"City not found.");
        }

        console.error("Weather controller error",error);
        return errorResponse(res,502,"Error fetching the provider.");
    }
}

async function getHistory(req,res) {
    try {
        const userId = req.user && req.user.id
        if(!userId) return errorResponse(res, 401, "Unauthorized")
        const page = parseInt(req.query.page || "1", 10)
        const limit = Math.min(parseInt(req.query.limit || "5",10), 200);
        const offset = (page - 1) * limit; // Here offset means how many entries we need to skip like in starting 0 entry will be skipped so first 5 entries will be shown and then 5 entries will be skipped so the next 5 entries will be shown.
        const rows = await getSearchHistoryByUser(userId, limit, offset); 
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Get history error: ", error);
        return errorResponse(res,500,"Failed to fetch history.");
    }
}

async function getForecastWeather(req, res) {
    try {
        const city = (req.query.city || "").trim()
        if(!city) return errorResponse(res,400,"City is required.")
        
        const apiKey = process.env.key;
        if(!apiKey) return errorResponse(res,500, "Server configuration error.")
            
        const result = await getForecast(city,apiKey)
        return res.json(result)
    } catch (error) {
        if(error.status === 404) return errorResponse(res, 404, "City not found")
        console.log("Forecast error:", error)
        return errorResponse(res,502,"Failed to fetch forecast")
    }
}
module.exports = { getWeather, getHistory, getForecastWeather};