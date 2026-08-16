"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import Container from "./Container";
import UserAccountDropdown from "./UserAccountDropdown";

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Benefits",
    href: "/benefits",
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

  const pathname = usePathname();

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
        className={`fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-[#F6FAFF]/90 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <Container>
          <div className="flex h-22 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo1.png"
                alt="Vedic India"
                width={170}
                height={62}
                priority
                className="h-auto w-[145px] sm:w-[160px] lg:w-[170px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-10 lg:flex">
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className={`text-[15px] font-medium transition-colors ${
                      isActive
                        ? "text-(--color-secondary)"
                        : "text-slate-700 hover:text-(--color-secondary)"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-6 lg:flex">
              <UserAccountDropdown />

              <Link
                href="/cart"
                className="relative transition hover:scale-105 hover:text-(--color-secondary)"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 lg:hidden">
              {/* User */}
              <UserAccountDropdown />

              {/* Cart */}
              <Link
                href="/cart"
                className="relative transition hover:scale-105 hover:text-(--color-secondary)"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} />
              </Link>

              {/* Menu */}
              <button
                type="button"
                onClick={() => setMobileMenu(true)}
                aria-label="Open menu"
                className="transition hover:text-(--color-secondary)"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 z-[70] h-dvh w-[min(20rem,88vw)] bg-white px-8 py-8 shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  aria-label="Close menu"
                  className="transition hover:text-(--color-secondary)"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="mt-12 flex flex-col gap-8">
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      onClick={() => setMobileMenu(false)}
                      className={`text-xl font-semibold transition-colors ${
                        isActive
                          ? "text-(--color-secondary)"
                          : "text-slate-700 hover:text-(--color-secondary)"
                      }`}
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Cart */}
              <div className="mt-12 border-t border-slate-200 pt-8">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 text-lg font-semibold text-slate-700 transition-colors hover:text-(--color-secondary)"
                >
                  <ShoppingCart size={22} />
                  <span>Cart</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}