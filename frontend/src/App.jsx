import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginSignup from "./components/LoginSignup";
import FantasyBasketball from "./pages/FantasyBasketball";
import LeaguePage from "./pages/LeaguePage";
import FantasyRoster from "./pages/FantasyRoster";
import PlayerMarketplace from "./pages/PlayerMarketplace";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      fetch("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        });
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} setUser={setUser} handleLogout={handleLogout} />}
        />
        <Route path="/login" element={<LoginSignup />} />
        <Route
          path="/fantasy-basketball"
          element={<FantasyBasketball user={user} setUser={setUser} handleLogout={handleLogout} />}
        />
        <Route
          path="/league/:userId/:leagueId"
          element={<LeaguePage user={user} setUser={setUser} handleLogout={handleLogout} />}
        />
        <Route
          path="/:userId/:leagueId/fantasyteam"
          element={<FantasyRoster user={user} setUser={setUser} handleLogout={handleLogout} />}
        />
        <Route
          path="/player-marketplace"
          element={<PlayerMarketplace user={user} setUser={setUser} handleLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;