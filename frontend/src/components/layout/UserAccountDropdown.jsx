"use client";

import Link from "next/link";
import {
  CircleUserRound,
  LogOut,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getMenuItems(role, paths) {
  const customerMenu = [
    {
      label: "My Profile",
      href: paths.profileHref,
      icon: UserRound,
    },
    {
      label: "My Orders",
      href: paths.ordersHref,
      icon: Package,
    },
    {
      label: "My Addresses",
      href: paths.addressesHref,
      icon: MapPin,
    },
  ];

  const adminMenu = [
    {
      label: "My Profile",
      href: paths.profileHref,
      icon: UserRound,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: Package,
    },
  ];

  if (role === "admin") {
    return adminMenu;
  }

  return customerMenu;
}

export default function UserAccountDropdown({
  profileHref = "/account",
  addressesHref = "/account/addresses",
  ordersHref = "/account/orders",
  className,
}) {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = isAuthenticated
    ? getMenuItems(user?.role, {
        profileHref,
        addressesHref,
        ordersHref,
      })
    : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          aria-busy={isLoading ? "true" : undefined}
          disabled={isLoading}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-(--color-secondary) hover:text-(--color-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-secondary)/30",
            className
          )}
        >
          <CircleUserRound size={22} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-2">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel className="px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#f59e0b)] text-sm font-semibold text-white shadow-sm">
                  {getInitials(user?.name || "User")}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem asChild key={item.label}>
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="size-4 text-slate-500 transition group-data-highlighted:text-(--color-secondary) dark:text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              asChild
              className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-950/40 dark:data-highlighted:bg-rose-950/40 dark:data-highlighted:text-rose-300"
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="flex items-center gap-3">
              <CircleUserRound className="size-4 text-slate-500 transition group-data-highlighted:text-(--color-secondary) dark:text-slate-400" />
              <span>Sign In</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}