import React, { useState, useEffect } from "react";
import "./AddPlayerModal.css";

const AddPlayerModal = ({ player, user, onClose }) => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");

  useEffect(() => {
    const fetchUserLeagues = async () => {
      if (!user || !user.id) {
        console.log("User is undefined or missing id", user);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/api/league/user/${user.id}`
        );
        const data = await res.json();
        setLeagues(data);
      } catch (error) {
        console.log("Error fetching user leagues in AddPlayerModal: ", error);
      }
    };
    fetchUserLeagues();
  }, [user]);

  const handleAddPlayer = async () => {
    if (!selectedLeague) {
      alert("Please select a league.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/fantasyteam/${user.id}/${selectedLeague}/addPlayer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: player.id }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error adding player to league");
      } else {
        alert("Player successfully added!");
        onClose();
      }
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>
          Add {player.metadata.firstname} {player.metadata.lastname} to League
        </h3>
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}>
          <option value="">Select a league</option>
          {leagues.map((league) => (
            <option key={league.leagueId} value={league.leagueId}>
              {league.name}
            </option>
          ))}
        </select>
        <button disabled={!selectedLeague} onClick={handleAddPlayer}>
          Add Player
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddPlayerModal;
