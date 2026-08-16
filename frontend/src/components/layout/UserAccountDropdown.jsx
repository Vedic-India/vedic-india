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
      {/* Account Button */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          aria-busy={isLoading ? "true" : undefined}
          disabled={isLoading}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200",
            "hover:border-(--color-secondary) hover:text-(--color-secondary) hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-secondary)/30",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          <CircleUserRound
            size={22}
            strokeWidth={1.8}
          />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        avoidCollisions
        className="
          !z-[100]
          !w-[180px]
          !min-w-[180px]
          !rounded-2xl
          !border
          !border-slate-200
          !bg-[#F6FAFF]
          !p-1.5
          !text-slate-700
          !shadow-[0_10px_30px_rgba(15,23,42,0.12)]
        "
      >
        {isAuthenticated ? (
          <>
            {/* User Header */}
            <DropdownMenuLabel className="!px-2.5 !py-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="
                    flex
                    size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-(--color-secondary)
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {getInitials(user?.name || "User")}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-[10px] text-slate-500">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="!my-1 !bg-slate-200" />

            {/* Menu Items */}
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <DropdownMenuItem
                    key={item.label}
                    asChild
                    className="
                      !cursor-pointer
                      !rounded-xl
                      !px-2.5
                      !py-2
                      !text-xs
                      !font-medium
                      !text-slate-700
                      !outline-none
                      focus:!bg-emerald-50
                      focus:!text-(--color-secondary)
                      data-[highlighted]:!bg-emerald-50
                      data-[highlighted]:!text-(--color-secondary)
                    "
                  >
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-2.5"
                    >
                      <Icon
                        className="size-3.5 shrink-0 !text-slate-500"
                        strokeWidth={1.8}
                      />

                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator className="!my-1 !bg-slate-200" />

            {/* Logout */}
            <DropdownMenuItem
              asChild
              className="
                !cursor-pointer
                !rounded-xl
                !px-2.5
                !py-2
                !text-xs
                !font-medium
                !text-rose-600
                !outline-none
                focus:!bg-rose-50
                focus:!text-rose-700
                data-[highlighted]:!bg-rose-50
                data-[highlighted]:!text-rose-700
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5"
              >
                <LogOut
                  className="size-3.5 shrink-0"
                  strokeWidth={1.8}
                />

                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </>
        ) : (
          /* Sign In */
          <DropdownMenuItem
            asChild
            className="
              !cursor-pointer
              !rounded-xl
              !px-2.5
              !py-2.5
              !text-xs
              !font-medium
              !text-slate-700
              !outline-none
              focus:!bg-emerald-50
              focus:!text-(--color-secondary)
              data-[highlighted]:!bg-emerald-50
              data-[highlighted]:!text-(--color-secondary)
            "
          >
            <Link
              href="/login"
              className="flex w-full items-center gap-2.5"
            >
              <CircleUserRound
                className="size-3.5 shrink-0 !text-slate-500"
                strokeWidth={1.8}
              />

              <span>Sign In</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}