import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FantasyBasketball.css";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import LeagueModal from "../components/LeagueModal";

const FantasyBasketball = ({ user, setUser }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState("");
  const [openLeagueModal, setOpenLeagueModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    async function fetchUserData() {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          localStorage.setItem("userID", data.user.id);

          const leaguesResponse = await fetch(
            `http://localhost:5000/api/league/user/${data.user.id}`
          );
          const leaguesData = await leaguesResponse.json();
          setLeagues(leaguesData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUserData();
  }, []);

  const handleCreateLeague = async () => {
    if (!leagueName.trim() || !user?.id) return;
console.log("Bye")
    try {
      console.log("Hello");
      const res = await fetch("http://localhost:5000/api/league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leagueName.trim(),
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeagues((prev) => [...prev, data.league]);
        setLeagueName("");
      } else {
        console.log("Create league error: ", data.error);
      }
    } catch (error) {
      console.log("Create league fetch error: ", error);
    }
  };

  // const newLeague = {
  //   leagueId: Date.now(),
  //   name: leagueName.trim(),
  // };

  const handleLeagueClick = (league) => {
    navigate(`/league/${league.userId}/${league.leagueId}`);
  };

  return (
    <div className="fantasy-basketball-page">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      {openModal && <AccountModal setOpenModal={setOpenModal} user={user} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      <h1 className="fantasy-main-title">Welcome to Fantasy Basketball!</h1>
      <h4 className="fantasy-basketball-instructions">
        On this page, you will be able to add, drop, or trade players onto your
        fantasy team with your friends! You will have a certain amount of tokens
        that you can spend per season so make sure you spend them wisely and
        make the best team possible!
      </h4>
      <div
        className="fantasy-league-roster"
        onClick={() => setOpenLeagueModal(true)}>
        <h2>My Fantasy Leauges:</h2>
        <div className="create-league-container">
          <input
            type="text"
            placeholder="Enter new league name!"
            value={leagueName}
            onChange={(event) => setLeagueName(event.target.value)}
            onClick={(event) => event.stopPropagation()}></input>
          <button
            onClick={(event) => {
              handleCreateLeague();
              event.stopPropagation();
            }}>
            Create New League
          </button>
        </div>
        <div className="league-container">
          {leagues.length === 0 ? (
            <h4 className="roster-league-container">
              You're not a member of any leagues currently!
            </h4>
          ) : (
            leagues.map((league) => (
              <div
                key={league.leagueId}
                className="league-card"
                onClick={() => handleLeagueClick(league)}>
                <h4 key={league.leagueId} className="roster-league-container">
                  {league.name}
                </h4>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="fantasy-user-roster">
        <h2>My Roster:</h2>
        <div className="roster-container">
          <h4 className="roster-player-container"></h4>
          <h4 className="roster-player-container">LeBron James</h4>
          <h4 className="roster-player-container">Stephen Curry</h4>
          <h4 className="roster-player-container">Devin Booker</h4>
          <h4 className="roster-player-container">Kevin Durant</h4>
          <h4 className="roster-player-container">Derrick Rose</h4>
        </div>
      </div>
      {openLeagueModal && (
        <LeagueModal
          leagues={leagues}
          onClose={() => setOpenLeagueModal(false)}
        />
      )}
    </div>
  );
};

export default FantasyBasketball;
