const cache = require("../cache")
async function getWeatherInfo(city,apikey) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apikey}`;
    // const url = process.env.api_key;
    const response = await fetch(url)

    if(!response.ok){
        const error = new Error("Weather provider error.")
        error.status = response.status;
        throw error
    }

    const data = await response.json();

    const result = {
        city : data.name || city,
        temperature: data.main?.temp ?? null,
        humidity: data.main?.humidity ?? null,
        condition: Array.isArray(data.weather) && data.weather[0] ? data.weather[0].main : (data.weather?.main ?? "Unknown"),
        windspeed: data.wind?.speed ?? null,
        fetched_at: new Date().toISOString()
    } 
    return result;
}

async function cacheKeyForCity(city) {
    return `weather:${String(city).trim().toLowerCase()}`
}

async function getWeatherFromProvider(city, apikey) {
    const key = cacheKeyForCity(city);

    try{
        const cached = cache.get(key);
        if(cached){
            return { ...cached, cached:true};
        }
    } catch(err){
        console.log("Cache read error (continuing) :", err)
    }
    const result = await getWeatherInfo(city, apikey)

    try{
        await cache.set(key, result);
    } catch(err){
        console.err("Cache set error (non-fatal):",err)
    }

    return { ...result, cached:false }
}

module.exports = { getWeatherInfo, getWeatherFromProvider };