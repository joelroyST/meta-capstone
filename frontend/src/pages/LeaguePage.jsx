import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import SidebarModal from "../components/SideBarModal";
import AccountModal from "../Components/AccountModal";
import "./LeaguePage.css";

const LeaguePage = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [league, setLeague] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/league/${leagueId}?include=users`
        );
        const data = await res.json();
        setLeague(data.league);
      } catch (error) {
        console.log(`Error fetching the league: ${error}`);
        navigate("/fantasy-basketball");
      }
    };

    fetchLeague();
  }, [leagueId, navigate]);
//   if (error) return <div>Error: {error.messsage}</div>
  return (
    <div className="league-page">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      {openModal && <AccountModal setOpenModal={setOpenModal} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      <div className="league-container">
        <button
          className="back-btn"
          onClick={() => navigate("/fantasy-basketball")}>
          🔙
        </button>
        <h1 className="league-title">{league?.name}</h1>
        <div className="league-description">
          <h3>League Information</h3>
          <p>League ID: {league?.leagueId}</p>
          <p>Number of Members: {league?.users?.length || 0}</p>
        </div>

        <div className="league-members">
          {league?.users.length > 0 ? (
            league.users.map((user) => (
              <div key={user.id} className="member-card">
                <h4 className="member-name">{user.displayName}</h4>
              </div>
            ))
          ) : (
            <p>No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaguePage;
