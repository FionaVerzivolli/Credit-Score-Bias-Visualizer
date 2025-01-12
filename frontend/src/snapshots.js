import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/Home.css";

const Snapshots = () => {
  const { logout } = useAuth0();

  return (
    <div className="home-container">
      <div className="static-buttons-container">
        <Link to="/home" className="button-link">
          Home
        </Link>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="button-link"
        >
          Log Out
        </button>
      </div>
      <div className="intro-section">
        <h1 className="home-title">My Snapshots</h1>
        <p className="home-text">
          Your saved snapshots will be shown here.
        </p>
        
      </div>
    </div>
  );
};

export default Snapshots;
