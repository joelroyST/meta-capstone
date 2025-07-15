import React from "react";
import "./AccountModal.css";
import DefaultProfilePic from "../assets/defaultpfp.svg";
import { useNavigate } from "react-router-dom";

const AccountModal = ({ setOpenModal, user, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    setOpenModal(false);
  };

  const handleAccountLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isRemembered");
    localStorage.removeItem("userID");
    handleLogout();
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
          <button onClick={handleAccountLogout}>Logout</button>
          <button>Settings</button>
        </div>
        <div className="profile-section">
          <img src={DefaultProfilePic}></img>
          <p>{user?.name}</p>
        </div>
      </div>
    </div>
  );
};
export default AccountModal;
