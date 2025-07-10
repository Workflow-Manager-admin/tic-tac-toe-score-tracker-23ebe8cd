import React, { useState, useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes";
import { COLORS, fontStack } from "./theme";

// PUBLIC_INTERFACE
function App() {
  // Light/dark theme toggle, default light per spec
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = COLORS.lightBg;
    document.body.style.fontFamily = fontStack;
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App" style={{ background: COLORS.lightBg, minHeight: "100vh" }}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ background: COLORS.primary, color: COLORS.white, position: "fixed", top: 18, right: 18, zIndex: 10 }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <AppRoutes />
    </div>
  );
}

export default App;
