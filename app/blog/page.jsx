import Link from "next/link";
import { BlogIndexPostList } from "../components/BlogIndexPostList";
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
  const rows = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    dateLabel: formatDate(post.date),
  }));

  return (
    <>
      <header className="mb-10">
        <h1 className="w-fit text-left text-[clamp(2.25rem,9vw,5rem)] font-bold lowercase leading-[0.92] tracking-tight text-[var(--fg)]">
          blog
        </h1>
      </header>

      <BlogIndexPostList posts={rows} />

      <div className="mt-8">
        <Link href="/" className="text-[var(--link)] hover:underline">
          back home
        </Link>
      </div>
    </>
  );
}
