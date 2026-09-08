import { Roboto } from "next/font/google";
import SidebarMusicCovers from "../components/SidebarMusicCovers";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-roboto",
});

export default function BlogLayout({ children }) {
  return (
    <div className={`${roboto.variable} blog-shell`}>
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-[min(100%,280px)] lg:self-start">
          <SidebarMusicCovers />
        </aside>
      </div>
    </div>
  );
}
