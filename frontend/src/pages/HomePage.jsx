import React, { isValidElement, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import TopBar from "../components/TopBar";
import LoadingPage from "../components/LoadingPage";
import playerStatsHelper from "../../../backend/utils/playerstatshelper"; 

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

  // Fetch random players with averages for display
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/randomRefPlayersWithAverages");
        const data = await res.json();

        const playersWithAverages = data.map(({ playerId, firstName, lastName, position, games }) => {
          const averages = playerStatsHelper.computePlayerAveragesKey(
            games.map((game) => ({ playerStats: game }))
          );

          return {playerId, firstName,lastName, position, averages};
        });

        setPlayers(playersWithAverages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayers();
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
            {/* Player cards section */}
            <section className="recommended-section">
              <h3 className="recommended-teams-sports-title">
                Featured Players
              </h3>
              <div className="recommended-cards-grid">
                {players.map((player) => (
                  <div key={player.playerId} className="recommended-card">
                    <h4>{player.firstName} {player.lastName}</h4>
                    <p>Position: {player.position}</p>
                    <p>PTS: {player.averages.points}</p>
                    <p>REB: {player.averages.totReb}</p>
                    <p>AST: {player.averages.assists}</p>
                  </div>
                ))}
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