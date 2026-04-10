import Link from "next/link";
import { getAllPosts } from "../lib/blog";

function formatDate(dateValue) {
  if (!dateValue) return "undated";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen px-5 pb-24 pt-16 sm:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-10">
          <h1 className="w-fit text-left text-[clamp(2.25rem,9vw,5rem)] font-bold lowercase leading-[0.92] tracking-tight text-[var(--fg)]">
            blog
          </h1>
        </header>

        <section className="border-t border-[var(--border)]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[1.8fr_1fr_1.6fr] items-start gap-4 border-b border-[var(--border)] py-3 text-[var(--fg)] transition hover:bg-black/[0.02]"
            >
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-1 text-[13px] leading-none">●</span>
                <div className="min-w-0">
                  <p className="truncate text-[clamp(1.1rem,2vw,1.35rem)] font-semibold lowercase leading-tight tracking-tight">
                    {post.title}
                  </p>
                </div>
              </div>
              <p className="pt-0.5 text-[14px] text-[var(--muted)]">
                {formatDate(post.date)}
              </p>
              <p className="pt-0.5 text-[14px] text-[var(--muted)] group-hover:text-[var(--link)]">
                open post
              </p>
            </Link>
          ))}
        </section>

        <div className="mt-8">
          <Link href="/" className="text-[var(--link)] hover:underline">
            back home
          </Link>
        </div>
      </div>
    </div>
  );
}
