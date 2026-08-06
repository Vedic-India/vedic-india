"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { forgotPasswordSchema } from "@/schemas/auth.schema";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      const message = "If an account exists for that email, check your inbox for reset instructions.";

      setSuccessMessage(message);
      toast.success(message);
    },
    onError: (error) => {
      setSuccessMessage("");
      toast.error(
        error?.response?.data?.message ||
          "Unable to send password reset email"
      );
    },
  });

  const onSubmit = async (values) => {
    forgotPasswordMutation.mutate(values.email);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Forgot Password
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Enter your email to receive a reset link
      </p>

      {successMessage && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>

          <div className="mt-2 relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition

              ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-green-600"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full rounded-xl bg-linear-to-r from-green-700 to-green-600 py-3 text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-7 text-center text-gray-500">
        Remembered your password?{" "}
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