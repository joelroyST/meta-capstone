import React, { useState, useEffect } from "react";
import DatePickerComponent from "./DatePicker";
import "./AddSubscriptionModal.css";

const AddSubscriptionModal = ({user, setOpenAddSubscriptionModal}) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])
  const [summaryFrequency, setSummaryFrequency] = useState(7);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedPlayer) {
        alert("Please select a player to subscribe to!")
    }

    const [subscriptionStart, subscriptionEnd] = selectedDateRange;
    const formattedStart = subscriptionStart.toISOString().split("T")[0];
    const formattedEnd = subscriptionEnd.toISOString().split("T")[0];
       
    try {
        const response = await fetch("http://localhost:5000/api/subscription/create-subscription", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userId: user.id,
                playerId: selectedPlayer.id,
                startDate: formattedStart,
                endDate: formattedEnd,
                summaryFrequencyWeeks: summaryFrequency
            })
        })

        console.log("This is the respnose: ", response)


        if (!response.ok) {
            const err = await response.json();
            console.error("Erorr creating subscription", err)
            alert("failed to create subscription try again")
        }

    alert("Subscription created successfully")
    setOpenAddSubscriptionModal(false);
    } catch (error) {
        console.error("Error creating subscription handlesubmit: ", error);
        alert("Something went wrong, please try again")
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setOpenAddSubscriptionModal(false)}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <h2>Create a New Player Subscription!</h2>
        <p style={{color: "gray", textAlign: "center"}}>All subscriptions must be within the 2021 NBA season (October 19, 2021 - April 10, 2022)</p>
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
        
        <label>How frequent do you want your subscription summaries?</label>
        <select value={summaryFrequency} onChange={(event) => setSummaryFrequency(Number(event.target.value))}>
            <option value={7}>Every 1 Week</option>
            <option value={14}>Every 2 Weeks</option>
            <option value={28}>Every 4 Weeks</option>
        </select>

         <label>What is the duration of your subscription?</label>
          <div className="date-picker-component">
        <DatePickerComponent summaryFrequency={summaryFrequency} onDateRangeChange={(subscriptionStart, subscriptionEnd) => setSelectedDateRange([subscriptionStart, subscriptionEnd])} />
          </div>
        <button className="add-player-subscription-button" onClick={handleSubmit}>Confirm Subscription</button>
        <button className="add-player-subscription-button" onClick={() => setOpenAddSubscriptionModal(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
