import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login")
    }

    return (
        <nav style={styles.nav}>
            <h3>🌤 Weather App</h3>

            <div style={styles.links}>
                <Link to="/weather">Weather</Link>
                <Link to="/forecast">Forecast</Link>
                <Link to="/history">History</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
};