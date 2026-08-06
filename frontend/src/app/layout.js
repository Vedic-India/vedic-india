import { Inter, Manrope } from "next/font/google";
import "./global.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import AppProviders from "@/providers/AppProviders";

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
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <AppProviders>
            {children}
          </AppProviders>

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}