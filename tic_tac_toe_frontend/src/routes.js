import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import GamePage from "./views/GamePage";
import HistoryPage from "./views/HistoryPage";
import { getToken } from "./api";

// PUBLIC_INTERFACE
// Main router wrapper; guards protected routes.
export default function AppRoutes() {
  const isAuthenticated = !!getToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/" element={isAuthenticated ? <GamePage /> : <Navigate to="/login" />} />
        <Route path="/history" element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
