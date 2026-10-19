"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ExperiencePreview.module.css";

const CARD_W = 232;
const CARD_H = 146;
const FOLLOW = 0.16;

const PreviewContext = createContext(null);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ExperienceLink({ href, src, label, children }) {
  const preview = useContext(PreviewContext);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(event) => preview.show({ src, label }, event.clientX, event.clientY)}
      onMouseMove={(event) => preview.move(event.clientX, event.clientY)}
      onMouseLeave={() => preview.hide()}
    >
      {children}
    </a>
  );
}

export default function ExperiencePreview({ children }) {
  const [item, setItem] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const origin = useRef("0% 100%");
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const openRef = useRef(false);
  const hideTimer = useRef(0);
  const reducedMotion = useRef(false);

  const place = useCallback((x, y) => {
    let left = x + 18;
    let top = y - CARD_H - 16;
    let originX = "0%";
    let originY = "100%";

    if (left + CARD_W > window.innerWidth - 12) {
      left = x - CARD_W - 18;
      originX = "100%";
    }
    if (top < 12) {
      top = y + 20;
      originY = "0%";
    }

    return { x: left, y: top, origin: `${originX} ${originY}` };
  }, []);

  const show = useCallback(
    (next, x, y) => {
      window.clearTimeout(hideTimer.current);
      const point = place(x, y);
      if (!openRef.current) {
        current.current = { x: point.x, y: point.y };
      }
      target.current = { x: point.x, y: point.y };
      origin.current = point.origin;
      reducedMotion.current = prefersReducedMotion();
      openRef.current = true;
      setLeaving(false);
      setItem(next);
    },
    [place],
  );

  const move = useCallback(
    (x, y) => {
      if (!openRef.current) return;
      const point = place(x, y);
      target.current = { x: point.x, y: point.y };
      origin.current = point.origin;
    },
    [place],
  );

  const hide = useCallback(() => {
    openRef.current = false;
    if (reducedMotion.current) {
      setItem(null);
      setLeaving(false);
      return;
    }
    setLeaving(true);
    hideTimer.current = window.setTimeout(() => {
      setItem(null);
      setLeaving(false);
    }, 150);
  }, []);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
    if (innerRef.current) innerRef.current.style.transformOrigin = origin.current;
  }, [item]);

  useEffect(() => {
    if (!item) return undefined;

    let frame = 0;
    const tick = () => {
      const amount = reducedMotion.current ? 1 : FOLLOW;
      current.current.x += (target.current.x - current.current.x) * amount;
      current.current.y += (target.current.y - current.current.y) * amount;
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      if (innerRef.current) innerRef.current.style.transformOrigin = origin.current;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [item]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  return (
    <PreviewContext.Provider value={{ show, move, hide }}>
      {children}
      {item ? (
        <div ref={cardRef} className={styles.card} aria-hidden="true">
          <div
            key={item.label}
            ref={innerRef}
            className={
              leaving
                ? `${styles.inner} ${styles.leave}`
                : reducedMotion.current
                  ? styles.inner
                  : `${styles.inner} ${styles.pop}`
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.image} src={item.src} alt="" />
          </div>
        </div>
      ) : null}
    </PreviewContext.Provider>
  );
}
