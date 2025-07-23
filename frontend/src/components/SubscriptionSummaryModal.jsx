import React from "react";
import calculatePlayerValue from "../../../backend/utils/calculateplayervalue";
import "./SubscriptionSummaryModal.css";

const SubscriptionSummaryModal = ({ summary, onClose }) => {
  if (!summary) return null;

  const subscriptionWindows = summary.windows ?? summary;

  // Flatten and filter all games with valid player stats
  const validGames = subscriptionWindows
    .flatMap((window) =>
      (window.games ?? []).filter(
        (game) => game.playerStats && Object.keys(game.playerStats).length > 0
      )
    )
    .sort((gameA, gameB) => new Date(gameA.date) - new Date(gameB.date));

  const statKeys = [
    "points",
    "position",
    "minPlayed",
    "fgm",
    "fga",
    "ftm",
    "fta",
    "ftp",
    "tpm",
    "tpa",
    "tpp",
    "offReb",
    "defReb",
    "totReb",
    "assists",
    "personalFouls",
    "steals",
    "turnovers",
    "blocks",
    "plusMinus",
    "comment",
  ];

  const statKeyDescriptions = {
    points: "Points Scored",
    position: "Position",
    minPlayed: "Minutes Played",
    fgm: "Field Goals Made",
    fga: "Field Goals Attempted",
    ftm: "Free Throws Made",
    fta: "Free Throws Attempted",
    ftp: "Free Throw %",
    tpm: "Three-Point Field Goals Made",
    tpa: "Three-Point Field Goals Attempted",
    tpp: "Three-Point %",
    offReb: "Offensive Rebounds",
    defReb: "Defensive Rebounds",
    totReb: "Total Rebounds",
    assists: "Assists",
    personalFouls: "Personal Fouls",
    steals: "Steals",
    turnovers: "Turnovers",
    blocks: "Blocks",
    plusMinus: "Plus/Minus",
    comment: "Comment",
  };

  const playerAverages = {};
  if (validGames.length > 0) {
    statKeys.forEach((statKey) => {
      const total = validGames.reduce((sum, game) => {
        const value = parseFloat(game.playerStats[statKey]);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      playerAverages[statKey] = (total / validGames.length).toFixed(2);
    });
  }

  const playerValue = calculatePlayerValue(validGames);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Subscription Summary</h2>
        {validGames.length === 0 ? (
          <p>No games with player data during this subscription period.</p>
        ) : (
          validGames.map((game) => (
            <div key={game.gameId} className="game-summary">
              <p>Date: {new Date(game.date).toLocaleDateString()}</p>
              <p>
                Arena: {game.arena} ({game.city}, {game.state})
              </p>
              <div className="teams-summary">
                <div>
                  <img src={game.homeTeam?.logo} alt="Home" width={100} />
                  <p>Home Points: {game.homeTeam?.points}</p>
                </div>
                <div>
                  <img src={game.awayTeam?.logo} alt="Away" width={100} />
                  <p>Away Points: {game.awayTeam?.points}</p>
                </div>
              </div>
              <table className="player-stats-table">
                <thead>
                  <tr>
                    <th>Stat</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(game.playerStats).map(([statKey, statValue]) => (
                      <tr key={statKey}>
                        <td>{statKeyDescriptions[statKey] ?? statKey}</td>
                        <td>{statValue ?? "0"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}

        {validGames.length > 0 && (
          <>
            <h3>Player Averages Across All Games</h3>
            <table className="player-stats-table">
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {statKeys.map((statKey) => (
                  <tr key={statKey}>
                    <td>{statKeyDescriptions[statKey]}</td>
                    <td>{playerAverages[statKey]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {validGames.length > 0 && (
          <p style={{ marginTop: "16px", fontWeight: "bold" }}>
            Player Value for This Subscription: {playerValue}
          </p>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SubscriptionSummaryModal;
