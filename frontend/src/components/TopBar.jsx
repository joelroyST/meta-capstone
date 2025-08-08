import React from "react";
import DefaultProfilePic from "../assets/defaultpfp.svg";
import "./TopBar.css";
import Trivia from "./Trivia";

const TopBar = ({ onHamburgClick, onProfileClick }) => {
  return (
      <div className="top-section">
        <div
          className="hamburg"
          onClick={onHamburgClick}>
          ☰
        </div>
       <Trivia />
       <div className="profile-help">
        <img
          className="user-profile-icon"
          src={DefaultProfilePic}
          onClick={onProfileClick}></img>
       </div>
        
      </div>
  );
};

export default TopBar;
