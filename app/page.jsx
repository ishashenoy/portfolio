import Image from "next/image";
import Link from "next/link";
import { MdDescription, MdEmail } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import CollagePlayground from "./components/CollagePlayground";
import HomeSectionNav from "./components/HomeSectionNav";
import { experience } from "./data/experience";
import { projects } from "./data/projects";

const EMAIL = "ishenoy@uwaterloo.ca";
const RESUME_URL =
  "https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view";
const MYTRIA_URL = "https://mytria.app/profile/ichiberry";

const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ishashenoy/", Icon: SiLinkedin },
  { label: "GitHub", href: "https://github.com/ishashenoy", Icon: SiGithub },
  { label: "X", href: "https://x.com/ichiberries", Icon: SiX },
];

export default function Home() {
  const mainProjects = projects.filter((p) => !p.compact);
  const compact = projects.find((p) => p.compact);
  const sidebarLinks = [
    { label: "Experience", href: "#experience-heading" },
    { label: "Projects", href: "#projects-heading" },
    { label: "Gallery", href: "#gallery-heading" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="mx-auto flex w-full max-w-[1600px] gap-10 px-5 sm:px-8">
        <main className="min-w-0 flex-1">
          <header className="mb-14">
            <h1 className="w-fit text-left text-[clamp(2.25rem,12.5vw,7rem)] font-bold uppercase leading-[0.92] tracking-tight text-[var(--fg)]">
              isha shenoy
            </h1>
            <div className="mt-3 flex w-fit flex-wrap items-center gap-x-4 gap-y-3 text-[15px] font-semibold text-[var(--muted)]">
              <div className="inline-flex items-center gap-2">
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#eeeeee] px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#e4e4e4]"
                >
                  <MdEmail className="h-4 w-4 shrink-0" aria-hidden />
                  Email
                </a>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#eeeeee] px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-[#e4e4e4]"
                >
                  <MdDescription className="h-4 w-4 shrink-0" aria-hidden />
                  Resume
                </a>
              </div>
              <nav className="inline-flex flex-wrap items-center gap-4" aria-label="Social">
                {social.map((s) => {
                  const Icon = s.Icon;
                  return (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-[#1a1a1a] transition hover:text-[#8ea0d8]"
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </a>
                  );
                })}
                <a
                  href={MYTRIA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mytria"
                  className="text-[#1a1a1a] transition hover:text-[#8ea0d8]"
                >
                  <Image
                    src="/images/icons/mytria.png"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </a>
              </nav>
            </div>
          </header>

          <div className="w-full">
            <div className="mb-14">
              <p className="text-lg leading-relaxed tracking-tight text-[var(--muted)]">
                engineering @{" "}
                <span className="bg-[#ff1493] px-1 text-white">university of waterloo</span>{" "}
                🪿
              </p>
              <p className="mt-5 text-lg leading-relaxed tracking-tight text-[var(--muted)]">
                web dev, mobile dev, ai, ml, systems, product
              </p>
              <p className="mt-5 text-lg leading-relaxed tracking-tight text-[var(--muted)]">
                i love people, love to talk, love to learn.{" "}
                <span className="bg-[#ff1493] px-1 text-white">let&apos;s chat!</span>
              </p>
            </div>

        <section aria-labelledby="experience-heading" className="mb-24">
          <h2
            id="experience-heading"
            className="mb-8 w-fit text-left text-[2rem] font-semibold lowercase leading-none tracking-tight text-[var(--fg)]"
          >
            experience
          </h2>
          <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {experience.map((job, index) => {
              return (
                <li key={job.id} className="min-w-0">
                  <article className="group">
                    {job.link ? (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-2xl bg-[#eceae6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label={`${job.title} (opens in a new tab)`}
                      >
                        <div className="relative aspect-[16/10] w-full">
                          {job.thumb_url ? (
                            <Image
                              src={job.thumb_url}
                              alt={`${job.title} preview`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover transition duration-200 group-hover:scale-[1.01]"
                              priority={index === 0}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold tracking-tight text-[var(--muted)]">
                              {job.initials}
                            </div>
                          )}
                        </div>
                      </a>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-[1.85rem] font-semibold lowercase leading-none tracking-tight text-[var(--fg)]">
                        {job.title}
                      </div>
                      {job.link ? (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${job.title} website`}
                          className="shrink-0 text-[#1a1a1a] transition hover:text-[var(--link)]"
                        >
                          <LuExternalLink className="h-6 w-6" aria-hidden />
                        </a>
                      ) : null}
                    </div>

                    <p className="mt-2 text-[16px] capitalize text-[var(--muted)]">{job.role}</p>
                    <p className="mt-1 text-[clamp(1.05rem,1.9vw,1.35rem)] leading-[1.25] tracking-tight text-[var(--muted)]">
                      {job.summary}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="projects-heading">
          <h2
            id="projects-heading"
            className="mb-8 w-fit text-left text-[2rem] font-semibold lowercase leading-none tracking-tight text-[var(--fg)]"
          >
            projects
          </h2>
          <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {mainProjects.map((project, index) => {
              const href =
                project.links?.github ?? project.links?.demo ?? project.links?.link ?? null;
              const ExternalIcon = project.links?.github ? SiGithub : LuExternalLink;
              return (
                <li key={project.id} className="min-w-0">
                  <article className="group">
                    <Link
                      href={`/projects/${project.id}`}
                      className="block overflow-hidden rounded-2xl bg-[#eceae6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                      aria-label={`${project.title} case study`}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={project.thumb_url}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition duration-200 group-hover:scale-[1.01]"
                          priority={index === 0}
                        />
                      </div>
                    </Link>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-[1.85rem] font-semibold lowercase leading-none tracking-tight text-[var(--fg)] transition hover:text-[var(--link)]"
                      >
                        {project.title}
                      </Link>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} external link`}
                          className="shrink-0 text-[#1a1a1a] transition hover:text-[var(--link)]"
                        >
                          <ExternalIcon className="h-6 w-6" aria-hidden />
                        </a>
                      ) : null}
                    </div>

                    {project.date ? (
                      <p className="mt-2 text-[16px] capitalize text-[var(--muted)]">{project.date}</p>
                    ) : null}
                    <div className="mt-1 text-[clamp(1.05rem,1.9vw,1.35rem)] leading-[1.25] tracking-tight text-[var(--muted)]">
                      {project.desc}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-[var(--border)] bg-white/50 px-2 py-0.5 text-xs text-[var(--fg)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {compact?.links ? (
            <p className="mt-16 text-[15px] leading-relaxed text-[var(--muted)]">
              Also:{" "}
              <a
                href={compact.links.pomodoro}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--link)] hover:underline"
              >
                Pomodoro Pals
              </a>
              ,{" "}
              <a
                href={compact.links.matchme}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--link)] hover:underline"
              >
                Match Me
              </a>
              {" — "}
              small web experiments.
            </p>
          ) : null}
        </section>
          </div>
        </main>

        <aside className="sticky top-16 hidden h-fit w-[235px] shrink-0 px-6 py-8 lg:block">
          <HomeSectionNav links={sidebarLinks} />
        </aside>
      </div>

      <section id="gallery-heading">
      <CollagePlayground />
      </section>

      <div className="w-full px-5 sm:px-8">
        <footer className="mt-6 border-t border-[var(--border)] pt-8 text-[13px] text-[var(--muted)]">
          <p>© {new Date().getFullYear()} isha shenoy</p>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" aria-label="Previous member">
              ←
            </button>
            <a
              href="https://www.uwaterloo.network"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit uwaterloo.network"
            >
              <img
                alt="UWaterloo Webring"
                src="https://www.uwaterloo.network/icon.svg"
                className="h-8 w-8"
              />
            </a>
            <button type="button" aria-label="Next member">
              →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
