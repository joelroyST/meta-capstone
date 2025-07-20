import React, { useState, useEffect } from "react";
import "./AddSubscriptionModal.css";

const AddSubscriptionModal = ({setOpenAddSubscriptionModal}) => {
  const [openModal, setOpenModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [subscriptionLength, setSubscriptionLength] = useState(1)
  const [summaryFrequency, setSummaryFrequency] = useState(1);

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
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.error("Error trying to fetch players in marketplace: ", error);
      }
    };
    fetchAllPlayers();
  }, []);

  const searchPlayerByName = (event) => {
    const filtered = players.filter((player) => {
      return `${player.metadata.firstname} ${player.metadata.lastname}`
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setFilteredPlayers(filtered);
    setSelectedPlayer(null);
  };

  const handlePlayerClick = (player) => {
    if (selectedPlayer && selectedPlayer.id === player.id) {
        setSelectedPlayer(null)
    } else {
        setSelectedPlayer(player)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpenAddSubscriptionModal(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setOpenAddSubscriptionModal(false)}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <h2>Create a New Player Subscription!</h2>
        <label>What player would you like to subscribe to?</label>
        <input
          type="text"
          className="search-input"
          placeholder="Search player by name..."
          onChange={searchPlayerByName}
        />
        <div className="player-list-container">
          {(selectedPlayer ? [selectedPlayer] : filteredPlayers).map((player) => (
            <div
              key={player.id}
              className={`player-card ${selectedPlayer && selectedPlayer.id === player.id ? "selected" : ""}`}
              onClick={() => handlePlayerClick(player)}
                >
              {player.metadata.firstname} {player.metadata.lastname}
            </div>
          ))}
        </div>

        <label>How long will your subscription be for? (weeks)</label>
        <input
          type="number"
          min="1"
          value={subscriptionLength}
          onChange={(event) =>
            setSubscriptionLength(Number(event.target.value))
          }></input>
        
        <label>How frequent do you want your subscription summaries?</label>
        <select value={summaryFrequency} onChange={(event) => setSummaryFrequency(Number(event.target.value))}>
            <option value={1}>Every 1 Week</option>
            <option value={2}>Every 2 Weeks</option>
            <option value={3}>Every 4 Weeks</option>
        </select>
        <button className="add-player-subscription-button" onClick={handleSubmit}>Confirm Subscription</button>
        <button className="add-player-subscription-button" onClick={() => setOpenAddSubscriptionModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
