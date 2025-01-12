import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/Home.css";

const Snapshots = () => {
  const { logout } = useAuth0();

  const snapshots = [
    {
      id: 1,
      name: "Snapshot 1 : Jan 12 2025",
      falsePositiveRate: 0.15,
      demographicParity: 0.88,
      groupDisparity: 0.92,
      grade: "A",
    },
    {
      id: 2,
      name: "Snapshot 2: Jan 12 2025",
      falsePositiveRate: 0.25,
      demographicParity: 0.75,
      groupDisparity: 0.80,
      grade: "B",
    },
    {
      id: 3,
      name: "Snapshot 3: Jan 12 2025",
      falsePositiveRate: 0.35,
      demographicParity: 0.65,
      groupDisparity: 0.70,
      grade: "C",
    },
    {
      id: 4,
      name: "Snapshot 4: Jan 12 2025",
      falsePositiveRate: 0.10,
      demographicParity: 0.90,
      groupDisparity: 0.95,
      grade: "A+",
    },
  ];

  return (
    <div className="home-container-2">
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
  Your saved snapshots are shown to the right. Feel free to scroll through them to evaluate your company's <strong>progress</strong>. You can create a snapshot in the <strong>upload page</strong> and add custom titles. Each snapshot has a <strong>date</strong>, <strong>grade</strong>, <strong>false positive rate</strong>, <strong>demographic parity</strong>, and <strong>group disparity</strong>.
</p>
      </div>
      <div className="snapshots-scrollable">
        {snapshots.map((snapshot) => (
          <div key={snapshot.id} className="snapshot-rectangle">
            <h2 className="snapshot-title">{snapshot.name}</h2>
            <p>
              <strong>False Positive Rate:</strong> {snapshot.falsePositiveRate}
            </p>
            <p>
              <strong>Demographic Parity:</strong> {snapshot.demographicParity}
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
