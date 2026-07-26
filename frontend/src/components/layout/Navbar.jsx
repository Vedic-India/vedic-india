"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "./Container";

const links = [
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Benefits",
    href: "/benefits"
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "FAQs",
    href: "/faqs",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200 bg-[#F6FAFF]/90 backdrop-blur-xl shadow-sm"
            : "border-b border-slate-200 bg-[#F6FAFF]/90 backdrop-blur-xl"
        }`}
      >
        <Container>
          <div className="flex h-[88px] items-center justify-between">

            <Link href="/">
              <Image
                src="/logo.png"
                alt="Vedic India"
                width={170}
                height={62}
                priority
              />
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-[15px] font-medium text-slate-700 transition hover:text-[var(--color-secondary)]"
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-6 lg:flex">

              <button className="transition hover:text-[var(--color-secondary)]">
                <Search size={21} />
              </button>

              <button className="transition hover:text-[var(--color-secondary)]">
                <User size={21} />
              </button>

              <Link
  href="/cart"
  className="relative transition hover:scale-105 hover:text-[var(--color-secondary)]"
>
  <ShoppingCart size={22} />

  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[10px] font-semibold text-white">
    0
  </span>
</Link>

            </div>

            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={28} />
            </button>

          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
            />

            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-80 bg-white p-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-end">
                <button onClick={() => setMobileMenu(false)}>
                  <X size={28} />
                </button>
              </div>

              <div className="mt-12 flex flex-col gap-8">
                {links.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className="text-xl font-semibold text-slate-700"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}