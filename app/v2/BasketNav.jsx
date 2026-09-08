"use client";

import Image from "next/image";
import styles from "./v2.module.css";

function scrollToElement(element) {
  const offset = 24;
  const start = window.scrollY;
  const end = element.getBoundingClientRect().top + window.scrollY - offset;
  const distance = end - start;
  const duration = Math.min(1100, Math.max(650, Math.abs(distance) * 0.55));
  let startTime;

  function step(now) {
    if (!startTime) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, start + distance * eased);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function BasketNav({ items }) {
  function handleClick(event, href) {
    if (!href.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    scrollToElement(target);
    history.pushState(null, "", href);
  }

  return (
    <div className={styles.basketWrap}>
      <Image
        src="/images/image 32.png"
        alt=""
        width={867}
        height={564}
        className={styles.basket}
        priority
      />
      <nav className={styles.nav} aria-label="Primary">
        {items.map((item) => {
          const className = `${styles.word} ${styles[item.className]}`;
          return (
            <a
              key={item.label}
              className={className}
              href={item.href}
              onClick={(event) => handleClick(event, item.href)}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className={styles.wordFace}>
                <span className={styles.wordStroke} aria-hidden="true">
                  {item.label}
                </span>
                <span className={styles.wordFill}>{item.label}</span>
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
