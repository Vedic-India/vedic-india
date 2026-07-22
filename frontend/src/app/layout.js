import { Inter, Manrope } from "next/font/google";
import "./global.css";

import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Vedic India",
  description: "India's First Magnetized Alkaline Water Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <QueryProvider>

          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />

        </QueryProvider>
      </body>
    </html>
  );
}