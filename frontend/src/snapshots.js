import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/Home.css";

const Snapshots = () => {
  const { logout, user } = useAuth0(); // Ensure you have access to the user object from Auth0
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchSnapshots = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/get_user_data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.sub }), // Send Auth0 user ID
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch snapshots");
          }

          const data = await response.json();
          setSnapshots(data.snapshots); // Set snapshots from backend
          setLoading(false);
        } catch (error) {
          console.error("Error fetching snapshots:", error);
          setError(error.message);
          setLoading(false);
        }
      };

      fetchSnapshots();
    }
  }, [user]);

  if (loading) {
    return <p>Loading snapshots...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

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
      <div className="intro-desc">
        <h1 className="home-title">My Snapshots</h1>
        <p className="snapshot-text">
          Your saved snapshots are shown to the right. Feel free to scroll
          through them to evaluate your company's <strong>progress</strong>. You
          can create a snapshot in the <strong>upload page</strong> and add
          custom titles. Each snapshot has a <strong>date</strong>,{" "}
          <strong>grade</strong>, <strong>false positive rate</strong>,{" "}
          <strong>demographic parity</strong>, and{" "}
          <strong>group disparity</strong>.
        </p>
      </div>
      <div className="snapshots-scrollable">
        {snapshots.map((snapshot) => (
          <div key={snapshot.id} className="snapshot-rectangle">
            <h2 className="snapshot-title">{snapshot.name}</h2>
            <p>
              <strong>Time Stamp:</strong>{" "}
              {snapshot.timestamp.toLocaleString("en-US")}
            </p>
            <p>
              <strong>False Positive Rate:</strong>{" "}
              {snapshot.falsePositiveRate}
            </p>
            <p>
              <strong>Demographic Parity:</strong>{" "}
              {snapshot.demographicParity}
            </p>
            <p>
              <strong>Group Disparity:</strong> {snapshot.groupDisparity}
            </p>
            <p>
              <strong>Overall Grade:</strong> {snapshot.grade}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snapshots;
