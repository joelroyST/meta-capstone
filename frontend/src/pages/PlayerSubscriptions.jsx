import React, {useState, useEffect} from "react";
import TopBar from "../components/TopBar";
import SidebarModal from "../components/SideBarModal";
import AccountModal from "../Components/AccountModal";
import AddSubscriptionModal from "../components/AddSubscriptionModal";
import "./PlayerSubscriptions.css";

const PlayerSubscriptions = ({user, setUser, handleLogout}) => {
    const [openModal, setOpenModal] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [openAddSubscriptionModal, setOpenAddSubscriptionModal] = useState(false)

  return (
  <div className="subscriptions-container">
    <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      {openModal && <AccountModal setOpenModal={setOpenModal} user={user} handleLogout={handleLogout} />}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      {openAddSubscriptionModal && <AddSubscriptionModal setOpenAddSubscriptionModal={setOpenAddSubscriptionModal} /> }
    <h1 className="subscriptions-title">Player Subscription</h1>
    <button className="add-subscription-button" onClick={() => setOpenAddSubscriptionModal(true)}>Add Player Subscription</button>
    <div className="subscriptions-placeholder">
        <p className="placeholder-text">You currently have no subscriptions</p>
        <div className="placeholder-box">
            <p className="placeholder-subtext">Subscribed players will appear here</p>
        </div>
    </div>
  </div>
  
  )
};

export default PlayerSubscriptions;
