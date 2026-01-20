"use client";

import Image from "next/image";
import Link from "next/link";
import { BsLinkedin, BsGithub, BsEnvelopeFill } from "react-icons/bs";

export default function Home() {
  const skills = {
    Languages: ["Python", "Java", "JavaScript", "HTML", "CSS", "SQL", "VBA", "Bash"],
    Frameworks: ["React", "React Native", "Next.js", "Node.js", "Express", "Tailwind", "Bootstrap"],
    Tools: ["Git", "MongoDB", "Selenium", 'MySQL', "Postman", "Figma", "Excel"],
    Concepts: ["OOP", "DSA", "SEO", "UML", "UI/UX Design", "Agile", "REST APIs", "Responsive Design"]
  };

  const projects = [
    {
      title: "MyMediaTracker",
      id: 1,
      thumb_url: "/images/thumb/mymediatracker.png",
      desc: "Unified media-tracking platform for shows, movies, books, and games. Follow friends, share lists, and discover new media through recommendations.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      links: { demo: "https://mymediatracker.app/" }
    },
    {
      title: "MyMediaTracker | App",
      id: 2,
      thumb_url: "/images/thumb/mymediatracker-app.png",
      desc: "Mobile companion app for MyMediaTracker offering convenient media-tracking, push notifications, and sync with the web service.",
      tech: ["React Native"],
    },
    {
      title: "Pomodoro Pals",
      id: 3,
      thumb_url: "/images/thumb/pomodoropals.png",
      desc: "Customizable Pomodoro timer and task manager that persists sessions, supports music integration, and provides session analytics to improve focus.",
      tech: ["JavaScript", "HTML", "CSS"],
      links: { demo: "https://pomodoropals.vercel.app/" }
    },
    {
      title: "Match Me!",
      id: 4,
      thumb_url: "/images/thumb/matchme.jpeg",
      desc: "Responsive memory-card matching game with theme unlocks, local high-score persistence, and smooth animations for cross-platform play.",
      tech: ["JavaScript", "Bootstrap", "HTML", "CSS"],
      links: { demo: "https://playmatchme.vercel.app/" }
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4">
      {/* Sticky Nav */}
      <nav className="w-full max-w-3xl sticky top-0 z-20 backdrop-blur flex flex-row justify-between items-center py-3 mb-4 border-b">
        <span className="font-bold text-xl tracking-tight">isha shenoy</span>
        <div className="flex gap-4 text-sm">
          <a href="#about" className="hover:underline">about</a>
          <a href="#projects" className="hover:underline">projects</a>
          <a href="#experience" className="hover:underline">experience</a>
          <a href="#skills" className="hover:underline">skills</a>
          <Link href='https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view?usp=sharing' target="_blank" rel="noopener noreferrer" className='hover:underline skill'>resume</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-3xl flex flex-col items-center gap-2 mt-4 mb-8 text-center">
        <h1 className="font-bold text-4xl sm:text-6xl">isha shenoy</h1>
        <p className="text-lg sm:text-xl text-gray-700">engineering @ uwaterloo · full-stack developer · open to co-op</p>
        <div className="flex flex-row gap-4 justify-center mt-2">
          <Link href="mailto:ishenoy@uwaterloo.ca" target="_blank" rel="noopener noreferrer"><BsEnvelopeFill size={22} aria-hidden="true" /></Link>
          <Link href="https://www.linkedin.com/in/ishashenoy/" target="_blank" rel="noopener noreferrer"><BsLinkedin size={22} aria-hidden="true" /></Link>
          <Link href="https://github.com/ishashenoy" target="_blank" rel="noopener noreferrer"><BsGithub size={22} aria-hidden="true" /></Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-3xl flex flex-col gap-3 mb-8">
        <div className="flex gap-3 items-center container">
          <p className="text-gray-700 mt-1">Management engineering student at the University of Waterloo passionate about building scalable web and mobile apps, with a focus on user experience and automation. Seeking co-op opportunities in software engineering, data, or product roles.</p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full max-w-3xl flex flex-col gap-3 mb-8">
        <h2 className="heading">projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="relative flex flex-col rounded-lg shadow-sm p-4 h-full container">
              <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                <Image fill src={project.thumb_url} alt={project.title} className="object-cover" />
              </div>
              <div className="font-bold text-lg flex flex-row items-center gap-2">
                {project.title}
                {project.links?.demo && <Link href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-xs font-normal underline">demo</Link>}
              </div>
              <div className="text-gray-700 text-sm mb-2">{project.desc}</div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {project.tech.map((tech) => (
                  <span key={tech} className="skill">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="w-full max-w-3xl flex flex-col gap-3 mb-8">
        <h2 className="heading">experience</h2>
        <div className="flex flex-col gap-6 container">
          {/* Grassroots KW */}
          <div>
            <div className="font-bold text-base">Web Developer <span className="text-gray-500 font-normal">@ Grassroots KW</span></div>
            <div className="text-xs text-gray-500 mb-1">Sep 2025 – Present</div>
            <ul className="list-disc pl-5 text-gray-700 text-sm mb-1">
              <li>Developing a climate advocacy platform with <b>TypeScript</b> and <b>Next.js</b>.</li>
              <li>Implementing Node.js backend with scraping pipeline (<b>Selenium</b>) for biweekly information refresh.</li>
              <li>Received funding from Bloomberg and the City of Kitchener.</li>
            </ul>
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">Skills: <span className="skill">Selenium</span> <span className="skill">TypeScript</span> <span className="skill">Next.js</span></div>
          </div>
          {/* University of Waterloo */}

          </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full max-w-3xl flex flex-col gap-3 mb-8">
        <h2 className="heading">skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <div className="font-bold mb-1">{group}</div>
              <div className="flex flex-wrap gap-1 container">
                {items.map((item) => (
                  <span key={item} className="skill">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full max-w-3xl text-center text-xs text-gray-400 py-4 border-t border-[#ebeae9] mt-4">
        © {new Date().getFullYear()} isha shenoy · qoljee
      </footer>
    </div>
  );
}
