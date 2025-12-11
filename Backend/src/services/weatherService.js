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
        windspeed: data.wind?.speed ?? null
    } 
    return result;
}

module.exports = { getWeatherInfo };