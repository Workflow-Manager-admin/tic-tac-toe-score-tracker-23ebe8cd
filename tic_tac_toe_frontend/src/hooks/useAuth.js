import { useState, useEffect } from "react";
import { getToken, clearToken } from "../api";

export default function useAuth() {
  // PUBLIC_INTERFACE
  /**
   * Returns: 
   *   - user: parsed username (if exists), or null
   *   - logout(): clears token and user
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // For demo, username encoded in JWT sub (not decoding for simplicity)
      try {
        // JWT payload is in second part, base64url
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/")));
        setUser(payload?.sub || null);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return { user, logout };
}
