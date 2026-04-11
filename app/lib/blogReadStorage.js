const STORAGE_KEY = "portfolio-blog-read-slugs";

export function getReadSlugs() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markSlugAsRead(slug) {
  if (typeof window === "undefined") return;
  try {
    const set = getReadSlugs();
    if (set.has(slug)) return;
    set.add(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("blog-read-changed"));
  } catch {
    // ignore quota / private mode
  }
}
