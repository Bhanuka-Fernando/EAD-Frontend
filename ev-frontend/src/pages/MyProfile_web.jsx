import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import usersApi from "../api/usersApi";

// ---- Schemas ----
const profileSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Enter a valid phone")
    .max(20, "Phone too long")
    .regex(/^[0-9+\-()\s]*$/, "Digits and + - ( ) only"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmNewPassword: z.string().min(8, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export default function MyProfile() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // profile form
  const {
    register: pReg,
    handleSubmit: pSubmit,        
    reset: pReset,
    formState: { errors: pErr, isDirty: pDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", email: "", phone: "" },
  });

  // password form
  const {
    register: pwReg,
    handleSubmit: pwSubmit,
    reset: pwReset,
    formState: { errors: pwErr },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingProfile(true);
        const data = await usersApi.getMyProfile();
        if (alive) {
          pReset({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch (e) {
        toast.error(e?.message || "Failed to load profile");
      } finally {
        if (alive) setLoadingProfile(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pReset]);

  // submit handlers
  const onSaveProfile = async (values) => {
    try {
      setSavingProfile(true);
      await usersApi.updateMyProfile(values);
      toast.success("Profile updated");
      pReset(values);
    } catch (e) {
      toast.error(e?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      setSavingPassword(true);
      await usersApi.changeMyPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed");
      pwReset();
    } catch (e) {
      toast.error(e?.message || "Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h1>

        {/* Profile card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile details</h2>
            {loadingProfile && (
              <span className="text-sm text-gray-500">Loading…</span>
            )}
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={pSubmit(onSaveProfile)}
          >
            <div className="col-span-1">
              <label className="text-sm font-medium">Full name</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                {...pReg("fullName")}
              />
              {pErr.fullName && (
                <p className="text-sm text-red-600">{pErr.fullName.message}</p>
              )}
            </div>

            <div className="col-span-1">
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="email"
                {...pReg("email")}
              />
              {pErr.email && (
                <p className="text-sm text-red-600">{pErr.email.message}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="+94 71 234 5678"
                {...pReg("phone")}
              />
              {pErr.phone && (
                <p className="text-sm text-red-600">{pErr.phone.message}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex gap-3 pt-2">
              <button
                className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
                disabled={savingProfile || loadingProfile || !pDirty}
                type="submit"
              >
                {savingProfile ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Change password</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={pwSubmit(onChangePassword)}
          >
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium">Current password</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="password"
                {...pwReg("currentPassword")}
              />
              {pwErr.currentPassword && (
                <p className="text-sm text-red-600">
                  {pwErr.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">New password</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="password"
                {...pwReg("newPassword")}
              />
              {pwErr.newPassword && (
                <p className="text-sm text-red-600">
                  {pwErr.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Confirm new password</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="password"
                {...pwReg("confirmNewPassword")}
              />
              {pwErr.confirmNewPassword && (
                <p className="text-sm text-red-600">
                  {pwErr.confirmNewPassword.message}
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex gap-3 pt-2">
              <button
                className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
                disabled={savingPassword}
                type="submit"
              >
                {savingPassword ? "Changing…" : "Change password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
