import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginSignup from "./components/LoginSignup";
import FantasyBasketball from "./pages/FantasyBasketball";
import LeaguePage from "./pages/LeaguePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/fantasy-basketball" element={<FantasyBasketball />} />
        <Route path="/league/:userId/:leagueId" element={<LeaguePage />} />
      </Routes>
    </Router>
  );
}

export default App;
