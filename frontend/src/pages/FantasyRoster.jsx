import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import "./FantasyRoster.css";

const FantasyRoster = ({ user, setUser }) => {
  const { userId, leagueId } = useParams();
  const [players, setPlayers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/fantasyteam/${userId}/${leagueId}`
        );
        console.log(res);
        console.log(res.status)

        const data = await res.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.log("The error is right here in Fantasy Roster")
        console.error("Error fetching roster: ", error);
      }
    };
    fetchRoster();
  }, [userId, leagueId]);

  return (
    <div className="fantasy-roster-page">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      <div className="roster-container">
        <h2 className="roster-title">Fantasy Team Roster</h2>
        <div className="players-grid">
          {[...Array(5)].map((_, index) => {
            const playerId = players[index];
            return (
              <div
                key={index}
                className={playerId ? "player-card filled" : "player-card empty"}>
                <p>{playerId ? `Player ID: ${playerId}` : "Empty Slot"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FantasyRoster;
