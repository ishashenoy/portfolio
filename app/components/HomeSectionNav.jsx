"use client";

import { useEffect, useState } from "react";

const SECTION_IDS = ["experience-heading", "projects-heading", "gallery-heading"];

function sectionAnchorActive(scrollLine) {
  let current = SECTION_IDS[0];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= scrollLine) current = id;
  }
  return current;
}

export default function HomeSectionNav({ links }) {
  const [activeId, setActiveId] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const offset = 96;

    const update = () => {
      setActiveId(sectionAnchorActive(window.scrollY + offset));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav className="flex flex-col items-end gap-10 text-right" aria-label="Page sections">
      {links.map((link) => {
        const anchorId = link.href.startsWith("#") ? link.href.slice(1) : null;
        const isActive = anchorId ? activeId === anchorId : false;

        return (
          <a
            key={link.href}
            href={link.href}
            className={`text-[36px] font-normal leading-none tracking-[-0.02em] transition ${
              isActive ? "text-[#262626]" : "text-[#8f8f8f] hover:text-[#5f5f5f]"
            }`}
          >
            {link.label.toLowerCase()}
          </a>
        );
      })}
    </nav>
  );
}
