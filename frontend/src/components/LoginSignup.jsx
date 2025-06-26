import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import userIcon from "../assets/userIcon.png";
import emailIcon from "../assets/emailIcon.png";
import passwordIcon from "../assets/passwordIcon.png";

const LoginSignup = () => {
  const [loginInfo, setLoginInfo] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => {
    setLoginInfo(!loginInfo);
  };

  return (
    <div className="login-signup-container">
      <div className="page-container">
        <div className="back-arrow" onClick={() => navigate("/")}>
          🔙
        </div>
        <div className="header">
          <div className="text">{loginInfo ? "Login" : "Sign Up"}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {!loginInfo && (
            <div className="input">
              <img src={userIcon}></img>
              <input type="text" placeholder="Username"></input>
            </div>
          )}
          <div className="input">
            <img src={emailIcon}></img>
            <input className="email" placeholder="Email"></input>
          </div>
          <div className="input">
            <img src={passwordIcon}></img>
            <input type="password" placeholder="Password"></input>
          </div>
        </div>
        {loginInfo && (
          <div className="forgot-password">
            Lost Password? <span>Click Here</span>
          </div>
        )}
        <div className="submit-container">
          <div className="submit">{loginInfo ? "Login" : "Sign Up"}</div>
        </div>
        <div className="toggle-mode">
          {loginInfo ? (
            <p>
              Don't have an account?
              <span onClick={toggleMode}> Sign Up</span>
            </p>
          ) : (
            <p>
              Already have an account? <span onClick={toggleMode}>Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
