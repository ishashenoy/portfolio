"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { collageArt, collageGallery } from "../data/collageImages";

const allItems = [
  ...collageGallery.map((item) => ({ ...item, category: "gallery" })),
  ...collageArt.map((item) => ({ ...item, category: "art" })),
];

const GAP = 12;

/** Space reserved under each image for the caption (layout + drag bounds). */
const CAPTION_BAND = 48;

const CARD_SHADOW_CLASS = "shadow-[0.5px_1px_2px_rgba(20,18,15,0.1)]";
const CATEGORY_COLORS = {
  gallery: "#aab8e6",
  art: "#e8b1c4",
};

function itemsWithLayoutHeight(items) {
  return items.map((item) => ({ ...item, h: item.h + CAPTION_BAND }));
}

/** True if axis-aligned rects overlap, counting g px minimum gap between edges. */
function overlapWithGap(a, b, g) {
  return !(
    a.x + a.w + g <= b.x ||
    b.x + b.w + g <= a.x ||
    a.y + a.h + g <= b.y ||
    b.y + b.h + g <= a.y
  );
}

function overlapsAny(candidate, placed, gap) {
  return placed.some((p) => overlapWithGap(candidate, p, gap));
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Scatter items without overlap: try random placement (seeded), then top-left scan.
 * Returns { positionsPct, heightPx } or null if H too small.
 */
function packNonOverlapping(items, W, H, gap, random) {
  const placed = [];
  const positionsPct = {};
  const sorted = [...items].sort((a, b) => b.w * b.h - a.w * a.h);

  for (const item of sorted) {
    const w = item.w;
    const h = item.h;
    const maxX = W - w - gap;
    const maxY = H - h - gap;
    if (maxX < gap || maxY < gap) {
      return null;
    }

    let found = null;
    for (let attempt = 0; attempt < 450; attempt++) {
      const x = gap + random() * (maxX - gap);
      const y = gap + random() * (maxY - gap);
      const candidate = { x, y, w, h };
      if (!overlapsAny(candidate, placed, gap)) {
        found = { x, y };
        placed.push({ x, y, w, h });
        break;
      }
    }

    if (!found) {
      const step = 6;
      outer: for (let y = gap; y <= maxY + 1e-6; y += step) {
        for (let x = gap; x <= maxX + 1e-6; x += step) {
          const candidate = { x, y, w, h };
          if (!overlapsAny(candidate, placed, gap)) {
            found = { x, y };
            placed.push({ x, y, w, h });
            break outer;
          }
        }
      }
    }

    if (!found) {
      return null;
    }

    positionsPct[item.id] = { x: (found.x / W) * 100, y: (found.y / H) * 100 };
  }

  return { positionsPct };
}

/** Guaranteed fit: simple rows (used if random packing cannot fit). */
function packRowsFallback(items, W, gap) {
  let x = gap;
  let y = gap;
  let rowH = 0;
  const sorted = [...items].sort((a, b) => b.h - a.h);
  const pixelPos = [];

  for (const item of sorted) {
    if (x + item.w + gap > W) {
      x = gap;
      y += rowH + gap;
      rowH = 0;
    }
    pixelPos.push({ id: item.id, x, y, w: item.w, h: item.h });
    rowH = Math.max(rowH, item.h);
    x += item.w + gap;
  }

  const heightPx = y + rowH + gap;
  const positionsPct = {};
  for (const p of pixelPos) {
    positionsPct[p.id] = {
      x: (p.x / W) * 100,
      y: (p.y / heightPx) * 100,
    };
  }
  return { positionsPct, heightPx };
}

function computeLayout(items, containerWidth) {
  const layoutItems = itemsWithLayoutHeight(items);
  const W = Math.max(320, containerWidth);
  const minH =
    typeof window !== "undefined" ? Math.min(window.innerHeight * 0.72, 600) : 600;

  let H = minH;
  for (let grow = 0; grow < 40; grow++) {
    const rng = mulberry32(0x9e3779b9 + grow * 1315423911);
    const result = packNonOverlapping(layoutItems, W, H, GAP, rng);
    if (result) {
      return {
        positions: result.positionsPct,
        minHeightPx: Math.max(400, H),
      };
    }
    H += 72;
  }

  const fallback = packRowsFallback(layoutItems, W, GAP);
  return {
    positions: fallback.positionsPct,
    minHeightPx: Math.max(400, fallback.heightPx + 8),
  };
}

export default function CollagePlayground() {
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);
  const [positions, setPositions] = useState(null);
  const [containerMinHeight, setContainerMinHeight] = useState(null);
  const [imageSizes, setImageSizes] = useState({});
  const dragRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const visibleItems = useMemo(() => {
    if (filter === "gallery") return allItems.filter((i) => i.category === "gallery");
    if (filter === "art") return allItems.filter((i) => i.category === "art");
    return allItems;
  }, [filter]);

  const sizedItems = useMemo(
    () =>
      allItems.map((item) => {
        const measured = imageSizes[item.id];
        if (!measured) return item;
        return { ...item, w: measured.w, h: measured.h };
      }),
    [imageSizes]
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const run = () => {
      const w = el.getBoundingClientRect().width;
      if (w < 80) return;
      const { positions: next, minHeightPx } = computeLayout(sizedItems, w);
      setPositions(next);
      setContainerMinHeight(minHeightPx);
    };

    run();
    const ro = new ResizeObserver(() => run());
    ro.observe(el);
    return () => ro.disconnect();
  }, [sizedItems]);

  const onPointerDown = useCallback(
    (e, item) => {
      if (!containerRef.current || !positions?.[item.id]) return;
      const measured = imageSizes[item.id];
      const itemW = measured?.w ?? item.w;
      const itemH = measured?.h ?? item.h;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = containerRef.current.getBoundingClientRect();
      const leftPx = (positions[item.id].x / 100) * rect.width;
      const topPx = (positions[item.id].y / 100) * rect.height;
      dragRef.current = {
        id: item.id,
        w: itemW,
        h: itemH + CAPTION_BAND,
        grabDx: e.clientX - rect.left - leftPx,
        grabDy: e.clientY - rect.top - topPx,
      };
      setDraggingId(item.id);
    },
    [imageSizes, positions]
  );

  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let leftPx = e.clientX - rect.left - d.grabDx;
      let topPx = e.clientY - rect.top - d.grabDy;
      leftPx = Math.max(0, Math.min(leftPx, rect.width - d.w));
      topPx = Math.max(0, Math.min(topPx, rect.height - d.h));
      const x = (leftPx / rect.width) * 100;
      const y = (topPx / rect.height) * 100;
      setPositions((prev) => (prev ? { ...prev, [d.id]: { x, y } } : prev));
    };

    const onUp = () => {
      dragRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const setFilterExclusive = (key) => {
    setFilter(key);
  };

  return (
    <section className="relative mt-24 w-full bg-white" aria-label="Draggable gallery">
      <div className="border-t border-[rgba(20,18,15,0.08)] px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { key: "all", label: "All" },
            { key: "gallery", label: "Gallery" },
            { key: "art", label: "Art" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="inline-flex cursor-pointer select-none items-center gap-2 font-sans text-[15px] text-[#14120f]"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={filter === key}
                onChange={() => setFilterExclusive(key)}
              />
              <span
                className="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border border-[#14120f] bg-white"
                aria-hidden
              >
                {filter === key ? (
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{
                      backgroundColor:
                        key === "all" ? "#14120f" : CATEGORY_COLORS[key],
                    }}
                  />
                ) : null}
              </span>
              {label}
            </label>
          ))}
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto mt-10 w-full min-h-[min(72vh,600px)]"
          style={
            containerMinHeight != null
              ? {
                  minHeight: containerMinHeight,
                }
              : undefined
          }
        >
          {positions &&
            visibleItems.map((item, idx) => {
              const pos = positions[item.id];
              if (!pos) return null;
              const measured = imageSizes[item.id];
              const displayW = measured?.w ?? item.w;
              const displayH = measured?.h ?? item.h;
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: displayW,
                    height: displayH + CAPTION_BAND,
                    zIndex: draggingId === item.id ? 1000 : 10 + (idx % 8),
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => onPointerDown(e, item)}
                >
                  <div
                    className={`relative w-full ${CARD_SHADOW_CLASS}`}
                    style={{ height: displayH }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={displayW}
                      height={displayH}
                      className="h-auto w-auto"
                      draggable={false}
                      sizes={`${displayW}px`}
                      onLoad={(e) => {
                        const target = e.target;
                        if (!(target instanceof HTMLImageElement)) return;
                        const naturalW = target.naturalWidth;
                        const naturalH = target.naturalHeight;
                        if (!naturalW || !naturalH) return;
                        setImageSizes((prev) => {
                          const existing = prev[item.id];
                          if (existing?.w === naturalW && existing?.h === naturalH) return prev;
                          return { ...prev, [item.id]: { w: naturalW, h: naturalH } };
                        });
                      }}
                    />
                  </div>
                  <div className="mt-2 flex w-full shrink-0 justify-center">
                    <div className="inline-flex max-w-full items-center gap-1.5 rounded-none bg-white/80 px-1.5 py-0.5 backdrop-blur-[2px]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                        aria-hidden
                      />
                      <p className="line-clamp-2 text-left text-[14px] font-medium leading-snug tracking-tight text-[#5c5854]">
                        {item.caption ?? item.alt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
