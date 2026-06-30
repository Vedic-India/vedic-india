"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Menu,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navLinks } from "@/constants/navigation";

import Container from "./Container";
import TopBar from "./TopBar";

export default function Navbar() {
  return (
    <>
      <TopBar />

      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-md">
        <Container>
          <div className="flex h-20 items-center justify-between">

            <Link href="/">
              <Image
                src="/logo.jpeg"
                alt="Vedic India"
                width={120}
                height={60}
                priority
              />
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium transition hover:text-[var(--color-secondary)]"
                >
                  {item.label}

                  {item.label !== "Contact" && (
                    <ChevronDown size={15} />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-5 lg:flex">
              <Search className="h-5 w-5 cursor-pointer transition hover:text-[var(--color-secondary)]" />

              <User className="h-5 w-5 cursor-pointer transition hover:text-[var(--color-secondary)]" />

              <button className="relative">
                <ShoppingCart className="h-5 w-5" />

                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xs text-white">
                  0
                </span>
              </button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden">
                  <Menu />
                </button>
              </SheetTrigger>

              <SheetContent side="left">
                <div className="mt-10 flex flex-col gap-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </Container>
      </header>
    </>
  );
}