"use client";

import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { LuExternalLink } from "react-icons/lu";
import SketchBorder from "./SketchBorder";
import styles from "./v2.module.css";

const MOTION = "transform 620ms cubic-bezier(0.4, 0, 0.2, 1)";
const COMPACT_MQ = "(max-width: 800px)";

function isCompactViewport() {
  return typeof window !== "undefined" && window.matchMedia(COMPACT_MQ).matches;
}

function appleTransform(stage, apple, open) {
  if (!open || isCompactViewport()) return "none";

  const stageBox = stage.getBoundingClientRect();
  const appleBox = apple.getBoundingClientRect();
  const width = apple.offsetWidth || stageBox.width * 0.5;
  const scale = (stageBox.width * 0.26) / width;
  const scaledWidth = width * scale;
  const scaledHeight = appleBox.height * scale;
  const targetCenterX = stageBox.width - scaledWidth / 2;
  const targetTop = Math.max(0, (stageBox.height - scaledHeight) / 2);
  const currentCenterX = appleBox.left - stageBox.left + appleBox.width / 2;
  const currentTop = appleBox.top - stageBox.top;
  const dx = targetCenterX - currentCenterX;
  const dy = targetTop - currentTop;

  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}

const stickers = [
  {
    id: "hex",
    src: "/images/experience/capston.png",
    alt: "capston",
    className: "stickerHex",
    width: 143,
    height: 121,
  },
  {
    id: "oval",
    src: "/images/experience/grassroots.png",
    alt: "grassroots kw",
    className: "stickerOval",
    width: 101,
    height: 136,
  },
  {
    id: "flower",
    src: "/images/experience/munch.png",
    alt: "munch",
    className: "stickerFlower",
    width: 125,
    height: 115,
  },
  {
    id: "m",
    src: "/images/experience/mytria.png",
    alt: "mytria",
    className: "stickerM",
    width: 133,
    height: 125,
  },
];

function Mark({ children }) {
  return <strong className={styles.workMark}>{children}</strong>;
}

const details = {
  hex: {
    title: "capston",
    role: "Software Engineering Intern",
    dates: "May 2026 – Aug 2026",
    body: [
      <>
        Built and shipped <Mark>4+ AI products</Mark> for enterprise clients including large
        Canadian engineering and infrastructure firms.
      </>,
      "Worked across the stack, from frontend and backend development to AI features and deployment.",
    ],
    href: "https://capston.ca/",
    thumb: "https://www.capston.ca/opengraph-image.png?opengraph-image.0rkr00j4..vz3.png?dpl=dpl_BGfs81qHarGwqT9njfS13KmL7xTx",
  },
  oval: {
    title: "grassroots kw",
    role: "Web Developer",
    dates: "Sept 2025 – Present",
    body: [
      <>
        Building the web platform for Grassroots KW, a climate-advocacy initiative backed by{" "}
        <Mark>Bloomberg Philanthropies</Mark>.
      </>,
      <>
        Currently automating legislative and events data updates to reduce manual work by{" "}
        <Mark>~80%</Mark>.
      </>,
    ],
    href: "https://grassrootskw.org/",
    thumb: "/images/thumb/grassrootskw.png",
  },
  flower: {
    title: "munch",
    role: "Co-Founder",
    dates: "Jan 2026 – Present",
    body: ["Co-built Munch, a social recipe app, from prototype to MVP."],
    href: null,
    thumb: "/images/thumb/munch.jpg",
  },
  m: {
    title: "mytria",
    role: "Founder",
    dates: "Aug 2025 – Present",
    body: [
      <>
        A social entertainment-tracking platform with <Mark>15,000+ users</Mark> and{" "}
        <Mark>200,000+ titles</Mark>: with $0 spent on ads.
      </>,
      "Built the product end-to-end, from the UI to backend infrastructure and growth.",
    ],
    href: "https://mytria.app/",
    thumb: "/images/thumb/mymediatracker.png",
  },
};

function WorkDetails({ work }) {
  if (!work) return null;

  const paragraphs = Array.isArray(work.body) ? work.body : work.body ? [work.body] : [];
  const hasCopy = Boolean(work.thumb || work.role || work.dates || paragraphs.length || work.href);

  return (
    <div className={work.thumb || work.dates ? styles.workLayout : undefined}>
      {work.thumb || work.dates ? (
        <div className={styles.workMedia}>
          {work.thumb ? (
            <div className={styles.workThumb}>
              <Image
                src={work.thumb}
                alt=""
                fill
                sizes="(max-width: 560px) 70vw, 184px"
                className={styles.workThumbImage}
              />
            </div>
          ) : null}
          {work.dates ? <p className={styles.workDates}>{work.dates}</p> : null}
        </div>
      ) : null}
      <div className={styles.workCopy}>
        <h3 className={styles.aboutHeading}>
          {work.href ? (
            <a
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.workTitleLink}
            >
              {work.title}
              <LuExternalLink className={styles.workTitleIcon} aria-hidden="true" />
            </a>
          ) : (
            work.title
          )}
        </h3>
        {work.role ? <p className={styles.workRole}>{work.role}</p> : null}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.aboutBody}>
            {paragraph}
          </p>
        ))}
        {!hasCopy ? <div className={styles.workDetailSpacer} aria-hidden="true" /> : null}
      </div>
    </div>
  );
}

export default function ExperienceApple() {
  const [selected, setSelected] = useState(null);
  const detailsId = useId();
  const open = Boolean(selected);
  const work = selected ? details[selected] : null;
  const shownWorkRef = useRef(null);
  if (work) shownWorkRef.current = work;
  const shownWork = work ?? shownWorkRef.current;

  const stageRef = useRef(null);
  const appleRef = useRef(null);
  const canTweenRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

  function placeApple(isOpen, animate) {
    const stage = stageRef.current;
    const apple = appleRef.current;
    if (!stage || !apple) return;

    if (!animate) {
      apple.style.transition = "none";
      apple.style.transform = "none";
      void apple.offsetWidth;
      apple.style.transform = appleTransform(stage, apple, isOpen);
      return;
    }

    if (isOpen) {
      apple.style.transition = "none";
      apple.style.transform = "none";
      void apple.offsetWidth;
      apple.style.transition = MOTION;
      apple.style.transform = appleTransform(stage, apple, true);
      return;
    }

    apple.style.transition = MOTION;
    apple.style.transform = "none";
  }

  useLayoutEffect(() => {
    placeApple(open, canTweenRef.current);
    canTweenRef.current = true;
  }, [open]);

  useEffect(() => {
    function onResize() {
      placeApple(openRef.current, false);
    }

    const media = window.matchMedia(COMPACT_MQ);
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onResize);
    };
  }, []);

  useEffect(() => {
    if (!selected || !isCompactViewport()) return undefined;

    const node = document.getElementById(detailsId);
    const timer = window.setTimeout(() => {
      node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [selected, detailsId]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section
      className={`${styles.appleSection} ${open ? styles.appleSectionOpen : ""}`}
      id="work"
      aria-labelledby="experience-heading"
    >
      <div className={styles.appleStage} ref={stageRef}>
        <div className={styles.appleCluster}>
          <div className={styles.appleUnit} ref={appleRef}>
            <h2 id="experience-heading" className={`${styles.aboutHeading} ${styles.workHeading}`}>
              work
            </h2>
            <div className={styles.appleWrap}>
              <Image
                src="/images/experience/apple.png"
                alt=""
                width={644}
                height={644}
                className={styles.apple}
              />
              {stickers.map((sticker) => {
                const active = selected === sticker.id;

                return (
                  <button
                    key={sticker.id}
                    type="button"
                    className={`${styles.sticker} ${styles[sticker.className]} ${active ? styles.stickerSelected : ""}`}
                    aria-pressed={active}
                    aria-expanded={active}
                    aria-controls={detailsId}
                    onClick={() => setSelected((current) => (current === sticker.id ? null : sticker.id))}
                  >
                    <span className={styles.stickerFace}>
                      <Image
                        src={sticker.src}
                        alt={sticker.alt}
                        width={sticker.width}
                        height={sticker.height}
                        className={styles.stickerImage}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className={`${styles.aboutBody} ${styles.appleNote}`}>
            <span className={styles.clickHint}>(click on a sticker)</span>
            <span className={styles.tapHint}>(tap a sticker)</span>
          </p>
        </div>

        <div className={styles.workDetail} id={detailsId} aria-hidden={!open} aria-live="polite">
          {shownWork ? (
            <div className={`${styles.aboutCard} ${styles.workDetailCard}`}>
              <SketchBorder />
              <div className={styles.aboutCardInner}>
                <WorkDetails work={shownWork} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
