import React, { useState, useEffect } from "react";
import "./ProposeTradeModal.css";

const ProposeTradeModal = ({ open, onClose, leagueId }) => {
  const [questionIndex, setQuestionindex] = useState(0);
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [fantasyTeams, setFantasyTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tradeLegs, setTradeLegs] = useState([
    {
      user1: "",
      user2: "",
      user1Players: [],
      user2Players: [],
      user1PlayersToGive: [],
      user2PlayersToGive: [],
    },
  ]);
  const [validationError, setValidationError] = useState("");

  const questions = [
    {
      id: 1,
      label: "Which users in this league do you want to bring into this trade?",
    },
    { id: 2, label: "Proposer coordination" },
    { id: 3, label: "Are you sure you want to propose this trade?" },
  ];

  // Fetch users and their players for the league on page load or leagueId change
  useEffect(() => {
    const fetchLeagueUsersAndPlayers = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/league/${leagueId}/users-with-players`
        );
        const users = await res.json();
        setLeagueUsers(users.users);
        setFantasyTeams(users.result1);
      } catch (error) {
        console.error("Error fetching users with players:", error);
      }
    };
    fetchLeagueUsersAndPlayers();
  }, [leagueId]);

  // This handles the checkbox selection on page 1 for selecting the users needed for the trade
  const handleCheckboxMark = (userId) => {
    setSelectedUsers((prev) => {
      const user = leagueUsers.find((user) => user.id === userId);
      // Toggle user in selectedUsers array
      return prev.find(({ id }) => id === userId)
        ? prev.filter(({ id }) => id !== userId)
        : [...prev, user];
    });
  };

  // Updates one field of a specific trade leg (immutable update)
  const updateTradeLeg = (legIndex, field, value) => {
    setTradeLegs((prevLegs) => {
      const newLegs = [...prevLegs];
      newLegs[legIndex] = { ...newLegs[legIndex], [field]: value }; 
      return newLegs;
    });
  };

  // Show all players when the specific user is selected
  const showPlayersOnUserSelection = (
    legIndex,
    userId,
    fieldParticipant,
    fieldPlayers
  ) => {
    updateTradeLeg(legIndex, fieldParticipant, userId);

    const user = fantasyTeams.find(
      (user) => user.fantasyteam.userId === parseInt(userId) 
    );

    if (user && user.fantasyteam && user.refplayers) {
      const playerList = user.refplayers.map((player) => ({
        firstName: player.metadata.firstname,
        lastName: player.metadata.lastname,
        id: player.metadata.id,
      }));
      updateTradeLeg(legIndex, fieldPlayers, playerList);
    }
    setValidationError("");
  };

  // If a player is used in another leg, then it won't show in any new legs
  const getSelectedPlayersInOtherLegs = (currentLegIndex, userId) => {
    const selectedPlayersAcrossLegs = [];
    tradeLegs.forEach((leg, legIndex) => {
      if (legIndex !== currentLegIndex) {
        if (leg.user1 === userId) {
          selectedPlayersAcrossLegs.push(...leg.user1PlayersToGive);
        }
        if (leg.user2 === userId) {
          selectedPlayersAcrossLegs.push(...leg.user2PlayersToGive);
        }
      }
    });
    return selectedPlayersAcrossLegs;
  };

  // Makes sure that the same pair of users don't trade with each other twice and they also have to trade at least one player
  // It also makes sure they choose two participants
  const validateTradeLegs = () => {
    // Check for duplicate participant pairs ignoring order
    const userPairs = tradeLegs
      .map(({ user1, user2 }) =>
        user1 && user2 ? [user1, user2].sort().join("-") : null
      )
      .filter(Boolean);

    const pairsSet = new Set();
    for (const pair of userPairs) {
      if (pairsSet.has(pair)) {
        setValidationError(
          "Duplicate trade participant pairs are not allowed."
        );
        return false;
      }
      pairsSet.add(pair);
    }

    // Check each leg for participant and player selection
    for (let i = 0; i < tradeLegs.length; i++) {
      const leg = tradeLegs[i];
      if (!leg.user1 || !leg.user2) {
        setValidationError(`Select two users in trade leg ${i + 1}`);
        return false;
      }
      if (
        leg.user1PlayersToGive.length === 0 ||
        leg.user2PlayersToGive.length === 0 ||
        leg.user1 === leg.user2
      ) {
        setValidationError(
          `Make sure to choose at least one unique player for each trade user in trade leg ${
            i + 1
          }`
        );
        return false;
      }
    }
    setValidationError("");
    return true;
  };

  const nextQuestion = () => {
    if (questionIndex === 1) {
      if (!validateTradeLegs()) return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionindex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionindex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (questionIndex === 1 && !validateTradeLegs()) return;
    console.log("Trade proposal submitted with legs:", tradeLegs);
    handleClose();
  };

  // This adds a new empty trade leg
  const addTradeLeg = () => {
    setTradeLegs((prev) => [
      ...prev,
      {
        user1: "",
        user2: "",
        user1Players: [],
        user2Players: [],
        user1PlayersToGive: [],
        user2PlayersToGive: [],
      },
    ]);
    setValidationError("");
  };

  const removeTradeLeg = (legIndex) => {
    setTradeLegs((prev) => {
      const newLegs = prev.filter((_, index) => index !== legIndex);
      return newLegs;
    });
    setValidationError("");
  };

  const clearAll = () => {
    setQuestionindex(0);
    setSelectedUsers([]);
    setTradeLegs([
      {
        user1: "",
        user2: "",
        user1Players: [],
        user2Players: [],
        user1PlayersToGive: [],
        user2PlayersToGive: [],
      },
    ]);
    setValidationError("");
  };

  const handleClose = () => {
    onClose();
    clearAll();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}>
        <button onClick={handleClose} className="modal-close">
          Close
        </button>

        <h2>{questions[questionIndex].label}</h2>

        {/* PAGE 1: SELECT THE USERS FOR TRADING*/}
        {questionIndex === 0 && (
          <ul>
            {leagueUsers.map((user) => (
              <li key={user.id}>
                <input
                  type="checkbox"
                  checked={selectedUsers.some(({ id }) => id === user.id)}
                  onChange={() => handleCheckboxMark(user.id)}
                />
                {user.name}
              </li>
            ))}
          </ul>
        )}

        {/* PAGE 2: TRADE COORDINATION BY THE PROSPOSER */}
        {questionIndex === 1 && (
          <div className="question-format">
            {tradeLegs.map((leg, legIndex) => {
              const excludeUser1Players = leg.user1
                ? getSelectedPlayersInOtherLegs(legIndex, leg.user1)
                : [];

              const filteredUser1Players = leg.user1Players.filter(
                (player) => !excludeUser1Players.includes(player.id)
              );

              const excludeUser2Players = leg.user2
                ? getSelectedPlayersInOtherLegs(legIndex, leg.user2)
                : [];

              const filteredUser2Players = leg.user2Players.filter(
                (player) => !excludeUser2Players.includes(player.id)
              );

              return (
                <div
                  key={legIndex}
                  className="trade-leg"
                  id={`trade-leg-${legIndex}`}>
                  <h3>
                    Trade Leg {legIndex + 1}
                    {legIndex > 0 && (
                      <button
                        onClick={() => removeTradeLeg(legIndex)}
                        className="remove-button"
                        title="Remove this trade leg">
                        Remove
                      </button>
                    )}
                  </h3>

                  <label>Choose Trade Participant 1:</label>
                  <select
                    value={leg.user1}
                    onChange={(event) =>
                      showPlayersOnUserSelection(
                        legIndex,
                        event.target.value,
                        "user1",
                        "user1Players"
                      )
                    }>
                    <option value="">-- Select --</option>
                    {selectedUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <label>Choose Trade Participant 2:</label>
                  <select
                    value={leg.user2}
                    onChange={(event) =>
                      showPlayersOnUserSelection(
                        legIndex,
                        event.target.value,
                        "user2",
                        "user2Players"
                      )
                    }>
                    <option value="">-- Select --</option>
                    {selectedUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <div className="players-checkbox-container">
                    {/* Participant 1 players */}
                    {filteredUser1Players.length > 0 && (
                      <div className="player-list-column">
                        <h4>Participant 1 Players</h4>
                        {filteredUser1Players.map((player) => (
                          <label key={player.id}>
                            <input
                              type="checkbox"
                              checked={leg.user1PlayersToGive.includes(
                                player.id
                              )}
                              onChange={() => {
                                const selected = [...leg.user1PlayersToGive, player.id];
                                updateTradeLeg(
                                  legIndex,
                                  "user1PlayersToGive",
                                  selected
                                );
                              }}
                            />
                            {player.firstName} {player.lastName}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Participant 2 players */}
                    {filteredUser2Players.length > 0 && (
                      <div className="player-list-column">
                        <h4>Participant 2 Players</h4>
                        {filteredUser2Players.map((player) => (
                          <label key={player.id}>
                            <input
                              type="checkbox"
                              checked={leg.user2PlayersToGive.includes(
                                player.id
                              )}
                              onChange={() => {
                                const selected = [...leg.user2PlayersToGive, player.id];
                                updateTradeLeg(
                                  legIndex,
                                  "user2PlayersToGive",
                                  selected
                                );
                              }}
                            />
                            {player.firstName} {player.lastName}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Add trade button */}
            <button onClick={addTradeLeg} style={{ marginTop: "16px" }}>
              Add Another Leg To Trade
            </button>
            {/* Trade validation error message for user */}
            {validationError && (
              <p style={{ color: "red", marginTop: "16px" }}>
                {validationError}
              </p>
            )}
          </div>
        )}

        {/* PAGE 3: CONFIRMATION */}
        {questionIndex === 2 && (
          <div>
            <button>No, Cancel</button>
          </div>
        )}

        <button onClick={prevQuestion} disabled={questionIndex === 0}>
          ←
        </button>
        {questionIndex < questions.length - 1 ? (
          <button onClick={nextQuestion}>→</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default ProposeTradeModal;
