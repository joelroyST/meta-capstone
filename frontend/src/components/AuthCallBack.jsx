import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallBack() {
  const [isRemembered, setIsRemembered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const remembered = localStorage.getItem("isRemembered") === "true";
    setIsRemembered(remembered);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      if (remembered) {
        localStorage.setItem("token", token);
      }
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>
}

export default AuthCallBack;
