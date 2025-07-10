import React, { useEffect, useState } from "react";
import { fetchUserGames } from "../api";
import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";
import { COLORS, boxShadow } from "../theme";

// PUBLIC_INTERFACE
export default function HistoryPage() {
  const { logout } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserGames()
      .then(res => {
        setGames(res.games || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <NavBar onLogout={logout} />
      <div style={containerStyle}>
        <div style={mainStyle}>
          <h1 style={{ color: COLORS.primary, fontWeight: 600, marginBottom: 18 }}>Game History</h1>
          {loading ? (
            <div style={{ color: COLORS.secondary, marginTop: 32 }}>Loading...</div>
          ) : games.length === 0 ? (
            <div style={{ marginTop: 34, color: "#888", fontSize: 17 }}>
              No games played yet. Go start a new game!
            </div>
          ) : (
            <table style={historyTable}>
              <thead>
                <tr>
                  <th style={thcell}>Date</th>
                  <th style={thcell}>You</th>
                  <th style={thcell}>Opponent</th>
                  <th style={thcell}>Result</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g, idx) => (
                  <tr key={idx}>
                    <td style={tdcell}>{new Date(g.timestamp).toLocaleString()}</td>
                    <td style={tdcell}>{g.you}</td>
                    <td style={tdcell}>{g.opponent}</td>
                    <td style={
                      {
                        ...tdcell,
                        color: g.result === "W" ? COLORS.success :
                               g.result === "L" ? COLORS.error :
                               COLORS.secondary,
                        fontWeight: 600
                      }
                    }>
                      {g.result === "W" ? "Win" : g.result === "L" ? "Loss" : "Draw"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: 660,
  margin: "34px auto 0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 4vw"
};
const mainStyle = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: boxShadow,
  padding: "28px 11px 26px 11px",
  width: "100%",
  minHeight: 230
};
const historyTable = {
  width: "100%",
  fontSize: 15,
  margin: "28px 0 0 0"
};
const thcell = {
  textAlign: "left",
  color: COLORS.secondary,
  padding: "6px 10px"
};
const tdcell = {
  textAlign: "left",
  padding: "6px 10px"
};
