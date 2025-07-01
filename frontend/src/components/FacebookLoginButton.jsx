import React from "react";
import "../components/FacebookLoginButton.css";

function FacebookLoginButton() {
  const handleLogin = () => {
    window.location.href = `http://localhost:5173/auth/facebook`;
  };

  return (
    <button className="fb-login-button" onClick={handleLogin}>
      Login with Facebook
    </button>
  );
}

export default FacebookLoginButton;
