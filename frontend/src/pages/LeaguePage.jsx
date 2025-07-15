import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import SidebarModal from "../components/SideBarModal";
import AccountModal from "../Components/AccountModal";
import "./LeaguePage.css";

const LeaguePage = ({user, setUser, handleLogout }) => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [league, setLeague] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const fetchLeague = async () => {
      console.log("leagueId: ", leagueId);
      try {
        const res = await fetch(`http://localhost:5000/api/league/${leagueId}`);
        const data = await res.json();
        console.log(data);
        setLeague(data.league);
      } catch (error) {
        console.log("LeaguePage error fetching league: ", error);
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
      {openModal && <AccountModal setOpenModal={setOpenModal} user={user} handleLogout={handleLogout} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      <div className="league-top-container">
        <button
          className="back-btn"
          onClick={() => navigate("/fantasy-basketball")}>
          🔙
        </button>
        <div className="league-title-container">
          {" "}
          <h1 className="league-title">{league?.name}</h1>
        </div>
        <div className="league-description">
          <h3>League Information</h3>
          <p>League ID: {league?.leagueId}</p>
          <p>Number of Members: {league?.users?.length || 0}</p>
        </div>
      </div>
      <div className="members-list">
        <div className="league-members">
          {league?.users && league.users.length > 0 ? (
            league.users.map((user) => (
              <div
                key={user.id}
                className="member-card"
                onClick={() => navigate(`/fantasy-roster/${user.id}/${league?.leagueId}`)}>
                <h4 className="member-name">{user.name}</h4>
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