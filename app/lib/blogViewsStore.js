import fs from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";

const HASH_KEY = "blog:views";
const FILE_PATH = path.join(process.cwd(), "data", "blog-views.json");

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();

function sanitizeSlug(slug) {
  return slug.replace(/[^a-zA-Z0-9-_]/g, "");
}

async function readFileCounts() {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const data = JSON.parse(raw);
    return typeof data === "object" && data !== null ? data : {};
  } catch {
    return {};
  }
}

async function writeFileCounts(counts) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(counts, null, 2), "utf8");
}

/**
 * @returns {Promise<Record<string, number>>}
 */
export async function getAllBlogViewCounts() {
  if (redis) {
    const raw = await redis.hgetall(HASH_KEY);
    if (!raw) return {};
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      const n = Number(v);
      if (Number.isFinite(n)) out[k] = n;
    }
    return out;
  }

  const file = await readFileCounts();
  const out = {};
  for (const [k, v] of Object.entries(file)) {
    const n = Number(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

/**
 * @returns {Promise<number>}
 */
export async function getBlogViewCount(slug) {
  const safe = sanitizeSlug(slug);
  if (!safe) return 0;
  if (redis) {
    const v = await redis.hget(HASH_KEY, safe);
    const n = v == null ? 0 : Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  const all = await readFileCounts();
  const n = Number(all[safe]);
  return Number.isFinite(n) ? n : 0;
}

/**
 * @returns {Promise<number>} new total for slug
 */
export async function incrementBlogView(slug) {
  const safe = sanitizeSlug(slug);
  if (!safe) return 0;

  if (redis) {
    return redis.hincrby(HASH_KEY, safe, 1);
  }

  const all = await readFileCounts();
  all[safe] = (Number(all[safe]) || 0) + 1;
  try {
    await writeFileCounts(all);
  } catch (e) {
    console.error("blog views file write failed (use Upstash Redis on serverless):", e);
  }
  return all[safe];
}
