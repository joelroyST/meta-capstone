import React, { useState, useEffect } from "react";
import "./FantasyBasketball.css";
import TopBar from "../components/TopBar";
import AccountModal from "../Components/AccountModal";
import SidebarModal from "../components/SideBarModal";

const FantasyBasketball = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

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
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="fantasy-basketball-page">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
            {openModal && <AccountModal setOpenModal={setOpenModal} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      <h1 className="fantasy-main-title">Welcome to Fantasy Basketball!</h1>
      <h4 className="fantasy-basketball-instructions">
        On this page, you will be able to add, drop, or trade players onto your
        fantasy team with your friends! You will have a certain amount of tokens
        that you can spend per season so make sure you spend them wisely and
        make the best team possible!
      </h4>
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
    </div>
  );
};

export default FantasyBasketball;
