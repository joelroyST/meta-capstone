import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import "./FantasyRoster.css";

const FantasyRoster = ({ user, setUser, handleLogout }) => {
  const { userId, leagueId } = useParams();
  const [players, setPlayers] = useState([]);
  const [dataPlayers, setDataPlayers] = useState([]);
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
        console.error("Error fetching roster in Fantasy Roster: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, [userId, leagueId]);

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/refPlayers");
        if (!res.ok) {
          console.error(
            "There is an error in fetching players PlayerMarketplace.jsx"
          );
        }
        const data = await res.json();
        setDataPlayers(data);
      } catch (error) {
        console.error("Error trying to fetch players in marketplace: ", error);
      }
    };
    fetchAllPlayers();
  }, []);

  const handleRemovePlayer = async (playerId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/fantasyteam/${userId}/${leagueId}/removePlayer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error removing player");
        return;
      }
      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        const index = updatedPlayers.indexOf(playerId);
        if (index !== -1) {
          updatedPlayers[index] = null;
        }
        return updatedPlayers;
      });
      alert("Player removed successfully");
    } catch (error) {
      console.error("Error removing player: ", error);
      alert("Error removing player and check console for more details");
    }
  };

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
                    {playerId ? (
                      <div>
                        <p>{`Player Name: ${
                          dataPlayers.find((player) => player.id === playerId)
                            ? dataPlayers.find(
                                (player) => player.id === playerId
                              ).metadata.firstname +
                              " " +
                              dataPlayers.find(
                                (player) => player.id === playerId
                              ).metadata.lastname
                            : "Unknown"
                        }`}</p>
                        <p>{`Player ID: ${playerId}`}</p>
                        <button
                          onClick={() => handleRemovePlayer(playerId)}
                          className="remove-player-button">
                          Remove Player
                        </button>
                      </div>
                    ) : (
                      <p>Empty Player</p>
                    )}
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
