"use client";

import { useEffect } from "react";
import { Mail, Lock, Phone, UserRound, Shield } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changeCurrentPassword,
  updateName,
  updatePhone,
} from "@/services/user.service";
import {
  changePasswordSchema,
  profileInfoSchema,
} from "@/schemas/account.schema";

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function Card({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_60px_-36px_rgba(15,61,46,0.35)] sm:p-8">
      <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] text-white shadow-sm">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-6">{children}</div>
    </section>
  );
}

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1 text-sm text-rose-600">{message}</p>;
}

function FieldWrapper({ label, error, children }) {
  return (
    <div>
      <Label className="mb-2 text-sm font-medium text-slate-700">
        {label}
      </Label>

      {children}

      <FieldError message={error} />
    </div>
  );
}

function PersonalInformationForm() {
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name || "",
      phone: user.phone || "",
    });
  }, [user, reset]);

  const profileMutation = useMutation({
    mutationFn: async ({ name, phone }) => {
      let updatedUser = user;

      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();

      if (trimmedName !== (user?.name || "")) {
        updatedUser = await updateName(trimmedName);
        updateUser(updatedUser);
      }

      if (trimmedPhone !== (user?.phone || "")) {
        updatedUser = await updatePhone(trimmedPhone);
        updateUser(updatedUser);
      }

      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      reset({
        name: updatedUser?.name || "",
        phone: updatedUser?.phone || "",
      });

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Unable to update profile")
      );
    },
  });

  const onSubmit = (values) => {
    profileMutation.mutate(values);
  };

  const [watchName, watchPhone] = watch(["name", "phone"]);
  const isChanged =
    (watchName || "") !== (user?.name || "") ||
    (watchPhone || "") !== (user?.phone || "");

  return (
    <Card
      title="Personal Information"
      description="Keep your profile details up to date across checkout, orders, and support."
      icon={UserRound}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <FieldWrapper label="Name" error={errors.name?.message}>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("name")}
                type="text"
                placeholder="Enter your name"
                aria-invalid={!!errors.name}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-(--color-secondary) focus-visible:ring-(--color-secondary)/20"
              />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Email" error={undefined}>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                type="email"
                value={user?.email || ""}
                readOnly
                aria-readonly="true"
                className="h-12 rounded-2xl border-slate-200 bg-slate-100 pl-11 pr-4 text-[15px] text-slate-500 shadow-sm"
              />
            </div>
          </FieldWrapper>
        </div>

        <FieldWrapper label="Phone" error={errors.phone?.message}>
          <div className="relative max-w-md">
            <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              {...register("phone")}
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              aria-invalid={!!errors.phone}
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-(--color-secondary) focus-visible:ring-(--color-secondary)/20"
            />
          </div>
        </FieldWrapper>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={profileMutation.isPending || !(isDirty || isChanged)}
            className="h-12 rounded-2xl bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm transition hover:opacity-95"
          >
            {profileMutation.isPending ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SecurityForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changeCurrentPassword({
        oldPassword: currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      reset();
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Unable to change password")
      );
    },
  });

  const onSubmit = (values) => {
    passwordMutation.mutate(values);
  };

  return (
    <Card
      title="Security"
      description="Update your password to keep your account protected."
      icon={Shield}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FieldWrapper
          label="Current Password"
          error={errors.currentPassword?.message}
        >
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              {...register("currentPassword")}
              type="password"
              placeholder="Enter current password"
              aria-invalid={!!errors.currentPassword}
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-(--color-secondary) focus-visible:ring-(--color-secondary)/20"
            />
          </div>
        </FieldWrapper>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldWrapper
            label="New Password"
            error={errors.newPassword?.message}
          >
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("newPassword")}
                type="password"
                placeholder="Enter new password"
                aria-invalid={!!errors.newPassword}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-(--color-secondary) focus-visible:ring-(--color-secondary)/20"
              />
            </div>
          </FieldWrapper>

          <FieldWrapper
            label="Confirm Password"
            error={errors.confirmPassword?.message}
          >
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm new password"
                aria-invalid={!!errors.confirmPassword}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[15px] shadow-sm focus-visible:border-(--color-secondary) focus-visible:ring-(--color-secondary)/20"
              />
            </div>
          </FieldWrapper>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={passwordMutation.isPending}
            className="h-12 rounded-2xl bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] px-6 text-white shadow-sm transition hover:opacity-95"
          >
            {passwordMutation.isPending ? "Changing Password..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function AccountProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
          Account
        </p>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal details and security settings from one place.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <PersonalInformationForm />
        <SecurityForm />
      </div>
    </div>
  );
}