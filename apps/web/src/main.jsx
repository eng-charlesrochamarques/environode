import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app/App.jsx";
import "./styles/global.css";
import "./styles/auth.css";
import "./styles/layout.css";
import "./styles/devices.css";
import "./styles/alerts.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </React.StrictMode>
);
