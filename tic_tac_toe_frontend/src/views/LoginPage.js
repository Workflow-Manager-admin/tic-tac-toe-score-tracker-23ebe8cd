import React, { useState } from "react";
import { loginUser, storeToken } from "../api";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../LogoIcon";
import { COLORS } from "../theme";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** User login form and logic for authentication */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target);
    const username = form.get("username");
    const password = form.get("password");

    try {
      const resp = await loginUser(username, password);
      storeToken(resp.access_token);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={loginBoxStyle}>
        <LogoIcon size={54} style={{ marginBottom: 16 }} />
        <h1 style={{ color: COLORS.primary, margin: 0 }}>Tic Tac Toe</h1>
        <h2 style={{ fontWeight: 400, color: COLORS.secondary, marginTop: 4, fontSize: 22 }}>Sign In</h2>
        <form onSubmit={handleLogin} style={{ marginTop: 24, width: '100%' }}>
          <input name="username" type="text" placeholder="Username" required autoFocus style={inputStyle} />
          <input name="password" type="password" placeholder="Password" required style={inputStyle} />
          {error && <div style={{ color: COLORS.error, margin: "8px" }}>{error}</div>}
          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: COLORS.primary,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ margin: "16px 0 0", fontSize: 15 }}>
          New user? <Link to="/register" style={{ color: COLORS.accent }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg-primary)"
};

const loginBoxStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 16px rgba(33,33,33,0.09)",
  padding: "36px 30px",
  minWidth: 320,
  maxWidth: 350,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const inputStyle = {
  width: "100%",
  margin: "10px 0",
  padding: "10px 14px",
  borderRadius: "7px",
  border: `1.2px solid ${COLORS.secondary}40`,
  background: "#f5f7fa",
  fontSize: 15
};

const buttonStyle = {
  width: "100%",
  marginTop: 12,
  padding: "10px 0",
  border: "none",
  borderRadius: "7px",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
  letterSpacing: ".02em",
  background: COLORS.primary,
  transition: "background .24s"
};
