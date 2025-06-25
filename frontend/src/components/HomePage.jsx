import React, { useState } from "react";
import DefaultProfilePic from "../assets/defaultpfp.svg";
import "./HomePage.css";
import AccountModal from "./AccountModal";

function HomePage() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="homepage">
      <div className="top-section">
        <div className="hamburg">☰</div>
        <section className="favorite-livescores">
          <h2>Favorited Sports/Teams Live Scores</h2>
        </section>
        <img
          className="user-profile-icon"
          src={DefaultProfilePic}
          onClick={handleOpenModal}></img>
      </div>
      <div className="middle-homepage">
        <section className="recommended-section">
          <h3 className="recommended-teams-sports-title">
            Recommended Sports/Team Cards
          </h3>
          <div className="recommended-cards-grid">
            <div className="recommended-card">Team/Sport #1</div>
            <div className="recommended-card">Team/Sport #2</div>
            <div className="recommended-card">Team/Sport #3</div>
            <div className="recommended-card">Team/Sport #4</div>
          </div>
        </section>
        <div className="trending-news">
          <div className="trending-news-card">Popular/Trending Sports News</div>
          <div className="trending-news-card">Popular/Trending Sports News</div>
          <div className="trending-news-card">Popular/Trending Sports News</div>
          <div className="trending-news-card">Popular/Trending Sports News</div>
        </div>
      </div>
      {openModal && <AccountModal setOpenModal={setOpenModal} />}
    </div>
  );
}

export default HomePage;
