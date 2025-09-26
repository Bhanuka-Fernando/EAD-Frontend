import { Outlet, Navigate } from "react-router-dom";
import { useRole } from "./useRole";

export default function RoleGate({ allowed }) {
  const role = useRole();
  if (!role) return null; // still resolving role; parent can render a loader
  return allowed.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
