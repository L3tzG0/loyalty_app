// src/admin/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAdminAuth from "../hooks/useAdminAuth";

export default function AdminProtectedRoute({ children }) {
  const { loading, admin } = useAdminAuth();

  if (loading) return <p className="p-6">Loading...</p>;

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
