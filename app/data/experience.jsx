const hl =
  "rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[var(--fg)]";

/** Optional thumbnails: /public/images/thumb/ — inline logo in the title pill reuses thumb_url. */
export const experience = [
  {
    id: "mytria",
    role: "founder",
    title: "mytria",
    summary: (
      <>
        Built and scaled a consumer entertainment tracker platform to{" "}
        <span className="bg-[var(--accent)] px-1 text-[var(--accent-fg)]">15k+ users</span>, 200k+ titles, and 3m+
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
        <span className="bg-[var(--accent)] px-1 text-[var(--accent-fg)]">Bloomberg Philanthropies</span>-funded
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
    id: "capston",
    role: "software engineering intern",
    title: "capston",
    summary: " employee #3. building and shipping AI workflow systems end-to-end!",
    thumb_url: "https://www.capston.ca/opengraph-image.png?opengraph-image.0rkr00j4..vz3.png?dpl=dpl_BGfs81qHarGwqT9njfS13KmL7xTx",
    initials: "C",
    link: "https://capston.ca/",
  },
];
