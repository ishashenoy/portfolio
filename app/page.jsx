"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import MusicPlayer from "./components/MusicPlayer";
import { projects } from "./data/projects";

const galleryPhotos = [
  { src: "/images/gallery/photo1.jpg", caption: "happy 1 year grassrootskw!" },
  { src: "/images/gallery/photo2.jpg", caption: "w/ mayor of kitchener" },
  { src: "/images/gallery/photo3.jpg", caption: "golden gate bridge" },
  { src: "/images/gallery/photo4.jpg", caption: "outside yc headquarters" },
  { src: "/images/gallery/photo5.png", caption: "demoing at akatos symposium" },
  { src: "/images/gallery/photo6.jpg", caption: "socratica symposium '26" },
];

const artPhotos = [
  { src: "/images/art/art1.jpg", caption: "watercolor painting" },
  { src: "/images/art/art2.jpg", caption: "anatomical study" },
  { src: "/images/art/art3.jpg", caption: "game environment" },
  { src: "/images/art/art4.jpg", caption: "object study" },
  { src: "/images/art/art5.jpg", caption: "3D model (low poly)" },
  { src: "/images/art/art6.jpg", caption: "photoshop artwork" },
];

/** Scatter layout: each index maps to desk position / rotation / stack order (updates when items reorder). */
const POLAROID_SLOTS = [
  { left: "0%", top: "2%", rotate: -11, z: 12 },
  { left: "24%", top: "0%", rotate: 6, z: 22 },
  { left: "50%", top: "6%", rotate: -5, z: 32 },
  { left: "4%", top: "44%", rotate: 8, z: 26 },
  { left: "32%", top: "48%", rotate: -7, z: 34 },
  { left: "54%", top: "36%", rotate: 5, z: 38 },
];

const DRAG_CLICK_PX = 6;

function PolaroidGalleryTray({ items, onPhotoClick, panelId, labelledBy }) {
  const [offsets, setOffsets] = useState(() => ({}));
  const [draggingSrc, setDraggingSrc] = useState(null);
  const dragSessionRef = useRef(null);
  const movedRef = useRef(false);

  const handlePointerDown = useCallback((e, photo) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const off = offsets[photo.src] ?? { x: 0, y: 0 };
    movedRef.current = false;
    dragSessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: off.x,
      origY: off.y,
      src: photo.src,
    };
    setDraggingSrc(photo.src);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [offsets]);

  const handlePointerMove = useCallback((e, photo) => {
    const d = dragSessionRef.current;
    if (!d || d.src !== photo.src) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.hypot(dx, dy) > DRAG_CLICK_PX) movedRef.current = true;
    setOffsets((prev) => ({
      ...prev,
      [photo.src]: { x: d.origX + dx, y: d.origY + dy },
    }));
  }, []);

  const releaseDrag = useCallback((e, photo, { openIfTap } = { openIfTap: false }) => {
    const d = dragSessionRef.current;
    if (!d || d.src !== photo.src) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (openIfTap && !movedRef.current) onPhotoClick(photo);
    dragSessionRef.current = null;
    setDraggingSrc(null);
  }, [onPhotoClick]);

  return (
    <div
      role="tabpanel"
      aria-labelledby={labelledBy}
      id={panelId}
      className="relative mx-auto mt-1 w-full overflow-visible"
    >
      <div
        className={[
          "relative isolate min-h-[min(24rem,88vw)] w-full rounded-xl px-2 py-8 sm:min-h-[26rem] sm:px-3 sm:py-9",
          "bg-gradient-to-br from-[#e8e4dc] via-[#ebe7e0] to-[#d9d4ca]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_0_0_1px_rgba(0,0,0,0.05)]",
          "ring-1 ring-black/[0.06]",
        ].join(" ")}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_50%_35%,transparent_0%,rgba(0,0,0,0.04)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.35] mix-blend-multiply [background-image:repeating-linear-gradient(90deg,transparent,transparent_1px,rgba(0,0,0,0.012)_1px,rgba(0,0,0,0.012)_2px),repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,0,0,0.012)_1px,rgba(0,0,0,0.012)_2px)]"
          aria-hidden
        />

        {items.map((photo, i) => {
          const slot = POLAROID_SLOTS[i] ?? POLAROID_SLOTS[POLAROID_SLOTS.length - 1];
          const off = offsets[photo.src] ?? { x: 0, y: 0 };
          const isDragging = draggingSrc === photo.src;
          return (
            <div
              key={photo.src}
              tabIndex={0}
              aria-grabbed={isDragging}
              onPointerDown={(e) => handlePointerDown(e, photo)}
              onPointerMove={(e) => handlePointerMove(e, photo)}
              onPointerUp={(e) => releaseDrag(e, photo, { openIfTap: true })}
              onPointerCancel={(e) => releaseDrag(e, photo, { openIfTap: false })}
              className={[
                "group/polaroid absolute w-[34%] max-w-[7.25rem] touch-none outline-none sm:w-[30%] sm:max-w-[8rem]",
                "cursor-grab transition-[opacity,z-index] duration-150 ease-out active:cursor-grabbing",
                "focus-visible:!z-[60] focus-visible:ring-2 focus-visible:ring-[#5c6658]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebe7e0]",
                "hover:!z-[55]",
                `z-[${slot.z}]`,
                isDragging ? "!z-[70] opacity-90" : "",
              ].join(" ")}
              style={{
                left: slot.left,
                top: slot.top,
                transform: `translate(${off.x}px, ${off.y}px)`,
              }}
            >
              <div
                className="origin-center"
                style={{ transform: `rotate(${slot.rotate}deg)` }}
              >
                <div
                  className={[
                    "origin-center transition-transform duration-200 ease-out will-change-transform",
                    "group-hover/polaroid:scale-[1.03]",
                    isDragging ? "scale-[0.98]" : "",
                  ].join(" ")}
                >
              <div
                className={[
                  "select-none rounded-[2px] bg-[#faf9f7] p-1.5 pb-2 shadow-[0_6px_14px_-4px_rgba(0,0,0,0.14),0_2px_5px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)]",
                  "ring-1 ring-white/90",
                ].join(" ")}
              >
                <div
                  className="relative aspect-square w-full overflow-hidden bg-neutral-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] touch-none select-none"
                >
                  <Image
                    src={photo.src}
                    alt=""
                    draggable={false}
                    fill
                    className="pointer-events-none object-cover saturate-[1.02] contrast-[1.02]"
                    sizes="(max-width: 640px) 34vw, 128px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.92]"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.06) 18%, transparent 42%, transparent 55%, rgba(0,0,0,0.05) 100%)",
                      mixBlendMode: "soft-light",
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.08) 100%)",
                    }}
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay [background-image:repeating-linear-gradient(-12deg,rgba(255,255,255,0.09)_0_1px,transparent_1px_3px)]"
                    aria-hidden
                  />
                </div>
                {photo.caption ? (
                  <p className="mx-auto mt-1.5 min-h-[1.85rem] max-w-[95%] text-center font-medium lowercase leading-snug tracking-tight text-neutral-500 [text-shadow:0_1px_0_rgba(255,255,255,0.9)] text-[10px] sm:text-[11px]">
                    {photo.caption}
                  </p>
                ) : null}
              </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] lowercase leading-normal text-neutral-400 sm:text-xs">
        drag to move · tap to enlarge
      </p>
    </div>
  );
}

/** Section titles */
const sectionHeading =
  "mb-2.5 text-base font-semibold lowercase tracking-tight text-[#5c6658]";

/** Soft highlight — dusty, no ring */
const hl =
  "rounded-sm bg-[#e8ebe4] px-1 py-0.5 font-normal !text-neutral-800 [box-decoration-break:clone]";

/** Org row */
const expOrgChip =
  "inline-flex h-7 max-w-full items-center gap-1.5 rounded-sm border border-[#c5cbbf]/80 bg-[#f4f5f3] pl-0.5 pr-2.5";
const expOrgIconTile =
  "flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white";
const expOrgLink =
  "whitespace-nowrap text-sm font-medium leading-none lowercase !text-neutral-800 no-underline decoration-neutral-400 underline-offset-[3px] transition-colors hover:!text-neutral-950 hover:underline";

/** Project row title */
const projTitleLink =
  "text-base font-medium lowercase !text-neutral-900 no-underline decoration-neutral-300 underline-offset-[3px] transition-colors hover:!text-neutral-950 hover:underline hover:decoration-neutral-400";

const projCompactLink =
  "text-[15px] font-medium lowercase !text-neutral-900 no-underline underline-offset-[3px] transition-colors hover:underline";

const skills = {
  languages: ["python", "typescript", "javascript", "java", "html/CSS", "SQL", "VBA", "bash"],
  frameworks: ["react", "react native", "next.js", "node.js", "express", "nest.js", "flask", "tailwind", "bootstrap", "pytorch"],
  tools: ["git", "mongodb", "mysql", "postgresql", "supabase", "selenium", "postman", "figma", "aws", "vercel", "render", "linux", "powerbi", "excel"],
  concepts: ["REST APIs", "RAG", "OOP", "DSA", "SDLC", "unit testing", "scalability", "SEO", "agile", "UI/UX design", "responsive design"],
  libraries: ["mediapipe", "opencv", "numpy", "scikit-learn"],
};

export default function Page2() {
  const [galleryTab, setGalleryTab] = useState("gallery");
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  const tabBtnClass = (active) =>
    [
      "inline border-0 bg-transparent p-0 m-0 cursor-pointer text-left font-inherit text-sm font-normal lowercase leading-normal transition-colors",
      active
        ? "border-b border-[#5c6658] pb-px font-semibold text-neutral-900"
        : "border-b border-transparent pb-px text-neutral-500 hover:text-neutral-700",
    ].join(" ");

  const projectCards = projects.filter((p) => !p.compact);
  const compactProjectLine = projects.find((p) => p.compact);

  return (
    <div className="profile-redesign min-h-screen w-full bg-white font-sans text-[15px] leading-[1.58] text-neutral-800 antialiased">
      <main className="mx-auto w-full max-w-2xl px-3 py-5 sm:px-4 sm:py-6">
        {/* Header */}
        <header className="mb-4 flex items-center gap-4 text-left">
          <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-2xl border-[6px] border-white bg-neutral-100 ring-1 ring-[#c5cbbf]/80 sm:h-28 sm:w-28">
            <Image
              src="/images/profile_pic.png"
              alt="isha shenoy"
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-[1.375rem] font-medium lowercase leading-[1.2] tracking-[-0.03em] text-neutral-900 sm:text-[1.625rem]">
              isha shenoy
            </h1>
            <p className="mt-1.5 flex flex-row flex-wrap items-center justify-start gap-x-3 gap-y-1 text-sm font-normal lowercase leading-normal text-neutral-600 underline decoration-neutral-300 underline-offset-[3px]">
              <a href="mailto:ishenoy@uwaterloo.ca" target="_blank" rel="noopener noreferrer">email</a>
              <a href="https://github.com/ishashenoy" target="_blank" rel="noopener noreferrer">github</a>
              <a href="https://www.linkedin.com/in/ishashenoy/" target="_blank" rel="noopener noreferrer">linkedin</a>
              <a href="https://mytria.app/profile/ichiberry" target="_blank" rel="noopener noreferrer">mytria</a>
              <a href="https://x.com/ichiberries" target="_blank" rel="noopener noreferrer">x</a>
              <a
                href="https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view"
                target="_blank"
                rel="noopener noreferrer"
                className={`${hl} underline hover:!text-neutral-900`}
              >
                resume
              </a>
            </p>
          </div>
        </header>

        <div className="mt-3 text-left">
          <p className="text-[15px] leading-relaxed text-neutral-700 lowercase">
            <span className="font-medium text-neutral-900">
              management eng @ <span className={hl}>university of waterloo</span>
            </span>
            <span className="text-neutral-500"> · </span>
            <span className="text-neutral-600">seeking summer 2026 co-op</span>
          </p>
        </div>

        <hr className="my-4 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-4">
          <h2 className={sectionHeading}>experience</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
            <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#dfe3db] bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src="/images/thumb/mymediatracker.png"
                  alt="MyMediaTracker"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 420px"
                />
              </div>
              <div className="flex flex-col gap-2.5 border-t border-neutral-100 p-3">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm lowercase leading-snug text-neutral-700">
                  <span className="font-medium text-neutral-800">founder @</span>
                  <span className={expOrgChip}>
                    <span className={expOrgIconTile} aria-hidden>
                      <Image
                        src="/images/icons/mytria.png"
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </span>
                    <a
                      href="https://mytria.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={expOrgLink}
                    >
                      mytria
                    </a>
                  </span>
                </div>
                <div>
                  <ul className="m-0 list-none space-y-2.5 p-0">
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-800 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>
                        <span className={hl}>15k+ users, 200k+ titles, 3m+ views</span> online.
                      </span>
                    </li>
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-600 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>full-stack mobile & web architecture end-to-end.</span>
                    </li>
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-600 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>product, growth, and user acquisition.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-dashed border-neutral-200 pt-3">
                  <span className="skill text-xs">React.js</span>
                  <span className="skill text-xs">Node.js</span>
                  <span className="skill text-xs">Express.js</span>
                  <span className="skill text-xs">React Native</span>
                  <span className="skill text-xs">MongoDB</span>
                  <span className="skill text-xs">SEO</span>
                </div>
              </div>
            </article>

            <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#dfe3db] bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src="/images/thumb/grassrootskw.png"
                  alt="Grassroots KW"
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 420px"
                />
              </div>
              <div className="flex flex-col gap-2.5 border-t border-neutral-100 p-3">
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm lowercase leading-snug text-neutral-700">
                  <span className="font-medium text-neutral-800">web developer @</span>
                  <span className={expOrgChip}>
                    <span className={expOrgIconTile} aria-hidden>
                      <Image
                        src="/images/icons/grassroots-kw.png"
                        alt=""
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </span>
                    <a
                      href="https://www.grassrootskw.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={expOrgLink}
                    >
                      grassroots kw
                    </a>
                  </span>
                </div>
                <div>
                  <ul className="m-0 list-none space-y-2.5 p-0">
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-800 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>
                        funded by <span className={hl}>bloomberg philanthropies</span>.
                      </span>
                    </li>
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-600 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>climate advocacy platform in typescript & next.js.</span>
                    </li>
                    <li className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-600 lowercase">
                      <span className="w-2 shrink-0 text-center text-[#6b7568]" aria-hidden>
                        ·
                      </span>
                      <span>playwright pipeline for biweekly data refresh.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-dashed border-neutral-200 pt-3">
                  <span className="skill text-xs">Automation</span>
                  <span className="skill text-xs">Playwright</span>
                  <span className="skill text-xs">TypeScript</span>
                  <span className="skill text-xs">Next.js</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <hr className="my-4 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-4">
          <h2 className={sectionHeading}>projects</h2>
          <ul className="m-0 list-none divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-0">
            {projectCards.map((project) => {
              const href = project.links?.demo ?? project.links?.github;
              const thumb = (
                <div className="relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:w-20">
                  <Image
                    src={project.thumb_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover/row:scale-105"
                    sizes="(max-width: 640px) 72px, 80px"
                  />
                </div>
              );
              return (
                <li
                  key={project.id}
                  className="group/row flex gap-3 px-3 py-3 sm:gap-3.5 sm:px-3.5 sm:py-3.5"
                >
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      {thumb}
                    </a>
                  ) : (
                    thumb
                  )}
                  <div className="min-w-0 flex-1 lowercase">
                    <div className="leading-snug">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={projTitleLink}
                        >
                          {project.title}
                        </a>
                      ) : (
                        <span className="text-base font-medium text-neutral-900">{project.title}</span>
                      )}
                      {project.date ? (
                        <span className="text-sm font-normal tabular-nums text-neutral-400">
                          {" "}
                          · {project.date}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
                      {project.desc}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-dashed border-neutral-200/90 pt-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="skill text-xs font-normal">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {compactProjectLine ? (
            <div className="mt-3 rounded-lg border border-neutral-200/70 bg-neutral-50/50 px-3 py-2.5 text-[15px] leading-relaxed text-neutral-600 lowercase">
              <p>
                <a
                  href={compactProjectLine.links?.pomodoro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={projCompactLink}
                >
                  pomodoro pals
                </a>
                ,{" "}
                <a
                  href={compactProjectLine.links?.matchme}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={projCompactLink}
                >
                  match me
                </a>{" "}
                — small web apps built for fun
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 border-t border-dashed border-neutral-200/80 pt-2">
                {compactProjectLine.tech.map((tech) => (
                  <span key={tech} className="skill text-xs font-normal">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <hr className="my-4 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-4">
          <h2 className={sectionHeading}>skills</h2>
          {Object.entries(skills).map(([group, items]) => (
            <p
              key={group}
              className="mb-2.5 text-[15px] leading-relaxed text-neutral-700 last:mb-0 lowercase"
            >
              <span className="font-medium text-neutral-900">{group}</span>
              <span className="text-neutral-400"> — </span>
              {items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < items.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ))}
        </section>

        <hr className="my-4 border-0 border-t border-dashed border-neutral-300" />
        <div
          className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1"
          role="tablist"
          aria-label="Gallery sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={galleryTab === "gallery"}
            id="gallery-tab-gallery"
            className={tabBtnClass(galleryTab === "gallery")}
            onClick={() => setGalleryTab("gallery")}
          >
            gallery
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={galleryTab === "art"}
            id="gallery-tab-art"
            className={tabBtnClass(galleryTab === "art")}
            onClick={() => setGalleryTab("art")}
          >
            art
          </button>
        </div>
        {galleryTab === "gallery" ? (
          <PolaroidGalleryTray
            items={galleryPhotos}
            onPhotoClick={setExpandedPhoto}
            panelId="gallery-panel-photos"
            labelledBy="gallery-tab-gallery"
          />
        ) : (
          <PolaroidGalleryTray
            items={artPhotos}
            onPhotoClick={setExpandedPhoto}
            panelId="gallery-panel-art"
            labelledBy="gallery-tab-art"
          />
        )}
      </main>

      {expandedPhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setExpandedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image"
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setExpandedPhoto(null)}
              className="absolute right-0 top-[-2.25rem] text-sm font-medium tracking-wide text-neutral-300 hover:text-white"
            >
              close
            </button>
            <div className="relative w-full overflow-hidden bg-neutral-900">
              <Image
                src={expandedPhoto.src}
                alt={expandedPhoto.caption || "Expanded image"}
                width={1600}
                height={1200}
                className="h-auto max-h-[80vh] w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            {expandedPhoto.caption ? (
              <p className="mt-3 text-center text-sm leading-relaxed text-neutral-300">{expandedPhoto.caption}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <MusicPlayer iconFill="#5c6658" />
    </div>
  );
}
