import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./index.css";

// Env-gated admin dashboard at /dashboard (or ?dashboard as a fallback that
// needs no server rewrite). Everything else is the invite site.
const path = window.location.pathname.replace(/\/+$/, "");
const isDashboard =
  path === "/dashboard" || new URLSearchParams(window.location.search).has("dashboard");

// index.html ships with body.intro-locked (height: 100vh; overflow: hidden)
// for the invite's closed-envelope state; the dashboard never opens it.
if (isDashboard) document.body.classList.remove("intro-locked");

createRoot(document.getElementById("root")).render(
  <StrictMode>{isDashboard ? <Dashboard /> : <App />}</StrictMode>,
);
