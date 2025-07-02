import React from "react";
import DefaultProfilePic from "../assets/defaultpfp.svg";
import "./TopBar.css";

const TopBar = ({ onHamburgClick, onProfileClick }) => {
  return (
      <div className="top-section">
        <div
          className="hamburg"
          onClick={onHamburgClick}>
          ☰
        </div>
        <section className="favorite-livescores">
          <h2>Favorited Sports/Teams Live Scores</h2>
        </section>
        <img
          className="user-profile-icon"
          src={DefaultProfilePic}
          onClick={onProfileClick}></img>
      </div>
  );
};

export default TopBar;
