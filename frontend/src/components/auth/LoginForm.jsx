"use client";

import Link from "next/link";
import { Mail, Lock } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { loginSchema } from "@/schemas/auth.schema";
import { loginUser } from "@/services/auth.service";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function LoginForm({ callbackUrl = "/" }) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await loginUser(values);

      toast.success("Logged in successfully");

      window.location.assign("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to login"
      );
    }
  };

  return (
    <div className="w-full min-w-0 max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-8">
      <h2 className="text-center text-3xl font-bold text-slate-800">
        Welcome Back
      </h2>

      <p className="mt-2 text-center text-gray-500">
        Login to continue
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 w-full min-w-0 space-y-5"
      >
        {/* Email */}
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>

          <div className="relative mt-2 min-w-0">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={`block w-full min-w-0 rounded-xl border py-3 pl-11 pr-4 outline-none transition ${
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

        {/* Password */}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <label className="shrink-0 text-sm font-medium text-gray-700">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="shrink-0 text-right text-sm text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative mt-2 min-w-0">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className={`block w-full min-w-0 rounded-xl border py-3 pl-11 pr-4 outline-none transition ${
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

        {/* Login button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-linear-to-r from-green-700 to-green-600 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex min-w-0 items-center">
        <div className="min-w-0 flex-1 border-t" />

        <span className="mx-3 shrink-0 text-sm text-gray-400">
          OR
        </span>

        <div className="min-w-0 flex-1 border-t" />
      </div>

      {/* Google */}
      <div className="w-full min-w-0">
        <GoogleAuthButton callbackUrl={callbackUrl} />
      </div>

      {/* Signup */}
      <p className="mt-7 text-center text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-green-700 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}