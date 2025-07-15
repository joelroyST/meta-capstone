import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import "./FantasyRoster.css";

const FantasyRoster = ({ user, setUser, handleLogout }) => {
  const { userId, leagueId } = useParams();
  const [players, setPlayers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/fantasyteam/${userId}/${leagueId}`
        );
        if (!res.ok) {
          throw new Error("failed to fetch the roster");
        }

        const data = await res.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.log("The error is right here in Fantasy Roster");
        console.error("Error fetching roster: ", error);
      } finally {
        setLoading(false);
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

        {loading ? (
          <p>Loading Roster...</p>
        ) : players.length === 0 ? (
          <p>No players in your fantasy team roster yet</p>
        ) : (
          <div className="players-grid">
            {(() => {
              const minCards = 5;
              const totalCards = Math.max(minCards, players.length);
              return [...Array(totalCards)].map((_, index) => {
                const playerId = players[index];
                return (
                  <div
                    key={index}
                    className={
                      playerId ? "player-card filled" : "player-card empty"
                    }>
                    <p>{playerId ? `Player ID: ${playerId}` : "Empty Slot"}</p>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
      {openModal && (
        <AccountModal
          setOpenModal={setOpenModal}
          user={user}
          setUser={setUser}
        />
      )}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
    </div>
  );
};

export default FantasyRoster;
