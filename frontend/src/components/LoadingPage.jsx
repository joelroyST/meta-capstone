import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import basketball from "../assets/basketball.png"
import "./LoadingPage.css"

const LoadingPage = () => {
    const navigate = useNavigate();

  return (
    <div className="loading-page-container">
        <img src={basketball} alt="basketball" className="basketball-logo"></img>
    </div>
  )
}

export default LoadingPage