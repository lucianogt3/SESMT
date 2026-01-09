import React from "react";
import { Navigate } from "react-router-dom";
import { dataService } from "../services/dataService";

const isAuthed = () => {
  // API mode uses token; mock mode uses sesmt_user
  const token = localStorage.getItem("sesmt_token");
  const user = localStorage.getItem("sesmt_user");
  return !!(token || user);
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
