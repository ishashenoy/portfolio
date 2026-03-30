"use client";

import { useCallback, useState } from "react";
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

/** Inline emphasis for key facts (stats, affiliations) */
const hl =
  "rounded-sm bg-amber-100 px-1 py-0.5 font-semibold !text-neutral-900 [box-decoration-break:clone]";

const skills = {
  languages: ["python", "typescript", "javascript", "java", "html/CSS", "SQL", "VBA", "bash"],
  frameworks: ["react", "react native", "next.js", "node.js", "express", "nest.js", "flask", "tailwind", "bootstrap", "pytorch"],
  tools: ["git", "mongodb", "mysql", "postgresql", "supabase", "selenium", "postman", "figma", "aws", "vercel", "render", "linux", "powerbi", "excel"],
  concepts: ["REST APIs", "RAG", "OOP", "DSA", "SDLC", "unit testing", "scalability", "SEO", "agile", "UI/UX design", "responsive design"],
  libraries: ["mediapipe", "opencv", "numpy", "scikit-learn"],
};

export default function Page2() {
  const [galleryTab, setGalleryTab] = useState("gallery");
  const [galleryItems, setGalleryItems] = useState(() => [...galleryPhotos]);
  const [artItems, setArtItems] = useState(() => [...artPhotos]);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  const clearGalleryDrag = useCallback(() => {
    setDragFrom(null);
    setDragOver(null);
  }, []);

  const tabBtnClass = (active) =>
    [
      "inline bg-transparent border-0 p-0 m-0 font-inherit text-[15px] leading-normal cursor-pointer text-left transition-colors",
      active
        ? "font-bold text-neutral-950 border-b border-neutral-600 pb-px"
        : "font-normal text-neutral-500 hover:text-neutral-700",
    ].join(" ");

  const onDragStart = useCallback((e, index) => {
    setDragFrom(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.setData("application/gallery-index", String(index));
  }, []);

  const onDragEnd = useCallback(() => {
    setDragFrom(null);
    setDragOver(null);
  }, []);

  const onDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(index);
  }, []);

  const onDragLeave = useCallback((e) => {
    const rel = e.relatedTarget;
    if (rel instanceof Node && e.currentTarget.contains(rel)) return;
    setDragOver(null);
  }, []);

  const onDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    const raw =
      e.dataTransfer.getData("application/gallery-index") ||
      e.dataTransfer.getData("text/plain");
    const from = Number.parseInt(raw, 10);
    if (Number.isNaN(from) || from === dropIndex) {
      setDragFrom(null);
      setDragOver(null);
      return;
    }
    setGalleryItems((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(dropIndex, 0, removed);
      return next;
    });
    setDragFrom(null);
    setDragOver(null);
  }, []);

  const onArtDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    const raw =
      e.dataTransfer.getData("application/gallery-index") ||
      e.dataTransfer.getData("text/plain");
    const from = Number.parseInt(raw, 10);
    if (Number.isNaN(from) || from === dropIndex) {
      setDragFrom(null);
      setDragOver(null);
      return;
    }
    setArtItems((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(dropIndex, 0, removed);
      return next;
    });
    setDragFrom(null);
    setDragOver(null);
  }, []);

  const projectCards = projects.filter((p) => !p.compact);
  const compactProjectLine = projects.find((p) => p.compact);

  return (
    <div className="profile-redesign min-h-screen w-full bg-white font-sans text-[15px] leading-normal text-neutral-950">
      <main className="mx-auto w-full max-w-xl px-5 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center text-base sm:text-lg tracking-tight mb-3">
          <h1 className="font-semibold">isha shenoy</h1>
        </header>

        <div className="mt-3 text-center text-sm text-neutral-800 space-y-1">
          <p>
            <strong>
              management eng @ <span className={hl}>university of waterloo</span>
            </strong>{" "}
            seeking summer 2026 co-op
          </p>
          <p className="text-sm flex flex-row gap-2 justify-center items-center underline">
            <a href="mailto:ishenoy@uwaterloo.ca" target="_blank" rel="noopener noreferrer">email</a>
            <a href="https://github.com/ishashenoy" target="_blank" rel="noopener noreferrer">github</a>
            <a href="https://www.linkedin.com/in/ishashenoy/" target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href="https://mytria.app/profile/ichiberry" target="_blank" rel="noopener noreferrer">mytria</a>
            <a href="https://x.com/ichiberries" target="_blank" rel="noopener noreferrer">twitter</a>
            <a href="https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view" target="_blank" rel="noopener noreferrer">resume</a>
          </p>
        </div>

        <hr className="my-5 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-5 text-sm">
          <h2 className="font-bold">
            experience 
          </h2>
          <div className="mt-2 flex flex-nowrap items-center gap-x-1 text-sm">
            <span className="whitespace-nowrap font-semibold">founder & developer @</span>
            <span className="inline-flex items-center gap-0 whitespace-nowrap">
              <Image
                src="/images/icons/mytria.png"
                alt=""
                width={18}
                height={18}
                className="shrink-0 rounded-sm object-contain -translate-x-px"
              />
              <a
                href="https://mytria.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 whitespace-nowrap font-normal !text-blue-600 hover:underline"
              >
                mytria
              </a>
            </span>
          </div>
          <ul className="list-disc pl-5 text-neutral-700 text-sm mb-2">
            <li>
              <span className={hl}>15K+ users, 200K+ titles, 3M+ views</span> online.
            </li>
            <li>Designed and developed full-stack architecture for mobile / web app.</li>
            <li>Led product, growth, and user acquisition strategy.</li>
          </ul>
          <span className="flex flex-wrap gap-1 text-xs text-neutral-500"><span className="skill">React.js</span> <span className="skill">Node.js</span> <span className="skill">Express.js</span> <span className="skill">React Native</span> <span className="skill">MongoDB</span> <span className="skill">SEO</span></span>

          <div className="mt-2 flex flex-nowrap items-center gap-x-1 text-sm">
            <span className="whitespace-nowrap font-semibold">web developer @</span>
            <span className="inline-flex items-center gap-0 whitespace-nowrap">
              <Image
                src="/images/icons/grassroots-kw.png"
                alt=""
                width={18}
                height={18}
                className="shrink-0 rounded-sm object-contain -translate-x-px"
              />
              <a
                href="https://www.grassrootskw.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 whitespace-nowrap font-normal !text-blue-600 hover:underline"
              >
                grassroots kw
              </a>
            </span>
          </div>
          <ul className="list-disc pl-5 text-neutral-700 text-sm mb-2">
            <li>Funded by <span className={hl}>Bloomberg Philanthropies</span>.</li>
            <li>Developing a climate advocacy platform with TypeScript and Next.js.</li>
            <li>Implementing scraping pipeline (Playwright) for biweekly information refresh.</li>
          </ul>
          <span className="flex flex-wrap gap-1 text-xs text-neutral-500"><span className="skill">Automation</span> <span className="skill">Playwright</span> <span className="skill">TypeScript</span> <span className="skill">Next.js</span></span>
        </section>

        <hr className="my-5 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-4 text-sm">
          <h2 className="font-bold">projects</h2>
          <div className="mb-3 flex flex-col gap-4 text-neutral-700">
            {projectCards.map((project) => {
              const href = project.links?.demo ?? project.links?.github;
              const thumb = (
                <div className="relative aspect-square w-20 shrink-0 overflow-hidden sm:w-24">
                  <Image
                    src={project.thumb_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              );
              return (
                <div key={project.id} className="flex gap-3 items-center">
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
                  <div className="min-w-0 flex-1 text-sm text-neutral-700">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold !text-blue-600 hover:underline"
                      >
                        {project.title}
                      </a>
                    ) : (
                      <span className="font-semibold">{project.title}</span>
                    )}
                    {project.date ? (
                      <span className="font-normal text-neutral-500"> ({project.date})</span>
                    ) : null}
                    {" ... "}
                    {project.desc}
                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-neutral-500">
                      {project.tech.map((tech) => (
                        <span key={tech} className="skill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {compactProjectLine ? (
            <div className="text-xs leading-snug text-neutral-600 sm:text-[13px]">
              <p className="font-normal">
                <a
                  href={compactProjectLine.links?.pomodoro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-blue-600 hover:underline"
                >
                  Pomodoro Pals
                </a>
                ,{" "}
                <a
                  href={compactProjectLine.links?.matchme}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-blue-600 hover:underline"
                >
                  Match Me
                </a>{" "}
                ... small web apps built for fun
              </p>
              <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-neutral-500 sm:text-[11px]">
                {compactProjectLine.tech.map((tech) => (
                  <span key={tech} className="skill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <hr className="my-5 border-0 border-t border-dashed border-neutral-300" />

        <section className="mt-4 text-sm">
        <h2 className="font-bold mb-2">skills</h2>
          {Object.entries(skills).map(([group, items]) => (
            <p key={group} className="mb-1">
              <span className="font-bold">{group}</span>{" "}
              {items.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < items.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ))}
        </section>

        <hr className="my-5 border-0 border-t border-dashed border-neutral-300" />
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
            onClick={() => {
              setGalleryTab("gallery");
              clearGalleryDrag();
            }}
          >
            Gallery
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={galleryTab === "art"}
            id="gallery-tab-art"
            className={tabBtnClass(galleryTab === "art")}
            onClick={() => {
              setGalleryTab("art");
              clearGalleryDrag();
            }}
          >
            Art
          </button>
        </div>
        {galleryTab === "gallery" ? (
          <div
            role="tabpanel"
            aria-labelledby="gallery-tab-gallery"
            className="grid grid-cols-3 grid-rows-2 w-full gap-x-1.5 gap-y-2 sm:gap-x-2 sm:gap-y-3"
          >
            {galleryItems.map((photo, i) => (
              <div
                key={photo.src}
                draggable
                tabIndex={0}
                aria-grabbed={dragFrom === i}
                onDragStart={(e) => onDragStart(e, i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, i)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, i)}
                className={[
                  "flex min-w-0 flex-col outline-none transition-shadow",
                  "cursor-grab active:cursor-grabbing",
                  "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
                  dragFrom === i ? "opacity-60 scale-[0.98]" : "",
                  dragOver === i && dragFrom !== null && dragFrom !== i
                    ? "ring-2 ring-blue-400 ring-offset-2"
                    : "",
                ].join(" ")}
              >
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 touch-none select-none"
                  onClick={() => setExpandedPhoto(photo)}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    draggable={false}
                    fill
                    className="pointer-events-none object-cover"
                    sizes="(max-width: 36rem) 33vw, 240px"
                  />
                </div>
                {photo.caption ? (
                  <p className="mt-1 text-center text-[10px] leading-snug text-neutral-600 sm:text-[11px]">
                    {photo.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div
            role="tabpanel"
            aria-labelledby="gallery-tab-art"
            className="grid grid-cols-3 grid-rows-2 w-full gap-x-1.5 gap-y-2 sm:gap-x-2 sm:gap-y-3"
          >
            {artItems.map((photo, i) => (
              <div
                key={photo.src}
                draggable
                tabIndex={0}
                aria-grabbed={dragFrom === i}
                onDragStart={(e) => onDragStart(e, i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => onDragOver(e, i)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onArtDrop(e, i)}
                className={[
                  "flex min-w-0 flex-col outline-none transition-shadow",
                  "cursor-grab active:cursor-grabbing",
                  "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
                  dragFrom === i ? "opacity-60 scale-[0.98]" : "",
                  dragOver === i && dragFrom !== null && dragFrom !== i
                    ? "ring-2 ring-blue-400 ring-offset-2"
                    : "",
                ].join(" ")}
              >
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 touch-none select-none"
                  onClick={() => setExpandedPhoto(photo)}
                >
                  <Image
                    src={photo.src}
                    alt=""
                    draggable={false}
                    fill
                    className="pointer-events-none object-cover"
                    sizes="(max-width: 36rem) 33vw, 240px"
                  />
                </div>
                {photo.caption ? (
                  <p className="mt-1 text-center text-[10px] leading-snug text-neutral-600 sm:text-[11px]">
                    {photo.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
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
              className="absolute right-0 top-[-2.25rem] text-sm text-neutral-200 hover:text-white"
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
              <p className="mt-2 text-center text-xs text-neutral-200">{expandedPhoto.caption}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <MusicPlayer iconFill="#525252" />
    </div>
  );
}
