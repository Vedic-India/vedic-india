"use client";

import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/services/auth.service";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);

      toast.success("Account created successfully");

      window.location.assign("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to register"
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center">
        Create Account
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Join Vedic India today
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >

        <div>
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border py-3 pl-11 pr-4"
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="w-full rounded-xl border py-3 pl-11 pr-4"
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border py-3 pl-11 pr-4"
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
          className="w-full rounded-xl bg-linear-to-r from-green-700 to-green-600 py-3 text-white font-semibold"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t"></div>

        <span className="mx-3 text-gray-400 text-sm">
          OR
        </span>

        <div className="flex-1 border-t"></div>
      </div>

      <div className="flex justify-center">
        <GoogleAuthButton successMessage="Account created successfully" errorMessage="Google login failed" />
      </div>

      <p className="mt-7 text-center text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-green-700 font-semibold"
        >
          Login
        </Link>
      </p>
    </div>
  );
}