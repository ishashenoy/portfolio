import SidebarMusicCovers from "../components/SidebarMusicCovers";

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen px-5 pb-24 pt-16 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-[min(100%,280px)] lg:self-start">
          <SidebarMusicCovers />
        </aside>
      </div>
    </div>
  );
}
