"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ContextMenuCluster.module.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isTextInput(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.tagName === "TEXTAREA") return true;
  if (el.tagName !== "INPUT") return false;
  const t = el.type || "text";
  return ["text", "search", "url", "email", "password", "number", "tel"].includes(t);
}

/** Input/textarea (any) or contenteditable host — used to read selection. */
function getTextSurface(el) {
  if (!el || el.nodeType !== 1) return null;
  if (isTextInput(el) || el.tagName === "TEXTAREA") return el;
  return el.closest?.('[contenteditable="true"]') ?? null;
}

/** Where typing/paste/cut is allowed (not readonly/disabled). */
function getEditableSurface(el) {
  if (!el || el.nodeType !== 1) return null;
  if (isTextInput(el) || el.tagName === "TEXTAREA") {
    if (el.disabled || el.readOnly) return null;
    return el;
  }
  const ce = el.closest?.('[contenteditable="true"]');
  if (ce && ce.getAttribute("contenteditable") !== "false") return ce;
  return null;
}

function getSelectionSnapshot(surface) {
  if (surface && (isTextInput(surface) || surface.tagName === "TEXTAREA")) {
    const s = surface.selectionStart ?? 0;
    const e = surface.selectionEnd ?? 0;
    const text = surface.value.slice(s, e);
    return { text, hasSelection: s !== e };
  }
  if (surface?.isContentEditable) {
    const t = document.getSelection()?.toString() ?? "";
    return { text: t, hasSelection: t.length > 0 };
  }
  const t = document.getSelection()?.toString() ?? "";
  return { text: t, hasSelection: t.length > 0 };
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("aria-hidden", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function insertIntoField(field, text) {
  if (isTextInput(field) || field.tagName === "TEXTAREA") {
    const start = field.selectionStart ?? 0;
    const end = field.selectionEnd ?? 0;
    const val = field.value;
    field.value = val.slice(0, start) + text + val.slice(end);
    const pos = start + text.length;
    field.selectionStart = field.selectionEnd = pos;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
  if (field.isContentEditable) {
    field.focus();
    document.execCommand("insertText", false, text);
  }
}

function selectAllInField(field) {
  if (isTextInput(field) || field.tagName === "TEXTAREA") {
    field.focus();
    field.select();
    return;
  }
  if (field.isContentEditable) {
    field.focus();
    const range = document.createRange();
    range.selectNodeContents(field);
    const sel = document.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

function cutFromField(field) {
  field.focus();
  try {
    if (document.execCommand("cut")) return;
  } catch {
    /* fall through */
  }
  const snap = getSelectionSnapshot(field);
  if (!snap.hasSelection) return;
  void writeClipboard(snap.text);
  if (isTextInput(field) || field.tagName === "TEXTAREA") {
    const start = field.selectionStart ?? 0;
    const end = field.selectionEnd ?? 0;
    field.value = field.value.slice(0, start) + field.value.slice(end);
    field.selectionStart = field.selectionEnd = start;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (field.isContentEditable) {
    document.execCommand("delete");
  }
}

/** Minimum radius in px when geometry allows (before overlap-based growth). */
const RING_RADIUS = 72;

/** Tangential gap between pill edges on the ring (px). */
const RING_GAP = 12;

/**
 * Minimum ring radius so consecutive pill centers are far enough apart.
 * Uses chord length 2·r·sin(π/n) ≥ maxWidth + gap (worst case for wide labels).
 */
function computeMinRingRadius(n, maxW, maxH) {
  if (n <= 0) return RING_RADIUS;
  const w = Math.max(maxW, 0);
  const h = Math.max(maxH, 0);
  if (n === 1) {
    return Math.max(RING_RADIUS, Math.max(w, h) / 2 + RING_GAP);
  }
  const tangential = w + RING_GAP;
  const sinHalf = Math.sin(Math.PI / n);
  const rFromWidth = tangential / (2 * sinHalf);
  const radial = h + RING_GAP;
  const rFromHeight = radial / (2 * sinHalf);
  const rArc = (tangential * n) / (2 * Math.PI);
  return Math.ceil(Math.max(RING_RADIUS, rFromWidth, rFromHeight, rArc * 1.05));
}

/**
 * Evenly space items on a ring; first item at top (-90°).
 * @param {number} count
 * @param {number} [radius]
 * @returns {{ dx: number; dy: number }[]}
 */
function ringOffsets(count, radius = RING_RADIUS) {
  if (count <= 0) return [];
  if (count === 1) return [{ dx: 0, dy: -radius }];
  const out = [];
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    out.push({
      dx: Math.cos(angle) * radius,
      dy: Math.sin(angle) * radius,
    });
  }
  return out;
}

/** Keep ring + pill bounds inside the viewport (center = click). */
function getClampedPagePosition(pageX, pageY, ringRadiusUsed, maxW, maxH) {
  const margin = 12;
  const halfDiag = Math.hypot(maxW / 2, maxH / 2);
  const extent = ringRadiusUsed + halfDiag + 16;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  const minX = scrollX + margin + extent;
  const maxX = scrollX + vw - margin - extent;
  const minY = scrollY + margin + extent;
  const maxY = scrollY + vh - margin - extent;

  const safeX = minX <= maxX ? clamp(pageX, minX, maxX) : scrollX + vw / 2;
  const safeY = minY <= maxY ? clamp(pageY, minY, maxY) : scrollY + vh / 2;

  return { x: safeX, y: safeY };
}

/**
 * @param {MouseEvent} event
 * @returns {{ id: string, label: string, icon?: string, run: () => void }[]}
 */
function buildMenuItems(event) {
  const target = event.target;
  if (!(target instanceof Element)) return [];
  const textSurface = getTextSurface(target);
  const editSurface = getEditableSurface(target);
  const link = target?.closest?.("a[href]");
  const img = target?.closest?.("img[src]");

  const items = [];
  const push = (id, label, run, icon) => items.push({ id, label, run, icon });

  const { text: selectedText, hasSelection } = getSelectionSnapshot(textSurface);

  if (hasSelection && selectedText.length > 0) {
    push("copy", "Copy", () => void writeClipboard(selectedText), "📋");
    if (editSurface) {
      push("cut", "Cut", () => cutFromField(editSurface), "✂️");
    }
  }

  if (editSurface) {
    push("paste", "Paste", async () => {
      try {
        const t = await navigator.clipboard.readText();
        editSurface.focus();
        insertIntoField(editSurface, t);
      } catch {
        /* clipboard denied */
      }
    }, "📄");
    push("selectAll", "Select all", () => selectAllInField(editSurface), "▣");
  }

  if (link?.href) {
    const href = link.href;
    push("copyLink", "Copy link", () => void writeClipboard(href), "🔗");
    push(
      "openLink",
      "Open in new tab",
      () => window.open(href, "_blank", "noopener,noreferrer"),
      "↗"
    );
  }

  if (img) {
    const src = img.currentSrc || img.src;
    if (src) push("copyImageUrl", "Copy image address", () => void writeClipboard(src), "🖼");
  }

  if (items.length === 0) {
    push("copyUrl", "Copy page URL", () => void writeClipboard(window.location.href), "🔗");
    push("reload", "Reload", () => window.location.reload(), "↻");
  }

  return items;
}

export default function ContextMenuCluster() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState([]);
  const [ringRadius, setRingRadius] = useState(RING_RADIUS);
  const [measured, setMeasured] = useState(false);
  const rootRef = useRef(null);
  const anchorRef = useRef({ pageX: 0, pageY: 0 });

  const close = useCallback(() => {
    setOpen(false);
    setMeasured(false);
  }, []);

  const onContextMenu = useCallback((event) => {
    event.preventDefault();
    const nextItems = buildMenuItems(event);
    anchorRef.current = { pageX: event.pageX, pageY: event.pageY };
    setRingRadius(RING_RADIUS);
    setPos({ x: event.pageX, y: event.pageY });
    setItems(nextItems);
    setMeasured(false);
    setOpen(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || items.length === 0) {
      setMeasured(false);
      return;
    }

    if (!rootRef.current) return;

    let measureAttempts = 0;

    function applyMeasurements() {
      const el = rootRef.current;
      if (!el) return;

      const buttons = el.querySelectorAll("button");
      let maxW = 0;
      let maxH = 0;
      buttons.forEach((btn) => {
        const r = btn.getBoundingClientRect();
        maxW = Math.max(maxW, r.width);
        maxH = Math.max(maxH, r.height);
      });

      if (maxW === 0 && items.length > 0 && measureAttempts < 4) {
        measureAttempts += 1;
        requestAnimationFrame(applyMeasurements);
        return;
      }

      if (maxW === 0 && items.length > 0) {
        maxW = 120;
        maxH = 32;
      }

      const n = items.length;
      const rRing = computeMinRingRadius(n, maxW, maxH);
      const { pageX, pageY } = anchorRef.current;
      const nextPos = getClampedPagePosition(pageX, pageY, rRing, maxW, maxH);

      setRingRadius(rRing);
      setPos(nextPos);
      setMeasured(true);
    }

    applyMeasurements();
  }, [open, items]);

  useEffect(() => {
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [onContextMenu]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event) {
      if (rootRef.current?.contains(event.target)) return;
      close();
    }

    function onKeyDown(event) {
      if (event.key === "Escape") close();
    }

    function onScroll() {
      close();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("blur", close);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("blur", close);
    };
  }, [open, close]);

  function onItemClick(item) {
    try {
      item.run();
    } finally {
      close();
    }
  }

  const offsets = ringOffsets(items.length, ringRadius);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${open ? styles.open : ""} ${open && measured ? styles.revealed : ""}`}
      style={{ left: pos.x, top: pos.y }}
      aria-hidden={!open}
      id="site-context-menu-cluster"
      role="menu"
    >
      <div className={styles.ring}>
        {items.map((item, i) => {
          const { dx, dy } = offsets[i] ?? { dx: 0, dy: 0 };
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={styles.pill}
              style={{
                transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
              }}
              onClick={() => onItemClick(item)}
            >
              {item.icon ? (
                <span className={styles.pillIcon} aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
