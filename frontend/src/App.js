import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Upload from "./upload";
import Signup from "./signup";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <div className="hero">
                <div className="hero-content animate-fade-in-delayed">
                  <h1 className="title">Bias Analysis in Credit Score</h1>
                  <p>Explore potential biases and evaluate fairness metrics.</p>
                  <Link to="/login" className="scroll-down">
                    Log In
                  </Link>
                  <Link to="/upload" className="scroll-down">
                    Upload Data
                  </Link>
                </div>
              </div>
            }
          />
          {/* Login and Upload Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
