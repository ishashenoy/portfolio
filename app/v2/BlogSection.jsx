import Link from "next/link";
import styles from "./v2.module.css";

function formatDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function BlogSection({ posts }) {
  return (
    <section className={styles.blogSection} id="blog" aria-labelledby="blog-heading">
      <h2 id="blog-heading" className={styles.aboutHeading}>
        blog
      </h2>
      <ul className={styles.blogList}>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link className={styles.blogItem} href={`/blog/${post.slug}`}>
              <span className={styles.blogTitle}>{post.title}</span>
              {post.date ? <span className={styles.blogDate}>{formatDate(post.date)}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
