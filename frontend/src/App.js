import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { connectWebSocket } from "./utils/websocket"; // Import the connect function
import { MetricsProvider } from "./MetricsContext"; // Import MetricsProvider
import Login from "./login";
import Upload from "./upload";
import Home from "./home";
import Snapshots from "./snapshots";
import LearnMore from "./learnmore";
import "./App.css";
import Instructions from "./instructions";

function App() {
  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket("ws://localhost:9001");
  }, []);

  return (
    <MetricsProvider> {/* Wrap the entire app in the MetricsProvider */}
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
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/learnmore" element={<LearnMore />} />

          </Routes>
        </div>
      </Router>
    </MetricsProvider>
  );
}

export default App;
