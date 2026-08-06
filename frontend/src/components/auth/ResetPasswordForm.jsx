"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { resetPasswordSchema } from "@/schemas/auth.schema";
import { resetPassword } from "@/services/auth.service";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ password }) => resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successfully");

      router.push("/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to reset password"
      );
    },
  });

  const onSubmit = (values) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    resetPasswordMutation.mutate(values);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Reset Password
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Create a new password for your account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>

          <div className="mt-2 relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Enter new password"
              className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition

              ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-600"
              }`}
            />
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="mt-2 relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm new password"
              className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition

              ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-600"
              }`}
            />
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending || !token}
          className="w-full rounded-xl bg-linear-to-r from-green-700 to-green-600 py-3 text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-7 text-center text-gray-500">
        Back to the{" "}
        <Link
          href="/login"
          className="font-semibold text-green-700 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
