import { useState } from "react";
import api from "../api/api";

export default function Forecast(){
    const [city, setCity] = useState("");
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error,setError] = useState(null)

    async function handleFetch(e) {
        e.preventDefault();
        setError(null)
        setForecast([]);
        setLoading(true);

        try {
            const res = await api.get(`/weather/forecast?city=${city}`);
            setForecast(res.data.forecast || [])
        } catch (error) {
            setError(error.response?.data?.error || "Failed to fetch forecast.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <h2>Weather Forecast</h2>

            <form onSubmit={handleFetch} style={styles.form}>
                <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                />
                <button type="submit">Get Forecast</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {forecast.length > 0 && (
                <div style={styles.list}>
                {forecast.map((item, index) => (
                    <div key={index} style={styles.card}>
                    <p>📅 {new Date().toLocaleDateString()}</p>
                    <p>📅 {item.time}</p>
                    <p>🌡️ Temp: {item.temperature} °C</p>
                    <p>🌥️ {item.humidity}</p>
                    </div>
                ))}
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
  list: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    width: "200px",
  },
  error: {
    color: "red",
  },
};