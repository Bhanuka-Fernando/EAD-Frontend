import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileIconLink from "../components/ProfileIconLink";

export default function BackofficeDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { signOut(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Backoffice Dashboard</h1>
            <ProfileIconLink />
          <button onClick={handleLogout} className="rounded-xl bg-black text-white px-4 py-2">Logout</button>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold mb-2">Admin Tools</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><a className="text-blue-600" href="/register">Create Backoffice / Operator</a></li>
              <li>User management, audit logs, configs</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-6">
            <h2 className="font-semibold mb-2">Token</h2>
            <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
