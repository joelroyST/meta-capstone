import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerMarketplace.css";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";
import AddPlayerModal from "../components/AddPlayerModal";

const PlayerMarketplace = ({ user, setUser, handleLogout }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, setUser]);
  
  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/refPlayers");
        if (!res.ok) {
          console.log(
            "There is an error in fetching players PlayerMarketplace.jsx"
          );
        }
        const data = await res.json();
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (error) {
        console.log("Error trying to fetch players in marketplace: ", error);
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
  };

  const sortByID = () => {
    const sorted = [...filteredPlayers];
    sorted.sort((a, b) => {
      return a.id - b.id;
    });
    setFilteredPlayers(sorted);
  };

  const handleAddPlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="player-marketplace-page">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      {openModal && <AccountModal setOpenModal={setOpenModal} user={user} handleLogout={handleLogout} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      <h2 className="marketplace-title">Player Marketplace</h2>
      <input
        className="search-input"
        placeholder="Search player by name..."
        type="text"
        onChange={searchPlayerByName}></input>
      <button onClick={sortByID}>Sort by ID</button>
      <table>
        <thead>
          <tr>
            <td>ID: </td>
            <td>Name: </td>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => {
            return (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>
                  <button onClick={() => console.log(player.metadata)}>
                    {player.metadata.firstname} {player.metadata.lastname}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleAddPlayerClick(player)}>
                    Add Player
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedPlayer && (
        <AddPlayerModal
          player={selectedPlayer}
          user={user}
          onClose={() => setSelectedPlayer(null)}></AddPlayerModal>
      )}
    </div>
  );
};

export default PlayerMarketplace;
