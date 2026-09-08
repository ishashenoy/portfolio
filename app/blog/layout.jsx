import { Inter, Roboto } from "next/font/google";
import styles from "./blog.module.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-inter",
});

export default function BlogLayout({ children }) {
  return (
    <div className={`${styles.shell} ${roboto.variable} ${inter.variable} ${roboto.className}`}>
      {children}
    </div>
  );
}