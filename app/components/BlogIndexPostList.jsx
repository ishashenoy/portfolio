"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogReadStatus } from "./BlogReadStatus";

export function BlogIndexPostList({ posts }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog/views")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.counts && typeof d.counts === "object") {
          setCounts(d.counts);
        } else if (!cancelled) {
          setCounts({});
        }
      })
      .catch(() => {
        if (!cancelled) setCounts({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-t border-[var(--border)]">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group grid grid-cols-[1.6fr_1fr_3.5rem_1.5fr] items-start gap-4 border-b border-[var(--border)] py-3 text-[var(--fg)] transition hover:bg-black/[0.02]"
        >
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-1 text-[13px] leading-none">●</span>
            <div className="min-w-0">
              <p className="truncate text-[clamp(1.1rem,2vw,1.35rem)] font-semibold lowercase leading-tight tracking-tight">
                {post.title}
              </p>
            </div>
          </div>
          <p className="pt-0.5 text-[14px] text-[var(--muted)]">{post.dateLabel}</p>
          <span className="inline-block min-w-[3.5rem] pt-0.5 text-right text-[14px] lowercase text-[var(--muted)] group-hover:text-[var(--link)]">
            {counts === null ? "\u2003" : String(counts[post.slug] ?? 0)}
          </span>
          <BlogReadStatus slug={post.slug} />
        </Link>
      ))}
    </section>
  );
}
