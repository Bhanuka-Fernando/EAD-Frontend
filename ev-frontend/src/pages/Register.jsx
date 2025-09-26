import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../api/authApi";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["Backoffice","Operator"]),
});

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState:{ errors }, reset } =
    useForm({ resolver: zodResolver(schema), defaultValues: { role: "Operator" } });

  const onSubmit = async (v) => {
    try {
      setLoading(true);
      if (v.role === "Backoffice") await authApi.registerBackoffice(v);
      else await authApi.registerOperator(v);
      toast.success(`${v.role} created`);
      reset();
    } catch (e) {
      toast.error(e.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Toaster />
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Create Web User</h1>
        <p className="text-sm text-gray-600 mb-6">Backoffice can create Backoffice or Operator users</p>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input className="w-full rounded-lg border px-3 py-2" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="w-full rounded-lg border px-3 py-2" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="w-full rounded-lg border px-3 py-2" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <select className="w-full rounded-lg border px-3 py-2" {...register("role")}>
              <option value="Operator">Station Operator</option>
              <option value="Backoffice">Backoffice</option>
            </select>
            {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button className="rounded-xl bg-black text-white px-4 py-2" disabled={loading}>
              {loading ? "Creating..." : "Create user"}
            </button>
            <a href="/dashboard" className="text-blue-600 text-sm self-center">Back to dashboard</a>
          </div>
        </form>
      </div>
    </div>
  );
}
