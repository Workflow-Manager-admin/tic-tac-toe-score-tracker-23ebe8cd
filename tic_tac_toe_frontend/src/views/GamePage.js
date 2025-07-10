import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { startNewGame, fetchGame, sendMove, fetchScoreboard } from "../api";
import useAuth from "../hooks/useAuth";
import { COLORS, boxShadow } from "../theme";

// PUBLIC_INTERFACE
export default function GamePage() {
  /**
   * Board, sidebar with scores/history, real-time game updates.
   * Tries to auto-reconnect game state after any page reload.
   * TODO: Add WebSocket sync when backend ready (placeholder in comments).
   */
  const { logout } = useAuth();
  const [game, setGame] = useState(null); // {id, state, board, x_player, o_player, turn, winner, etc.}
  const [scoreboard, setScoreboard] = useState([]);
  const [moveStatus, setMoveStatus] = useState(""); // For move result and errors
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const wsRef = useRef(null);

  // Try load game from sessionStorage
  useEffect(() => {
    let lastGameId = window.sessionStorage.getItem("lastGameId");
    if (lastGameId) {
      fetchGame(lastGameId)
        .then(g => {
          setGame(g);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          window.sessionStorage.removeItem("lastGameId");
        });
    } else {
      handleNewGame();
    }

    fetchScoreboard().then(res => setScoreboard(res.scores || []));
    // eslint-disable-next-line
  }, []);

  // Connect/reconnect to backend websocket (stub)
  useEffect(() => {
    if (!game?.id) return;
    // wsRef.current = new WebSocket("ws://localhost:8000/ws/game/" + game.id);
    // wsRef.current.onmessage = (evt) => { const data = JSON.parse(evt.data); setGame(data); };
    // return () => wsRef.current && wsRef.current.close();
  }, [game?.id]);

  const handleNewGame = async () => {
    setJoining(true);
    setGame(null);
    try {
      const g = await startNewGame();
      setGame(g);
      window.sessionStorage.setItem("lastGameId", g.id);
      setMoveStatus("");
    } catch (e) {
      setMoveStatus("Unable to start game.");
    } finally {
      setJoining(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCellClick = async (idx) => {
    if (!game || game.winner || game.board[idx]) return;
    try {
      const res = await sendMove(game.id, idx);
      setGame(res);
      setMoveStatus("");
      // For live, resync scoreboard if game ended
      if (res.winner || res.isDraw) {
        fetchScoreboard().then(res2 => setScoreboard(res2.scores || []));
      }
    } catch (e) {
      setMoveStatus(e.message || "Move error");
    }
  };

  function renderBoard() {
    if (!game) return null;
    return (
      <div style={boardStyle}>
        {game.board.map((cell, idx) =>
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            style={{
              ...cellStyle,
              color: cell === "X" ? COLORS.primary : cell === "O" ? COLORS.accent : COLORS.secondary,
              cursor: cell || game.winner ? "default" : "pointer",
              opacity: cell || game.winner ? 0.85 : 1
            }}
            disabled={!!cell || !!game.winner || game.turn !== game.you}
            aria-label={`cell-${idx}, value: ${cell || "empty"}`}
          >
            {cell || ""}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <NavBar onLogout={logout} />
      <div style={containerStyle}>
        <main style={mainStyle}>
          <h1 style={{
            color: COLORS.primary, fontWeight: 600, fontSize: 27, marginBottom: 8
          }}>Game Board</h1>
          {loading ? (
            <div style={{ margin: 48, color: COLORS.secondary }}>Loading...</div>
          ) : (
            <>
              {game && renderBoard()}
              <div style={{ margin: "26px 0 18px", fontSize: 17, fontWeight: 500 }}>
                Your mark: <span style={{ color: COLORS.primary }}>{game && game.you}</span>
              </div>
              <div style={{ minHeight: 34 }}>
                {game?.winner && (
                  <span style={{
                    color: COLORS.success,
                    fontWeight: 700,
                    fontSize: 19
                  }}>
                    Winner: {game.winner}
                  </span>
                )}
                {game?.isDraw && (
                  <span style={{ color: COLORS.accent, fontWeight: 700, fontSize: 17 }}>Draw!</span>
                )}
                {!game?.winner && !game?.isDraw && (
                  <span style={{
                    color: COLORS.secondary,
                    fontWeight: 500,
                    fontSize: 16
                  }}>
                    {game?.turn === game?.you ? "Your turn" : "Waiting for opponent..."}
                  </span>
                )}
              </div>
              {moveStatus && <div style={{ color: COLORS.error, margin: 10 }}>{moveStatus}</div>}
              <button
                style={{ ...actionButton, background: COLORS.primary }}
                onClick={handleNewGame}
                disabled={joining}
              >
                {joining ? "Starting..." : "New Game"}
              </button>
            </>
          )}
        </main>
        <aside style={sidebarStyle}>
          <ScoreboardList scoreboard={scoreboard} />
        </aside>
      </div>
    </div>
  );
}

// Scoreboard (side panel)
function ScoreboardList({ scoreboard }) {
  return (
    <div style={scoreListBox}>
      <h3 style={{ fontWeight: 600, color: COLORS.secondary }}>Scoreboard</h3>
      {scoreboard?.length === 0 ? (
        <div style={{ color: "#888", margin: 18, fontSize: 16 }}>No completed games yet.</div>
      ) : (
        <table style={{ width: "100%", marginTop: 8, fontSize: 15 }}>
          <thead>
            <tr>
              <th style={scoreTh}>Player</th>
              <th style={scoreTh}>Wins</th>
              <th style={scoreTh}>Losses</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((row, idx) => (
              <tr key={idx}>
                <td style={scoreTd}>{row.player}</td>
                <td style={{ ...scoreTd, color: COLORS.primary, fontWeight: 600 }}>{row.wins}</td>
                <td style={scoreTd}>{row.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: 1040,
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "30px 6vw"
};
const mainStyle = {
  flex: "0 1 350px",
  minWidth: 330,
  marginRight: 36,
  background: "#fff",
  borderRadius: 14,
  boxShadow: boxShadow,
  padding: "24px 14px 28px 14px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};
const sidebarStyle = {
  flex: "0 1 250px",
  minWidth: 220,
  marginTop: 20,
  background: "#fff",
  borderRadius: 14,
  boxShadow,
  padding: "22px 14px",
  minHeight: 305,
  display: "flex",
  flexDirection: "column"
};
const boardStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 60px)",
  gridTemplateRows: "repeat(3, 60px)",
  gap: "10px",
  margin: "32px 0 12px 0",
  background: "#fff"
};
const cellStyle = {
  width: 60,
  height: 60,
  borderRadius: 8,
  fontSize: 29,
  fontWeight: 700,
  border: `2.5px solid ${COLORS.primary}66`,
  background: "#fff",
  boxShadow: boxShadow,
  outline: "none",
  transition: "background .19s"
};
const actionButton = {
  margin: "22px 0 0 0",
  padding: "11px 0",
  fontWeight: 600,
  border: "none",
  borderRadius: 9,
  color: "#fff",
  fontSize: 16,
  letterSpacing: "0.01em",
  background: COLORS.primary,
  width: 180,
  cursor: "pointer",
  boxShadow
};
const scoreListBox = {
  width: "100%"
};
const scoreTh = { textAlign: "left", padding: "2px 9px", color: COLORS.secondary };
const scoreTd = { textAlign: "left", padding: "2px 9px" };
