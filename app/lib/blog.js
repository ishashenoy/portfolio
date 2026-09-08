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

export function slugifyHeading(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tocLabelFromHeading(label) {
  return label.replace(/^\d+\s*\/\s*/, "").trim() || label;
}

export function extractHeadings(markdown) {
  const headings = [];
  const seen = new Map();
  const re = /^##\s+(?!#)(.+)$/gm;
  let match;
  while ((match = re.exec(markdown))) {
    const raw = match[1].trim();
    const label = tocLabelFromHeading(raw);
    const base = slugifyHeading(label) || "section";
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    headings.push({
      id: count === 1 ? base : `${base}-${count}`,
      label,
    });
  }
  return headings;
}

function extractDescription(meta, markdown) {
  if (typeof meta.description === "string" && meta.description.trim()) {
    return meta.description.trim();
  }

  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#") || trimmed.startsWith("|") || trimmed.startsWith("![")) continue;
    if (/^\*[^*\n]+\*$/.test(trimmed)) continue;

    const text = trimmed
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (text) return text;
  }

  return "";
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
    description: extractDescription(meta, content),
    timeline: typeof meta.timeline === "string" ? meta.timeline.trim() : "",
    tools: typeof meta.tools === "string" ? meta.tools.trim() : "",
    skills:
      typeof meta.skills === "string"
        ? meta.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
    credit: typeof meta.credit === "string" ? meta.credit.trim() : "",
    headings: extractHeadings(content),
    content,
  };
}
