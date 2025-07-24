import React, { isValidElement, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import AccountModal from "../Components/AccountModal";
import { useEffect } from "react";
import SidebarModal from "../components/SideBarModal";
import TopBar from "../components/TopBar";
import LoadingPage from "../components/LoadingPage";

function HomePage({ user, setUser, handleLogout }) {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      return;
    }

    async function fetchUserData() {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("token", token);
          localStorage.setItem("userID", data.user.id);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="homepage">
          <TopBar
            onHamburgClick={() => setOpenSidebar((prev) => !prev)}
            onProfileClick={handleOpenModal}
          />
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
              <div className="trending-news-card">
                Popular/Trending Sports News
              </div>
              <div className="trending-news-card">
                Popular/Trending Sports News
              </div>
              <div className="trending-news-card">
                Popular/Trending Sports News
              </div>
              <div className="trending-news-card">
                Popular/Trending Sports News
              </div>
            </div>
          </div>
          {openModal && (
            <AccountModal
              setOpenModal={setOpenModal}
              user={user}
              handleLogout={handleLogout}
            />
          )}
          {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
        </div>
      )}
    </>
  );
}

export default HomePage;
