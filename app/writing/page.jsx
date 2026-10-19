import { Roboto } from "next/font/google";
import Link from "next/link";
import { getAllPosts } from "../lib/blog";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default async function WritingPage() {
  const posts = await getAllPosts();

  return (
    <div
      className={roboto.className}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ letterSpacing: "-0.04em", textAlign: "center" }}>
        writing
        <br />
        <br />
        {posts.map((post, index) => (
          <span key={post.slug}>
            {index > 0 ? <br /> : null}
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </span>
        ))}
      </div>
    </div>
  );
}
