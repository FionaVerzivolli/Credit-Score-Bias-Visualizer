import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link } from "react-router-dom";
import "./css/LearnMore.css";

const LearnMore = () => {  const { logout } = useAuth0();

return (
  <div className="Hero">
    <button
      className="logout-button"
      onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000" } })}
    >
      Log Out
    </button>
    
    <div className="intro-section">
      <h1 className="learn-title">NSBE X P&G Equity Challenge</h1>
      <p className="learn-text">
        <strong>False Positive Rate (FPR):</strong> Measures the proportion of users incorrectly flagged as "defaulted" when they should not be. A lower FPR indicates fewer users are unfairly denied access to credit.</p>
        <p className="learn-text">
       <strong>Demographic Parity:</strong> Ensures the approval rate for a specific demographic group is similar to that of the entire population, promoting equal opportunity for all groups.</p>
       <p className="learn-text">
        <strong>Group Disparity:</strong> Evaluates the difference between the average credit score of a specified group and that of all other users. A low group disparity indicates equitable treatment across demographics. </p>
        <p className="learn-text">
        <h2>How the Metrics Are Calculated</h2>
        <strong>1. False Positive Rate:</strong> Identify users who were flagged as "defaulted" but actually have no defaults. Divide the number of false positives by the total number of negative cases. </p>
        <p className="learn-text">
        <strong>2. Demographic Parity:</strong> Calculate the approval rate for each demographic group. Compare the rates to ensure they are statistically similar. 
        </p>
        <p className="learn-text"><strong>3. Group Disparity:</strong> Compute the average credit score of the specified group and compare it with the average credit score of all other users.

      </p>
      <div className="buttonContainer">
        <Link to="/instructions" className="buttonStyle">
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

export default LearnMore;
