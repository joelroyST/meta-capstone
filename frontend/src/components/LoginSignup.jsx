import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    window.open("http://localhost:5000/auth/facebook", "_self")
  }

  return (
    <div className="login-signup-container">
      <div className="page-container">
        <div className="back-arrow" onClick={() => navigate("/")}>
          🔙
        </div>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="submit-container">
          <button className="fb-login-button" onClick={handleFacebookLogin}>Login with Facebook</button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
