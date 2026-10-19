"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import { footerPhotos } from "../data/collageImages";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const textButton = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  cursor: "pointer",
};

export default function PhotoViewer() {
  const [index, setIndex] = useState(0);
  const count = footerPhotos.length;
  const photo = footerPhotos[index];

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % count);
  }, [count]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <div
      className={roboto.className}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        letterSpacing: "-0.04em",
      }}
    >
      <div style={{ position: "relative", width: "min(92vw, 960px)", height: "min(68vh, 720px)" }}>
        <Image
          src={photo.src}
          alt={photo.caption || photo.alt}
          fill
          priority
          sizes="92vw"
          style={{ objectFit: "contain" }}
        />
      </div>
      {photo.caption ? <p style={{ margin: 0 }}>{photo.caption}</p> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button type="button" onClick={prev} style={textButton}>
          prev
        </button>
        <span>
          {index + 1} / {count}
        </span>
        <button type="button" onClick={next} style={textButton}>
          next
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 760 }}>
        {footerPhotos.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(itemIndex)}
            aria-label={item.caption || item.alt}
            aria-current={itemIndex === index ? "true" : undefined}
            style={{
              padding: 0,
              border: itemIndex === index ? "1px solid #14120f" : "1px solid transparent",
              background: "none",
              cursor: "pointer",
            }}
          >
            <Image
              src={item.src}
              alt=""
              width={72}
              height={72}
              style={{ display: "block", width: 72, height: 72, objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
