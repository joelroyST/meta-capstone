import React from 'react'
import './SideBarModal.css'
import { useNavigate } from 'react-router-dom';

function SidebarModal({setOpenSidebar}) {
    const navigate = useNavigate();

    const handleClose = () => {
        setOpenSidebar(false);
    }

    const handleHomeClick = () => {
        if (window.location.pathname !== "/") {
            navigate("/")
        }
        setOpenSidebar(false);
    }

    const handleNavigateFantasyBasketball = () => {
        navigate('/fantasy-basketball');
        setOpenSidebar(false);
    }

    const handleNavigatePlayerSubscriptions = () => {
        navigate('/player-subscriptions');
        setOpenSidebar(false);
    }

  return (
    <div className='sidebar-modal-overlay' onClick={handleClose}>
        <div className='sidebar-modal open' onClick={(event) => event.stopPropagation()}>
            <button onClick={handleHomeClick} className='sidebar-title'>Home</button>
            <h2 className='sidebar-title1' onClick={handleNavigateFantasyBasketball}>Fantasy Basketball</h2>
            <h2 className='sidebar-title2' onClick={handleNavigatePlayerSubscriptions}>Player Subscriptions</h2>
            <h2 className='sidebar-title'>Hot News</h2>
            <h2 className='sidebar-title'>NBA Teams</h2>
        </div>
    </div>
  )
}

export default SidebarModal;