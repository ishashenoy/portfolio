"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { experience } from "../data/experience";
import { projects } from "../data/projects";
import styles from "./v2.module.css";

const FILTERS = [
  { id: "work", label: "work" },
  { id: "personal", label: "personal project" },
  { id: "hackathon", label: "hackathon" },
];

const EXPERIENCE_BLURBS = {
  mytria: "Built and scaled a consumer entertainment tracker platform to 15k+ users, 200k+ titles, and 3m+ views.",
  "grassroots-kw":
    "Bloomberg Philanthropies-funded climate advocacy platform with Next.js and automated data refresh workflows.",
  capston: "Employee #3. Building and shipping AI workflow systems end-to-end.",
};

const PROJECT_BLURBS = {
  1: "AI-powered investment research platform that simulates institutional-grade equity analysis in under two minutes using parallel analyst agents.",
};

const PROJECT_CATEGORY = {
  1: "hackathon",
  2: "personal",
  3: "hackathon",
};

function projectHref(project) {
  if (project.detail) return `/projects/${project.id}`;
  return project.links?.github ?? project.links?.demo ?? project.links?.link ?? null;
}

function buildItems() {
  const jobs = experience.map((job) => ({
    id: `work-${job.id}`,
    category: "work",
    title: job.title,
    description: EXPERIENCE_BLURBS[job.id] ?? (typeof job.summary === "string" ? job.summary.trim() : ""),
    thumb: job.thumb_url,
    href: job.link ?? null,
    external: Boolean(job.link),
  }));

  const mainProjects = projects
    .filter((project) => !project.compact)
    .map((project) => ({
      id: `project-${project.id}`,
      category: PROJECT_CATEGORY[project.id] ?? "personal",
      title: project.title,
      description:
        PROJECT_BLURBS[project.id] ?? (typeof project.desc === "string" ? project.desc : ""),
      thumb: project.thumb_url,
      href: projectHref(project),
      external: Boolean(projectHref(project)?.startsWith("http")),
    }));

  const compact = projects.find((project) => project.compact);
  const extras = compact
    ? [
        {
          id: "project-pomodoro",
          category: "personal",
          title: "Pomodoro Pals",
          description: "A small web app for timed focus sessions with a friend.",
          thumb: "/images/thumb/pomodoropals.png",
          href: compact.links?.pomodoro ?? null,
          external: true,
        },
        {
          id: "project-matchme",
          category: "personal",
          title: "Match Me",
          description: "A small matching-game web experiment.",
          thumb: "/images/thumb/matchme.jpeg",
          href: compact.links?.matchme ?? null,
          external: true,
        },
      ]
    : [];

  return [...jobs, ...mainProjects, ...extras];
}

const ITEMS = buildItems();

function WorkItem({ item }) {
  const body = (
    <>
      <div className={styles.itemThumb}>
        {item.thumb ? (
          <Image
            src={item.thumb}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 42vw"
            className={styles.itemImage}
          />
        ) : null}
      </div>
      <div className={styles.itemCopy}>
        <div className={styles.itemTitleRow}>
          <span className={styles.itemDot} aria-hidden="true" />
          <h3 className={styles.itemTitle}>{item.title}</h3>
        </div>
        <p className={styles.itemDesc}>{item.description}</p>
      </div>
    </>
  );

  const className = styles.item;
  const dataCategory = item.category;

  if (!item.href) {
    return (
      <article className={className} data-category={dataCategory}>
        {body}
      </article>
    );
  }

  if (item.external) {
    return (
      <a
        className={className}
        data-category={dataCategory}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className={className} data-category={dataCategory} href={item.href}>
      {body}
    </Link>
  );
}

export default function WorkList() {
  const [active, setActive] = useState(null);

  const visible = useMemo(
    () => (active ? ITEMS.filter((item) => item.category === active) : ITEMS),
    [active],
  );

  return (
    <section className={styles.workSection} id="work" aria-labelledby="work-heading">
      <h2 id="work-heading" className={styles.srOnly}>
        work
      </h2>
      <div className={styles.filters} role="toolbar" aria-label="Filter by type">
        {FILTERS.map((filter) => {
          const pressed = active === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              className={styles.filter}
              data-category={filter.id}
              aria-pressed={pressed}
              onClick={() => setActive((current) => (current === filter.id ? null : filter.id))}
            >
              <span className={styles.filterDot} aria-hidden="true" />
              {filter.label}
            </button>
          );
        })}
      </div>
      <div className={styles.itemList}>
        {visible.map((item) => (
          <WorkItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
