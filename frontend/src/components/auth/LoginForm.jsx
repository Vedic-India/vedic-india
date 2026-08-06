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
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">

      <h2 className="text-3xl font-bold text-center text-slate-800">
        Welcome Back
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Login to continue
      </p>

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

        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-2 relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-linear-to-r from-green-700 to-green-600 py-3 text-white font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t" />

        <span className="mx-3 text-gray-400 text-sm">
          OR
        </span>

        <div className="flex-1 border-t" />
      </div>

      <div className="flex justify-center">
        <GoogleAuthButton callbackUrl={callbackUrl} />
      </div>

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