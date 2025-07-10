import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginSignup from "./components/LoginSignup";
import FantasyBasketball from "./pages/FantasyBasketball";
import LeaguePage from "./pages/LeaguePage";
import FantasyRoster from "./pages/FantasyRoster";

function App() {
    const [user, setUser] = useState(null);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/fantasy-basketball" element={<FantasyBasketball user={user} setUser={setUser} />} />
        <Route path="/league/:userId/:leagueId" element={<LeaguePage user={user} setUser={setUser} />} />
        <Route path="/fantasy-roster/:userId/:leagueId" element={<FantasyRoster user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
