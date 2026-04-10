import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { projects } from "../../data/projects";

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = projects.find((p) => String(p.id) === String(id) && !p.compact);

  if (!project?.detail) {
    notFound();
  }

  const primaryLink = project.links?.github ?? project.links?.demo ?? project.links?.link;

  return (
    <div className="min-h-screen px-5 py-12 sm:px-8">
      <div className="w-full">
        <Link
          href="/"
          className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--fg)]"
        >
          ← Back
        </Link>

        <div className="mt-10 overflow-hidden rounded-lg border border-[var(--border)] bg-white/40">
          <div className="relative aspect-[16/10] w-full bg-[#eceae6]">
            <Image
              src={project.thumb_url}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1536px) 90vw, 1400px"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {primaryLink ? (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-2xl font-semibold text-[var(--fg)] hover:text-[var(--link)]"
              >
                <span>{project.title}</span>
                <BsBoxArrowUpRight size={22} aria-hidden className="opacity-70" />
              </a>
            ) : (
              <h1 className="text-2xl font-semibold text-[var(--fg)]">{project.title}</h1>
            )}
            {project.date ? (
              <p className="mt-1 text-sm tabular-nums text-[var(--muted)]">{project.date}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-[var(--border)] bg-white/50 px-2 py-0.5 text-xs text-[var(--fg)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Overview
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--fg)]">{project.detail.overview}</p>
          </section>

          <section>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Technical notes
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--fg)]">
              {project.detail.tech_feature.map((line, i) => (
                <li key={i}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {line}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
