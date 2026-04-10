"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { collageArt, collageGallery } from "../data/collageImages";

const allItems = [
  ...collageGallery.map((item) => ({ ...item, category: "gallery" })),
  ...collageArt.map((item) => ({ ...item, category: "art" })),
];

const EDGE_PADDING = 6;
const COLLISION_OVERLAP_ALLOWANCE = 24;
const CAPTION_BLOCK_HEIGHT = 26;

const CARD_SHADOW_CLASS = "shadow-[0.5px_1px_2px_rgba(20,18,15,0.1)]";
const CATEGORY_COLORS = {
  gallery: "#aab8e6",
  art: "#e8b1c4",
};

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
function packNonOverlapping(items, W, H, padding, collisionGap, random) {
  const placed = [];
  const positionsPct = {};
  const sorted = [...items].sort((a, b) => b.w * b.h - a.w * a.h);

  for (const item of sorted) {
    const w = item.w;
    const h = item.h;
    const maxX = W - w - padding;
    const maxY = H - h - padding;
    if (maxX < padding || maxY < padding) {
      return null;
    }

    let found = null;
    for (let attempt = 0; attempt < 450; attempt++) {
      const x = padding + random() * Math.max(0, maxX - padding);
      const topClusterMaxY = padding + (maxY - padding) * 0.7;
      const y = padding + random() * Math.max(0, topClusterMaxY - padding);
      const candidate = { x, y, w, h };
      if (!overlapsAny(candidate, placed, collisionGap)) {
        found = { x, y };
        placed.push({ x, y, w, h });
        break;
      }
    }

    if (!found) {
      const step = 6;
      outer: for (let y = padding; y <= maxY + 1e-6; y += step) {
        for (let x = padding; x <= maxX + 1e-6; x += step) {
          const candidate = { x, y, w, h };
          if (!overlapsAny(candidate, placed, collisionGap)) {
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
function packRowsFallback(items, W, padding) {
  let x = padding;
  let y = padding;
  let rowH = 0;
  const sorted = [...items].sort((a, b) => b.h - a.h);
  const pixelPos = [];
  const overlapStep = 16;

  for (const item of sorted) {
    if (x + item.w + padding > W) {
      x = padding;
      y += Math.max(24, rowH - overlapStep);
      rowH = 0;
    }
    pixelPos.push({ id: item.id, x, y, w: item.w, h: item.h });
    rowH = Math.max(rowH, item.h);
    x += Math.max(24, item.w - overlapStep);
  }

  const heightPx = y + rowH + padding;
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
  const itemsWithCaptionSpace = items.map((item) => ({
    ...item,
    h: item.h + CAPTION_BLOCK_HEIGHT,
  }));
  const W = Math.max(320, containerWidth);
  const minH =
    typeof window !== "undefined" ? Math.min(window.innerHeight * 0.18, 170) : 170;

  let H = minH;
  for (let grow = 0; grow < 40; grow++) {
    const rng = mulberry32(0x9e3779b9 + grow * 1315423911);
    const result = packNonOverlapping(
      itemsWithCaptionSpace,
      W,
      H,
      EDGE_PADDING,
      -COLLISION_OVERLAP_ALLOWANCE,
      rng
    );
    if (result) {
      return {
        positions: result.positionsPct,
        minHeightPx: Math.max(120, H),
      };
    }
    H += 72;
  }

  const fallback = packRowsFallback(itemsWithCaptionSpace, W, EDGE_PADDING);
  return {
    positions: fallback.positionsPct,
    minHeightPx: Math.max(120, fallback.heightPx + 8),
  };
}

export default function CollagePlayground() {
  const [filter, setFilter] = useState("all");
  const containerRef = useRef(null);
  const [positions, setPositions] = useState(null);
  const [containerMinHeight, setContainerMinHeight] = useState(null);
  const dragRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);

  const visibleItems = useMemo(() => {
    if (filter === "gallery") return allItems.filter((i) => i.category === "gallery");
    if (filter === "art") return allItems.filter((i) => i.category === "art");
    return allItems;
  }, [filter]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const run = () => {
      const w = el.getBoundingClientRect().width;
      if (w < 80) return;
      const { positions: next, minHeightPx } = computeLayout(allItems, w);
      setPositions(next);
      setContainerMinHeight(minHeightPx);
    };

    run();
    const ro = new ResizeObserver(() => run());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onPointerDown = useCallback(
    (e, item) => {
      if (!containerRef.current || !positions?.[item.id]) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = containerRef.current.getBoundingClientRect();
      const itemRect = e.currentTarget.getBoundingClientRect();
      const leftPx = itemRect.left - rect.left;
      const topPx = itemRect.top - rect.top;
      dragRef.current = {
        id: item.id,
        w: itemRect.width,
        h: itemRect.height,
        grabDx: e.clientX - rect.left - leftPx,
        grabDy: e.clientY - rect.top - topPx,
      };
      setDraggingId(item.id);
    },
    [positions]
  );

  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let leftPx = e.clientX - rect.left - d.grabDx;
      let topPx = e.clientY - rect.top - d.grabDy;
      const minX = EDGE_PADDING;
      const minY = EDGE_PADDING;
      const maxX = rect.width - d.w - EDGE_PADDING;
      const maxY = rect.height - d.h - EDGE_PADDING;
      leftPx = Math.max(minX, Math.min(leftPx, Math.max(minX, maxX)));
      topPx = Math.max(minY, Math.min(topPx, Math.max(minY, maxY)));
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
    <section className="relative mt-24 w-full bg-black" aria-label="Draggable gallery">
      <div className="border-t border-white/20 px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { key: "all", label: "All" },
            { key: "gallery", label: "Gallery" },
            { key: "art", label: "Art" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="inline-flex cursor-pointer select-none items-center gap-2 font-sans text-[15px] text-white"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={filter === key}
                onChange={() => setFilterExclusive(key)}
              />
              <span
                className="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border border-white bg-black"
                aria-hidden
              >
                {filter === key ? (
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{
                      backgroundColor:
                        key === "all" ? "#ffffff" : CATEGORY_COLORS[key],
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
          className="relative mx-auto mt-4 w-full min-h-[min(18vh,170px)]"
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
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: item.w,
                    height: item.h + CAPTION_BLOCK_HEIGHT,
                    zIndex: draggingId === item.id ? 1000 : 10 + (idx % 8),
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => onPointerDown(e, item)}
                >
                  <div
                    className={`relative w-full ${CARD_SHADOW_CLASS}`}
                    style={{ height: item.h }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.w}
                      height={item.h}
                      className="h-auto w-auto"
                      draggable={false}
                      sizes={`${item.w}px`}
                    />
                    <p className="mt-1 text-center text-[13px] font-light leading-tight text-white">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
