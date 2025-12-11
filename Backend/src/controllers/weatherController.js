const errorResponse = require("../utils/errorResponse")
const { getWeatherInfo } = require("../services/weatherService")

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
            const {savesearch} = require("../services/searchService")
            savesearch({userId: req.user.id,city,result}).catch(err => console.log("Save search failed",err));
        }
        return res.json(result);

    } catch (error) {
        if(error.status === 404){
            return errorResponse(res,404,"City not found.");
        }

        console.error("Weather controller error",error);
        return errorResponse(res,502,"Error fetching the provider.");
    }
}

module.exports = { getWeather };