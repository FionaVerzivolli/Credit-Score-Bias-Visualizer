import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { connectWebSocket } from "./utils/websocket"; // Import the connect function
import Login from "./login";
import Upload from "./upload";
import Home from "./home"
import "./App.css";
import Snapshots from "./snapshots";

function App() {
  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket("ws://localhost:9001");
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="hero">
                <div className="hero-content animate-fade-in-delayed">
                  <h1 className="title">Bias Analysis in Credit Score</h1>
                  <p>Explore potential biases and evaluate fairness metrics.</p>
                  <div className="button-container">
                    <Link to="/login" className="scroll-down">
                      Get Started
                    </Link>
                  </div>

                </div>
              </div>
            }
          />
          {/* Login and Upload Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/snapshots" element={<Snapshots />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
