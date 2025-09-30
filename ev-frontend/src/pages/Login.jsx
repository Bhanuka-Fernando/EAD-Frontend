import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";
import { useRole } from "../auth/useRole";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode"; // add this

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export default function Login() {
  const { signIn, token } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // allowlist only these roles for web
  const allowed = role === "Backoffice" || role === "Operator";

  if (token && allowed) return <Navigate to="/dashboard" replace />;
  if (token && !allowed) return <Navigate to="/unauthorized" replace />; // <-- prevents loop

  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const data = await authApi.login(values); // expect { token, role? }

      // determine role from response or decode token
      let r = data?.role;
      if (!r && data?.token) {
        try {
          const decoded = jwtDecode(data.token);
          r = decoded?.role || (Array.isArray(decoded?.roles) ? decoded.roles[0] : undefined);
        } catch {}
      }

      // block ev_owner (or any non-allowed)
      if (!["Backoffice", "Operator"].includes(r)) {
        toast.error("Web access is only for Backoffice and Station Operator.");
        return; // do NOT signIn
      }

      signIn(data.token);
      toast.success("Logged in");
      setTimeout(() => navigate("/dashboard", { replace: true }), 0);
    } catch (e) {
      toast.error(e.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Toaster />
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">EV Web Login</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Backoffice & Station Operator</p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium mb-1">Username / Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              {...register("username")}
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            className="w-full rounded-xl bg-black text-white py-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {allowed && role === "Backoffice" && (
          <div className="mt-6 text-center text-sm">
            <Link to="/register" className="text-blue-600 hover:underline">Create user (Backoffice)</Link>
          </div>
        )}
      </div>
    </div>
  );

}
