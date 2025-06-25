import React from "react";
import './AccountModal.css'
import DefaultProfilePic from "../assets/defaultpfp.svg";

const AccountModal = ({setOpenModal}) => {
return (
    <div className="modal-overlay" onClick={() => setOpenModal(false)}>
        <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
                <h2>Profile Settings</h2>
                <button className="close-button" onClick={() => setOpenModal(false)}>Close</button>
            </div>
            <div className="modal-body">
                <button>Login</button>
                <button>Logout</button>
                <button>Settings</button>
            </div>
            <div className="profile-section">
                <img src={DefaultProfilePic}></img>
                <p>Username</p>
            </div>
        </div>
    </div>
)
}
export default AccountModal;