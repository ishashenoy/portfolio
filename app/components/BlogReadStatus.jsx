"use client";

import { useEffect, useState } from "react";
import { getReadSlugs } from "../lib/blogReadStorage";

export function BlogReadStatus({ slug }) {
  const [read, setRead] = useState(null);

  useEffect(() => {
    const sync = () => setRead(getReadSlugs().has(slug));
    sync();
    window.addEventListener("blog-read-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("blog-read-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  return (
    <span className="inline-block min-w-[4.5rem] pt-0.5 text-right text-[14px] lowercase text-[var(--muted)] group-hover:text-[var(--link)]">
      {read === null ? "\u2003" : read ? "read" : "unread"}
    </span>
  );
}
