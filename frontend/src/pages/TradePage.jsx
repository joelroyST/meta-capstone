import React, { useState, useEffect } from "react";
import "./TradePage.css";

const TradePage = ({ user }) => {
  const [pendingTrades, setPendingTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [idToUser, setIdToUser] = useState({});
  const [idToPlayer, setIdToPlayer] = useState({});
  const [idToLeague, setIdToLeague] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const tradesResponse = await fetch(
          `http://localhost:5000/api/trade/user/${user.id}`
        );
        const trades = await tradesResponse.json();
        const pending = trades.filter(
          (trade) => trade.confirmationUser1 === 1 || trade.confirmationUser2 === 1
        );
        const history = trades.filter(
          (trade) => trade.confirmationUser1 !== 1 && trade.confirmationUser2 !== 1
        );
        setPendingTrades(pending);
        setTradeHistory(history);

        // Get all the unique leagueIds from the trades
        const leagueIds = [...new Set(trades.map((trade) => trade.leagueId))];
        const leagueFetches = leagueIds.map((leagueId) =>
          fetch(`http://localhost:5000/api/league/${leagueId}`).then((res) =>
            res.json()
          )
        );
        const leagueDataList = await Promise.all(leagueFetches);

        const leagueMap = {};
        const userMap = {};
        leagueDataList.forEach((data) => {
          if (data.league) {
            leagueMap[data.league.leagueId] = data.league.name;
            data.league.users.forEach((user) => {
              userMap[user.id] = user.name;
            });
          }
        });

        setIdToLeague(leagueMap);
        setIdToUser(userMap);

        // Mapping out the players
        const playersResponse = await fetch("http://localhost:5000/api/refPlayers");
        const players = await playersResponse.json();
        const playerMap = {};
        players.forEach((player) => {
          playerMap[player.id] = `${player.metadata.firstname} ${player.metadata.lastname}`;
        });
        setIdToPlayer(playerMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) fetchAll();
  }, [user]);

  // Check if the current user has already responded to the trade
  const hasResponded = (trade) => {
    if (trade.user1Id === user.id) {
      return trade.confirmationUser1 !== 1;
    }
    if (trade.user2Id === user.id) {
      return trade.confirmationUser2 !== 1;
    }
    return false;
  };

  const updateStatus = async (tradeId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/trade/${tradeId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, userId: user.id }), 
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      // Refetch the trades so it shows the updated confirmtion status
      const tradesResponse = await fetch(
        `http://localhost:5000/api/trade/user/${user.id}`
      );
      const trades = await tradesResponse.json();
      setPendingTrades(
        trades.filter(
          (trade) => trade.confirmationUser1 === 1 || trade.confirmationUser2 === 1
        )
      );
      setTradeHistory(
        trades.filter(
          (trade) => trade.confirmationUser2 !== 1 && trade.confirmationUser1 !== 1
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const renderTrade = (trade, showButtons = false) => (
    <div key={trade.recordId} className="trade-card">
      <p>
        <strong>League:</strong> {idToLeague[trade.leagueId] || trade.leagueId}
      </p>
      <p>
        <strong>Proposed By:</strong>{" "}
        {idToUser[trade.proposerId] || trade.proposerId}
      </p>
      <p>
        <strong>{idToUser[trade.user1Id] || trade.user1Id} gives:</strong>{" "}
        {trade.user1PlayersToGive.map((id) => idToPlayer[id] || id).join(", ")}
      </p>
      <p>
        <strong>{idToUser[trade.user2Id] || trade.user2Id} gives:</strong>{" "}
        {trade.user2PlayersToGive.map((id) => idToPlayer[id] || id).join(", ")}
      </p>

      {showButtons && !hasResponded(trade) && (
        <div className="trade-buttons">
          <button onClick={() => updateStatus(trade.recordId, 2)}>
            Confirm
          </button>
          <button onClick={() => updateStatus(trade.recordId, 0)}>
            Reject
          </button>
        </div>
      )}

      {(!showButtons || hasResponded(trade)) && (
        <p>
          <strong>Status:</strong>{" "}
          {trade.confirmationUser1 === 0 || trade.confirmationUser2 === 0
            ? "Rejected"
            : trade.confirmationUser1 === 2 && trade.confirmationUser2 === 2
            ? "Confirmed"
            : "Pending"}
        </p>
      )}

      {showButtons && hasResponded(trade) && (
        <p>You have responded to this trade.</p>
      )}
    </div>
  );

  return (
    <div className="trade-page">
      <h1>Trade Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h2>Pending Trades</h2>
            {pendingTrades.length === 0 ? (
              <p>No pending trades.</p>
            ) : (
              pendingTrades.map((trade) => renderTrade(trade, true))
            )}
          </section>

          <section>
            <h2>Trade History</h2>
            {tradeHistory.length === 0 ? (
              <p>No trade history yet.</p>
            ) : (
              tradeHistory.map((trade) => renderTrade(trade))
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default TradePage;
