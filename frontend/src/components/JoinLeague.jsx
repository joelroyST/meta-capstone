import React, { useState } from "react";
import "./JoinLeague.css";

const JoinLeague = ({ user }) => {
  const [leagueIdInput, setLeagueIdInput] = useState("");

  const handleJoinLeague = async () => {
    if (!leagueIdInput) {
      alert("Please enter a League ID");
      return;
    }

    try {
        console.log("BEFORE HTE POST");
      const res = await fetch(
        `http://localhost:5000/api/league/${leagueIdInput}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );
      console.log("AFTER THE POST")
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully joined league: ${data.league.name}`);
        setLeagueIdInput("");
      }
    } catch (error) {
      console.error("Error joining league: ", error);
      alert("Error joining league");
    }
  };

  return (
    <div className="join-league-container">
      <input
        type="text"
        placeholder="Enter League ID"
        value={leagueIdInput}
        onChange={(event) => setLeagueIdInput(event.target.value)}
        onClick={(event) => event.stopPropagation()}
        className="join-league-input"></input>
      <button
        onClick={(event) => {
          event.stopPropagation();
          handleJoinLeague();
        }}
        className="join-league-button">
        Join League
      </button>
    </div>
  );
};

export default JoinLeague;
