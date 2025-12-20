import { useEffect, useState } from "react";
import api from "../api/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  async function fetchHistory() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(
        `/history?page=${page}&limit=${limit}`
      );
      setHistory(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Search History</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && history.length === 0 && (
        <p>No history found.</p>
      )}

      {history.length > 0 && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>City</th>
                <th>Temperature</th>
                <th>Condition</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.city}</td>
                  <td>{item.result?.temperature} °C</td>
                  <td>{item.result?.condition}</td>
                  <td>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={history.length < limit}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10px",
  },
  pagination: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
};
