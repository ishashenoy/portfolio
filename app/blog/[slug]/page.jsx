import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostImage } from "../../components/BlogPostImage";
import { MarkBlogPostRead } from "../../components/MarkBlogPostRead";
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
      <div className="w-full max-w-[780px]">
        <MarkBlogPostRead slug={post.slug} />
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

        <article
          className={
            "prose prose-neutral max-w-none text-[var(--muted)] prose-headings:lowercase prose-headings:text-[var(--fg)] prose-p:leading-relaxed prose-p:mb-6 [&_p:last-child]:mb-0 " +
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
                <BlogPostImage src={src} alt={alt} title={title} />
              ),
            }}
          >
            {contentWithoutTitle}
          </ReactMarkdown>
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
