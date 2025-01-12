import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/Home.css";

const Home = () => {
  const { logout } = useAuth0();

  return (
    <div className="home-container">
      <button
        className="logout-button"
        onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000" } })}
      >
        Log Out
      </button>
      <div className="intro-section">
        <h1 className="home-title">NSBE X P&G Equity Challenge</h1>
        <p className="home-text">
          Discover insights into systemic bias. Upload your dataset to start
          exploring or view existing datasets for analysis. This platform is
          designed to evaluate fairness metrics like False Positive Rate,
          Demographic Parity, and Group Disparity, empowering equity in
          financial services.
        </p>
        <div className="buttonContainer">
          <Link to="/upload" className="buttonStyle">
            Upload Dataset
          </Link>
          <Link to="/snapshots" className="buttonStyle">
            View Snapshots
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;