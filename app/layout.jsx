import localFont from "next/font/local";
import { Lora } from "next/font/google";
import ContextMenuCluster from "./components/ContextMenuCluster";
import "./globals.css";

const openRunde = localFont({
  src: [
    { path: "./fonts/OpenRunde-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenRunde-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/OpenRunde-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/OpenRunde-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "isha shenoy",
  description: "Portfolio — projects and contact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${openRunde.variable} ${lora.variable}`}>
      <body className={`${openRunde.className} antialiased`}>
        {children}
        <ContextMenuCluster />
      </body>
    </html>
  );
}
