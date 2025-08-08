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
  const [newsArticles, setNewsArticles] = useState([]);
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/news");
        const data = await res.json();
        setNewsArticles(data)
      } catch (error) {
        console.error("Failed to fetch news articles from frontend: ", error)
      }
    }
    fetchNews();
  }, [])

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
          <header className="website-title">Sports Pulse</header>
          <TopBar
            onHamburgClick={() => setOpenSidebar((prev) => !prev)}
            onProfileClick={handleOpenModal}
          />
          

          <div className="middle-homepage">
            <div className="homepage-content">
              <aside className="sidebar left-sidebar">
                <h3 className="sidebar-title">Latest News</h3>
                {newsArticles.slice(0, Math.ceil(newsArticles.length / 2)).map((article, index) => (
                  <div key={index} className="sidebar-news-card">
                    <a href={article.url} target="_blank" rel="noopener norefferer">
                      <h4>{article.title}</h4>
                    </a>
                    <p className="news-source">Source: {article.source}</p>
                  </div>
                ))}
              </aside>

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

            <aside className="sidebar right-sidebar">
                <h3 className="sidebar-title">Latest News</h3>
                {newsArticles.slice(Math.ceil(newsArticles.length / 2)).map((article, index) => (
                  <div key={index} className="sidebar-news-card">
                    <a href={article.url} target="_blank" rel="noopener norefferer">
                      <h4>{article.title}</h4>
                    </a>
                    <p className="news-source">Source: {article.source}</p>
                  </div>
                ))}
            </aside>
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