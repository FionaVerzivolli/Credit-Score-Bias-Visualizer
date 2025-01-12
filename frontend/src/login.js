import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Login() {
  return (
    <div className="login-container">
      {/* Home Button */}
      <div className="home-button">
        <Link to="/" className="home-link">
          Home
        </Link>
      </div>

      <div className="login-box">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Log in to access and visualize your metrics and insights.</p>
        <form className="login-form">
          <input type="text" placeholder="Username" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <button className="login-button">Log In</button>
        </form>
        <div className="signup-prompt">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;