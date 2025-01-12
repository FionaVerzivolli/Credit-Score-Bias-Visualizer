import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./css/LoginButton.css"; 
import Logo from './magnifyingglass.png'
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="login-container">
      <div className="project-description">
        <h1 className="login-title">NSBE X P&G Equity Challenge</h1>
        <p className="login-description">
          This project is an innovative solution to combat systemic bias in the
          financial sector, focusing on improving fairness in credit scoring,
          access to capital, and detecting/addressing biases in lending
          algorithms. By evaluating fairness metrics such as False Positive
          Rate, Demographic Parity, and Group Disparity, this project aims to
          create impactful, scalable tools to promote greater equity.
        </p>
        <img src={Logo} style={{ width: '200px', height: 'auto' }} // Specify the size
 alt="Logo" />;
      </div>
      <button className="login-button" onClick={() => loginWithRedirect()}>
        Log In / Sign Up
      </button>

    </div>
  );
};

export default LoginButton;
