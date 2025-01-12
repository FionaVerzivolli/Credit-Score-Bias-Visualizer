import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

function Instructions() {
  const { logout } = useAuth0(); // Ensure logout function is correctly imported from Auth0

  return (
    <div className="App">
      {/* Home and Log Out Buttons */}
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

      <main id="main-content">
        {/* Dataset Requirement Section */}
        <section className="data-instructions">
          <h2>Dataset Requirements</h2>
          <p>Please ensure your dataset has the following attributes:</p>
          <table className="attribute-table">
            <thead>
              <tr>
                <th>user_id</th>
                <th>age</th>
                <th>race</th>
                <th>continent</th>
                <th>gender</th>
                <th>economic_situation</th>
                <th>credit_score</th>
                <th>defaulted</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th>int</th>
                <th>int</th>
                <th>string</th>
                <th>string</th>
                <th>string</th>
                <th>double</th>
                <th>int</th>
                <th>bool</th>
              </tr>
            </thead>
          </table>
        </section>

        {/* Dataset Instructions */}
        <section className="data-instructions">
          <h2>Dataset Instructions</h2>
          <ul className="instructions-list">
            <li>
              Race should be one of: <strong>"white", "black", "asian", "hispanic", "other"</strong>.
            </li>
            <li>
              Gender should be <strong>"male", "female", "other"</strong>.
            </li>
            <li>
              Economic situation should be a number between <strong>1.0 and 10.0</strong>.
            </li>
            <li>
              Credit score should be an integer between <strong>300 and 850</strong>.
            </li>
            <li>
              Defaulted should be <strong>true</strong> or <strong>false</strong>.
            </li>
            <li>
              Continent should be one of: <strong>"north america", "south america", "africa", "europe", "asia", "oceania"</strong>.
            </li>
          </ul>
        </section>
        <Link to="/upload" className="button-link">
          Upload Dataset
        </Link>
      </main>

      <footer>
        <p>&copy; 2025 Bias Visualizer Project</p>
      </footer>
    </div>
  );
}

export default Instructions;
