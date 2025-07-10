import React from "react";
import { COLORS } from "../theme";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../LogoIcon";
import useAuth from "../hooks/useAuth";

// PUBLIC_INTERFACE
export default function NavBar({ onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <div style={navLeft} onClick={() => navigate("/")} role="button" tabIndex={0}>
        <LogoIcon size={34} style={{ verticalAlign: "middle", marginRight: 10 }} />
        <span style={{ color: COLORS.primary, fontWeight: 700, fontSize: 21, letterSpacing: 0.6 }}>
          Tic Tac Toe
        </span>
      </div>
      <div style={navRight}>
        <Link to="/" style={linkStyle}>Game</Link>
        <Link to="/history" style={linkStyle}>History</Link>
        {user && (
          <span style={{ marginLeft: 14, marginRight: 12, color: COLORS.secondary, fontWeight: 600 }}>
            {user}
          </span>
        )}
        <button
          style={logoutButton}
          onClick={onLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  background: "#fff",
  borderBottom: `2px solid ${COLORS.primary}18`,
  boxShadow: "0 3px 12px rgba(34,37,42,0.07)",
  position: "sticky",
  top: 0,
  zIndex: 40,
  minHeight: 60
};
const navLeft = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  textDecoration: "none"
};
const navRight = {
  display: "flex",
  alignItems: "center"
};
const linkStyle = {
  margin: "0 10px",
  color: COLORS.primary,
  textDecoration: "none",
  fontWeight: 500
};
const logoutButton = {
  background: COLORS.secondary,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 500,
  fontSize: 15,
  marginLeft: 12,
  padding: "6px 18px",
  cursor: "pointer",
  transition: "background 0.24s"
};
