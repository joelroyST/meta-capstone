import React from "react";
import "./AccountModal.css";
import DefaultProfilePic from "../assets/defaultpfp.svg";
import { useNavigate } from "react-router-dom";

const AccountModal = ({ setOpenModal }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    setOpenModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isRemembered");
    localStorage.removeItem("userID");
    navigate("/");
    setOpenModal(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setOpenModal(false)}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-button" onClick={() => setOpenModal(false)}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleLogout}>Logout</button>
          <button>Settings</button>
        </div>
        <div className="profile-section">
          <img src={DefaultProfilePic}></img>
          <p>Username</p>
        </div>
      </div>
    </div>
  );
};
export default AccountModal;
