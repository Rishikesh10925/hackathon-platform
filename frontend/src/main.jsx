import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports";

// Configure Amplify with the exported config
Amplify.configure(awsConfig);

// Global Axios Interceptor for AWS Cognito JWT Token Auth
axios.interceptors.request.use(async (config) => {
  try {
    // Uses AWS Amplify v6 syntax to dynamically grab the session
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    
    // Automatically attach token to every Axios request leaving the frontend
    if (token) {
      config.headers.Authorization = token;
    }
  } catch (error) {
    console.warn("No active session found. Request will proceed without Authorization header.");
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
