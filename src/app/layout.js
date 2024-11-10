"use client";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";

import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "BongoExplorer- Find Hidden Gems",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/auth/register") || pathname.startsWith("/auth/login");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false} />
        <Navbar />
        {children}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
