import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OperatorDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { signOut(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold mb-2">Station Operations</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>View station status, slots</li>
              <li>Check upcoming bookings</li>
              <li>Start/stop sessions (as per spec)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
