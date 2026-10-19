import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostImage } from "../../components/BlogPostImage";
import BlogToc from "../../components/BlogToc";
import { MarkBlogPostRead } from "../../components/MarkBlogPostRead";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug, preserveExtraMarkdownBlankLines } from "../../lib/blog";
import styles from "../blog.module.css";

function isImageOnlyParagraph(node) {
  const children = node?.children ?? [];
  const content = children.filter((child) => {
    if (child.type === "text") return child.value.trim().length > 0;
    return true;
  });
  return content.length === 1 && content[0]?.tagName === "img";
}

function childrenToText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join("");
  if (typeof node === "object" && node.props) return childrenToText(node.props.children);
  return "";
}

function headingTitle(text) {
  const match = String(text).match(/^\d+\s*\/\s*(.+)$/);
  return match ? match[1].trim() : null;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const contentWithoutTitle = preserveExtraMarkdownBlankLines(
      post.content.replace(/^#\s+.+(?:\r?\n)?/, "")
    );
    let headingIndex = 0;
    const metaItems = [
      post.timeline ? { label: "Timeline", value: post.timeline } : null,
      post.tools ? { label: "Tools", value: post.tools } : null,
      post.skills.length ? { label: "Skills", value: post.skills.join(", ") } : null,
    ].filter(Boolean);

    return (
      <div className={styles.frame}>
        <MarkBlogPostRead slug={post.slug} />
        <aside className={styles.sidebar}>
          <Link href="/writing" className={styles.back}>
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            Back
          </Link>
          <BlogToc items={post.headings} />
        </aside>
        <div className={styles.main}>
          <header>
            <h1 className={styles.title}>{post.title}</h1>
            {post.description ? <p className={styles.description}>{post.description}</p> : null}
            {metaItems.length ? (
              <dl className={styles.meta}>
                {metaItems.map((item) => (
                  <div key={item.label} className={styles.metaItem}>
                    <dt className={styles.metaLabel}>{item.label}</dt>
                    <dd className={styles.metaValue}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </header>

          <article
            className={
              `${styles.body} blog-post-body min-w-0 max-w-none overflow-x-hidden [&_p]:mb-6 [&_p:last-child]:mb-0 ` +
              "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-5 [&_li]:my-1 " +
              "[&_table]:w-full [&_table]:table-fixed [&_table_td]:align-top [&_table_th]:align-top " +
              "[&_table_td_figure]:!my-2 [&_table_th_figure]:!my-2 " +
              "[&_table_td_figure_img]:!h-[min(13rem,36vw)] [&_table_td_figure_img]:w-full [&_table_td_figure_img]:!max-h-none [&_table_td_figure_img]:object-cover " +
              "[&_table_th_figure_img]:!h-[min(13rem,36vw)] [&_table_th_figure_img]:w-full [&_table_th_figure_img]:!max-h-none [&_table_th_figure_img]:object-cover"
            }
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children }) => {
                  const heading = post.headings[headingIndex++];
                  const text = childrenToText(children);
                  const title = headingTitle(text);
                  const id = heading?.id ?? text;
                  return (
                    <h2 id={id} className={styles.heading}>
                      {title ?? children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className={styles.subheading}>{children}</h3>
                ),
                p: ({ node, children }) =>
                  isImageOnlyParagraph(node) ? children : <p>{children}</p>,
                img: ({ src = "", alt = "", title = "" }) => (
                  <BlogPostImage src={src} alt={alt} title={title} />
                ),
                hr: () => <hr className={styles.rule} />,
                strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className={styles.quote}>{children}</blockquote>
                ),
              }}
            >
              {contentWithoutTitle}
            </ReactMarkdown>
          </article>
          {post.credit ? <p className={styles.credit}>{post.credit}</p> : null}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}