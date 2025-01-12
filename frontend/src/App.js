import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { connectWebSocket } from "./utils/websocket"; // Import the connect function
import Login from "./login";
import Upload from "./upload";
import Signup from "./signup";
import "./App.css";

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
                      Log In
                    </Link>
                    <Link to="/signup" className="scroll-down">
                      Sign Up
                    </Link>
                  </div>

                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
