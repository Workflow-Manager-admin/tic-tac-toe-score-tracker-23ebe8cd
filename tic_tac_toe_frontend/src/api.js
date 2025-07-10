//
// API helpers for talking to the backend: authentication, game, and scores
//

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/** Store the user auth token in localStorage (simple for demo) */
export function storeToken(token) {
  window.localStorage.setItem("tic_token", token);
}

/** Retrieve stored token */
export function getToken() {
  return window.localStorage.getItem("tic_token");
}

/** Remove token on logout */
export function clearToken() {
  window.localStorage.removeItem("tic_token");
}

// PUBLIC_INTERFACE
/** Make an authenticated API request */
export async function apiFetch(path, opts = {}, addAuth = true) {
  const headers = {
    "Content-Type": "application/json",
    ...opts.headers,
  };
  if (addAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const resp = await fetch(API_BASE + path, {
    ...opts,
    headers,
  });

  if (!resp.ok) {
    let errorMsg = "API error";
    try {
      const data = await resp.json();
      errorMsg = data?.detail || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return resp.json();
}

// PUBLIC_INTERFACE
// Auth methods
export function loginUser(username, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }, false);
}

export function registerUser(username, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }, false);
}

// PUBLIC_INTERFACE
// Game methods
export function startNewGame(opponent=null) {
  const body = opponent ? { opponent } : {};
  return apiFetch("/game/start", { method: "POST", body: JSON.stringify(body) });
}
// Game state: GET game by ID
export function fetchGame(gameId) {
  return apiFetch(`/game/${gameId}`);
}
// Make move: POST
export function sendMove(gameId, position) {
  return apiFetch(`/game/${gameId}/move`, {
    method: "POST",
    body: JSON.stringify({ position }),
  });
}
// Fetch history & scores
export function fetchScoreboard() {
  return apiFetch("/scores");
}
export function fetchUserGames() {
  return apiFetch("/history");
}
