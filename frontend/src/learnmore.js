import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link } from "react-router-dom";
import "./css/LearnMore.css";

const LearnMore = () => {
  return (
    <div className="home-container">
      {/* Home and Instructions Buttons */}
      <button className="logout-button">
        <Link to="/home" className="button-link">
          Home
        </Link>
      </button>
      <button className="logout-button">
        <Link to="/instructions" className="button-link">
          Instructions
        </Link>
      </button>

      {/* Intro Section */}
      <div className="intro-section">
        <h1 className="home-title">NSBE X P&G Equity Challenge</h1>

        {/* Fairness Metrics Section */}
        <div className="intro-desc">
          <h2>Fairness Metrics</h2>
          <ul className="snapshot-text">
            <li>
              <strong>False Positive Rate (FPR):</strong> This metric measures the proportion 
              of users incorrectly flagged as "defaulted" when they should not be. A lower FPR 
              indicates fewer users are being unfairly denied access to credit.
            </li>
            <li>
              <strong>Demographic Parity:</strong> This metric checks whether the approval rate 
              for a specific demographic group is similar to that of the entire population. It ensures 
              fairness by promoting equal opportunity for all groups.
            </li>
            <li>
              <strong>Group Disparity:</strong> This evaluates the difference between the average credit 
              score of a specified group and that of all other users. A low group disparity indicates 
              equitable treatment across demographics.
            </li>
          </ul>
        </div>

        {/* Calculation Details */}
        <div className="intro-desc">
          <h2>How the Metrics Are Calculated</h2>
          <div className="snapshot-text">
            <h3>1. False Positive Rate:</h3>
            <p>
              Identify users who were flagged as "defaulted" but actually have no defaults. Divide 
              the number of false positives by the total number of negative cases.
            </p>

            <h3>2. Demographic Parity:</h3>
            <p>
              Calculate the approval rate for each demographic group. Compare the rates to ensure 
              they are statistically similar.
            </p>

            <h3>3. Group Disparity:</h3>
            <p>
              Compute the average credit score of the specified group and compare it with the 
              average credit score of all other users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
