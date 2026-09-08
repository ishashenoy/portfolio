import Image from "next/image";
import Link from "next/link";
import { projects } from "../data/projects";
import styles from "./v2.module.css";

const FEATURED = ["AlphaHedge", "SignWave", "BookTok"];

const BLURBS = {
  AlphaHedge:
    "AI-powered investment research platform that simulates institutional-grade equity analysis in under two minutes using parallel analyst agents, built at the Y Combinator Full-Stack Hackathon.",
};

function projectHref(project) {
  if (project.detail) return `/projects/${project.id}`;
  return project.links?.github ?? project.links?.demo ?? project.links?.link ?? null;
}

export default function ProjectsSection() {
  const items = FEATURED.map((title) => projects.find((project) => project.title === title)).filter(Boolean);

  return (
    <section className={styles.projectsSection} id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className={styles.aboutHeading}>
        projects
      </h2>
      <div className={styles.projectGrid}>
        {items.map((project) => {
          const href = projectHref(project);
          const description =
            BLURBS[project.title] ?? (typeof project.desc === "string" ? project.desc : "");
          const body = (
            <>
              <div className={styles.itemThumb}>
                {project.thumb_url ? (
                  <Image
                    src={project.thumb_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, 22vw"
                    className={styles.itemImage}
                  />
                ) : null}
              </div>
              {description ? <p className={styles.projectDesc}>{description}</p> : null}
            </>
          );

          if (!href) {
            return (
              <article key={project.id} className={styles.projectCard}>
                {body}
              </article>
            );
          }

          const external = href.startsWith("http");

          if (external) {
            return (
              <a
                key={project.id}
                className={styles.projectCard}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {body}
              </a>
            );
          }

          return (
            <Link key={project.id} className={styles.projectCard} href={href}>
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
