"use client";

import { useEffect, useState } from "react";

export function BlogPostViewCounter({ slug }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/blog/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        /* ignore */
      }
    };

    const id = setTimeout(run, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [slug]);

  if (count === null) {
    return (
      <span className="text-sm lowercase text-[var(--muted)]" aria-hidden>
        {"\u2003"}
      </span>
    );
  }

  return (
    <p className="text-sm lowercase text-[var(--muted)]">
      {count} {count === 1 ? "view" : "views"}
    </p>
  );
}
