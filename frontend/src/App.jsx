import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginSignup from "./Components/LoginSignup";
import FantasyBasketball from "./pages/FantasyBasketball";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/fantasy-basketball" element={<FantasyBasketball />} />
      </Routes>
    </Router>
  );
}

export default App;
