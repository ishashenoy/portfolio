import localFont from "next/font/local";
import { Lora } from "next/font/google";
import ContextMenuCluster from "./components/ContextMenuCluster";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const themeInitScript = `
(function(){
  try {
    if (localStorage.getItem("portfolio-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
})();
`;

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
    <html lang="en" suppressHydrationWarning className={`${openRunde.variable} ${lora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${openRunde.className} antialiased`}>
        {children}
        <ContextMenuCluster />
        <ThemeToggle />
      </body>
    </html>
  );
}
