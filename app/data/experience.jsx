const hl =
  "rounded-md border border-[var(--border)] bg-[#eceae6] px-1.5 py-0.5 text-[var(--fg)]";

/** Optional thumbnails: /public/images/thumb/ — inline logo in the title pill reuses thumb_url. */
export const experience = [
  {
    id: "mytria",
    role: "founder",
    title: "mytria",
    summary: (
      <>
        Built and scaled a consumer entertainment tracker platform to{" "}
        <span className="bg-[#ff1493] px-1 text-white">15k+ users</span>, 200k+ titles, and 3m+
        views ($0 ad spend).
      </>
    ),
    thumb_url: "/images/thumb/mymediatracker.png",
    initials: "M",
    link: "https://mytria.app/",
    bullets: (
      <>
        <li>
          <span className={hl}>15k+ users, 200k+ titles, 3m+ views</span> online.
        </li>
        <li>full-stack mobile & web architecture end-to-end.</li>
        <li>product, growth, and user acquisition.</li>
      </>
    ),
  },
  {
    id: "grassroots-kw",
    role: "web developer",
    title: "grassroots kw",
    summary: (
      <>
        <span className="bg-[#ff1493] px-1 text-white">Bloomberg Philanthropies</span>-funded
        climate advocacy platform with Next.js and automated data refresh workflows.
      </>
    ),
    thumb_url: "/images/thumb/grassrootskw.png",
    initials: "GK",
    link: "https://grassrootskw.org/",
    bullets: (
      <>
        <li>
          funded by <span className={hl}>bloomberg philanthropies</span>.
        </li>
        <li>climate advocacy platform in typescript & next.js.</li>
        <li>playwright pipeline for biweekly data refresh.</li>
      </>
    ),
  },
  {
    id: "atkins-realis",
    role: "incoming 2026",
    title: "atkinsréalis",
    summary: "working on multi-million-dollar nuclear infrastructure projects!",
    thumb_url: "/images/thumb/atkinsrealis.jpg",
    initials: "AR",
    link: "https://www.atkinsrealis.com/",
    bullets: (
      <>
        <li>built internal tools to improve engineering team velocity.</li>
        <li>contributed to software features across planning, delivery, and testing.</li>
        <li>collaborated with engineers and stakeholders on production requirements.</li>
      </>
    ),
  },
];
