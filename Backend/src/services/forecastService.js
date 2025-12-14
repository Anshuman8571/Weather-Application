const cache = require("../cache")

const FORECAST_TTL = 1800

function cacheKey(city){
    return `forecast:${city.toLowerCase()}`;
}

async function fetchForecast(city, key) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${key}`
    const response = await fetch(url);
    if(!response){
        const err = new Error("Forecase provider error.")
        err.status = response.status
        throw err
    }
    cacheKey(city)
    const data = await response.json()
    const result = data.list.map(item => ({
        time: item.dt_txt,
        temperature: item.main?.temp ?? null,
        humidity: item.main?.humidity ?? null,
        condition: Array.isArray(item.weather) && item.weather[0]? item.weather.main : "Unknown"
    }));
    return result;
}

async function getForecast(city, apiKey) {
    const key = cacheKey(city);

    const cached = await cache.get(key)
    if(cached){
        return {city, forecast:cached, cached:true}
    }

    const forecast = await fetchForecast(city, apiKey);
    await cache.set(key, forecast, FORECAST_TTL)
    return { city, forecast, cached:false}
}

module.exports = { getForecast };