import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import DefaultProfilePic from "../assets/defaultpfp.svg";
import "./HomePage.css";
import AccountModal from "./AccountModal";
import { useEffect } from "react";

function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      return;
    }

    async function fetchUserData() {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        const data = await res.json();

        if(data.user) {
          setUser(data.user);
          localStorage.setItem("userID", data.user.id)
        } else {
          setUser(null)
        }
      }
      catch {
        setUser(null)
      }
    }
    fetchUserData();
  },[])


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
          {/* TODO make each card able to redirect the user to the specified page */}
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
