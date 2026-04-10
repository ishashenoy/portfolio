import fs from "node:fs/promises";
import path from "node:path";

const blogDir = path.join(process.cwd(), "content", "blog");

function getTitleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

function getPostTitle(meta, markdown, fallback) {
  if (typeof meta.title === "string" && meta.title.trim()) {
    return meta.title.trim();
  }
  return getTitleFromMarkdown(markdown, fallback);
}

function parseFrontmatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return { meta: {}, content: markdown };
  }

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    return { meta: {}, content: markdown };
  }

  const rawMeta = normalized.slice(4, end);
  const content = normalized.slice(end + 5);
  const meta = {};

  for (const line of rawMeta.split("\n")) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    meta[key.trim()] = rest.join(":").trim();
  }

  return { meta, content };
}

/**
 * CommonMark collapses runs of blank lines between blocks to a single paragraph break.
 * This inserts explicit breaks for each extra newline so vertical spacing matches the source.
 * Skips fenced ``` code blocks so literal newlines in code are unchanged.
 */
export function preserveExtraMarkdownBlankLines(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const chunks = normalized.split(/(```[\s\S]*?```)/g);
  return chunks
    .map((chunk) => {
      if (chunk.startsWith("```")) return chunk;
      return chunk.replace(/(\n\n)(\n+)/g, (_, blockSep, extras) => {
        const brs = Array.from(extras).map(
          () => '<br class="blog-md-extra-gap" aria-hidden="true" />'
        );
        // Each <br> must be followed by a blank line so the next block is still parsed as Markdown.
        return blockSep + brs.join("\n\n") + "\n\n";
      });
    })
    .join("");
}

export async function getAllPosts() {
  const entries = await fs.readdir(blogDir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.name.replace(/\.md$/, "");
      const fullPath = path.join(blogDir, file.name);
      const markdown = await fs.readFile(fullPath, "utf8");
      const { meta, content } = parseFrontmatter(markdown);
      return {
        slug,
        title: getPostTitle(meta, content, slug),
        date: meta.date || "",
      };
    })
  );

  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.slug.localeCompare(a.slug));
}

export async function getPostBySlug(slug) {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  const fullPath = path.join(blogDir, `${safeSlug}.md`);
  const markdown = await fs.readFile(fullPath, "utf8");
  const { meta, content } = parseFrontmatter(markdown);
  return {
    slug: safeSlug,
    title: getPostTitle(meta, content, safeSlug),
    date: meta.date || "",
    content,
  };
}
