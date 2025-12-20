import { useState } from "react";
import api from "../api/api";

export default function Weather() {
    const [city,setCity] = useState("");
    const [weather,setWeather] = useState(null);
    const [loading, setaLoading] = useState(false);
    const [error, setError] = useState(null)

    async function handleSearch(e) {
        e.preventDefault();
        setError(null)
        setWeather(null)
        setaLoading(true)

        try {
            const res = await api.get(`/weather?city=${city}`)
            setWeather(res.data);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to fetch weather")

        } finally{
            setaLoading(false);
        }
    }

    return (
        <div style={styles.container}>
      <h2>Weather</h2>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <div style={styles.card}>
          <h3>{weather.city}</h3>
          <p>🌡️ Temperature: {weather.temperature} °C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌥️ Condition: {weather.condition}</p>
          <p>🌬️ Wind Speed: {weather.windspeed} m/s</p>
        </div>
      )}
    </div>
    )
}

const styles = {
  container: {
    padding: "20px",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    width: "300px",
  },
  error: {
    color: "red",
  },
};