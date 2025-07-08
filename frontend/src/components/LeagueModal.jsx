import React, { useState } from "react";
import "./LeagueModal.css";

const LeagueModal = ({ leagues, onClose }) => {
  const [search, setSearch] = useState("");

  const filteredLeagues = leagues.filter((league) =>
    league.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="league-modal-overlay">
      <div className="league-modal-content" onClick={(event) => event.stopPropagation()}>
        <button className="league-modal-close" onClick={onClose}>
          Close
        </button>
        <h2>Your Leagues</h2>
        <input
          type="text"
          placeholder="Search Leagues..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="league-search-input"></input>
          <div className="leagues-list">
            {filteredLeagues.length > 0 ? (
                filteredLeagues.map((league) => (
                    <div key={league.leagueId} className="league-card">{league.name}</div>
                ))
            ) : (
                <p>No leagues found</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default LeagueModal;
