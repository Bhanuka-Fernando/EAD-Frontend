import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../auth/useRole";

export default function Dashboard() {
  const role = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return; // wait for role to be decoded
    if (role === "Backoffice") navigate("/backoffice", { replace: true });
    else if (role === "Operator") navigate("/operator", { replace: true });
    else navigate("/login", { replace: true });
  }, [role, navigate]);

  return <div className="p-6 text-gray-600">Loading dashboard…</div>;
}
