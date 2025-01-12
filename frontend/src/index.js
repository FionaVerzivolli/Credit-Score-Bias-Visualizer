import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-6a6tdlv5emz3gcos.us.auth0.com"
    clientId="lx3xmDagK9OX9WBNGWSwrbiabZYPiLxg"
    authorizationParams={{
      redirect_uri: "http://equalizer.wiki/home",
    }}
  >
    <App />
  </Auth0Provider>
);

reportWebVitals();
