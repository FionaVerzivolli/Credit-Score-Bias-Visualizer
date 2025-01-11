import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Sign up to explore bias metrics and insights.</p>
        <form className="signup-form">
          <input type="text" placeholder="Username" className="input-field" />
          <input type="email" placeholder="Email" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
          />
          <button className="signup-button">Sign Up</button>
        </form>
        <div className="login-prompt">
          <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
