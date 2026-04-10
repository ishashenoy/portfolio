import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug, preserveExtraMarkdownBlankLines } from "../../lib/blog";

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

    return (
      <div className="min-h-screen px-5 pb-24 pt-16 sm:px-8">
        <div className="mx-auto w-full max-w-[900px]">
          <header className="mb-8">
            <Link href="/blog" className="text-[var(--link)] hover:underline">
              ← back to blog
            </Link>
            <h1 className="mt-5 text-[clamp(1.9rem,4.2vw,2.8rem)] font-bold lowercase leading-tight tracking-tight text-[var(--fg)]">
              {post.title}
            </h1>
            {post.date ? (
              <p className="mt-3 text-sm lowercase text-[var(--muted)]">{post.date}</p>
            ) : null}
          </header>

          <article className="prose prose-neutral max-w-none text-[var(--muted)] prose-headings:lowercase prose-headings:text-[var(--fg)] prose-p:leading-relaxed prose-p:mb-6 [&_p:last-child]:mb-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mb-4 mt-10 text-[clamp(1.5rem,3.2vw,2.1rem)] font-semibold lowercase leading-tight tracking-tight text-[var(--fg)]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-8 text-[clamp(1.2rem,2.4vw,1.55rem)] font-semibold lowercase leading-tight tracking-tight text-[var(--fg)]">
                    {children}
                  </h3>
                ),
                img: ({ src = "", alt = "", title = "" }) => (
                  <figure className="my-8">
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full rounded-xl border border-[var(--border)] object-cover"
                    />
                    {title ? (
                      <figcaption className="mt-2 text-sm text-[var(--muted)]">{title}</figcaption>
                    ) : null}
                  </figure>
                ),
              }}
            >
              {contentWithoutTitle}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
