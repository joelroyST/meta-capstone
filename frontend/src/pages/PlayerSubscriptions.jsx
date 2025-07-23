import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import SidebarModal from "../components/SideBarModal";
import AccountModal from "../Components/AccountModal";
import AddSubscriptionModal from "../components/AddSubscriptionModal";
import SubscriptionSummaryModal from "../components/SubscriptionSummaryModal";
import "./PlayerSubscriptions.css";

const PlayerSubscriptions = ({ user, setUser, handleLogout }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openAddSubscriptionModal, setOpenAddSubscriptionModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/subscription/user/${user.id}`
        );
        if (!response.ok) {
          console.error("Failed to fetch subscriptions");
          return;
        }
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching the subscriptions: ", error);
      }
    };
    if (user?.id) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleDelete = async (subscriptionId) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;
    try {
      await fetch(`http://localhost:5000/api/subscription/${subscriptionId}`, {
        method: "DELETE",
      });
      setSubscriptions((prev) =>
        prev.filter((subscription) => subscription.id !== subscriptionId)
      );
      alert("Subscription deleted successfully");
    } catch (error) {
      console.error("Error deleting subscription: ", error);
    }
  };

  const handleViewSummary = async (subscriptionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subscription/${subscriptionId}/summary`
      );

      const data = await response.json();
      setSelectedSummary(data);
    } catch (error) {
      console.error("Error fetching subscription summary:", error);
    }
  };

  return (
    <div className="subscriptions-container">
      <TopBar
        onHamburgClick={() => setOpenSidebar((prev) => !prev)}
        onProfileClick={() => setOpenModal(true)}
      />
      {openModal && (
        <AccountModal
          setOpenModal={setOpenModal}
          user={user}
          handleLogout={handleLogout}
        />
      )}
      {openSidebar && <SidebarModal setOpenSidebar={setOpenSidebar} />}
      {openAddSubscriptionModal && (
        <AddSubscriptionModal
          user={user}
          setOpenAddSubscriptionModal={setOpenAddSubscriptionModal}
        />
      )}

      <h1 className="subscriptions-title">Player Subscription</h1>
      <button
        className="add-subscription-button"
        onClick={() => setOpenAddSubscriptionModal(true)}>
        Add Player Subscription
      </button>

      {subscriptions.length === 0 ? (
        <div className="subscriptions-placeholder">
          <p className="placeholder-text">
            You currently have no subscriptions
          </p>
          <div className="placeholder-box">
            <p className="placeholder-subtext">
              Subscribed players will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscriptions-card">
              <p>Player ID: {subscription.playerId}</p>
              <p>Subscription Start: {subscription.startDate.slice(0, 10)}</p>
              <p>Subscription End: {subscription.endDate.slice(0, 10)}</p>
              <button onClick={() => handleDelete(subscription.id)}>
                Delete
              </button>
              <button onClick={() => handleViewSummary(subscription.id)}>
                View Summary
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSummary && (
        <SubscriptionSummaryModal
          summary={selectedSummary}
          onClose={() => {
            setSelectedSummary(null);
          }}
          subscriptionStart={
            selectedSummary.subscriptionStart || selectedSummary[0]?.windowStart
          }
          subscriptionEnd={
            selectedSummary.subscriptionEnd || selectedSummary[0]?.windowEnd
          }
        />
      )}
    </div>
  );
};

export default PlayerSubscriptions;
