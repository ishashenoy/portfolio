"use client";

import Image from "next/image";
import Link from "next/link";
import { BsLinkedin, BsGithub, BsEnvelopeFill, BsTwitter } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import MusicPlayer from "../components/MusicPlayer";
import { projects } from "../data/projects";


export default function Home() {
  const [cursorTrail, setCursorTrail] = useState([]);
  const trailRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        opacity: 1
      };
      
      trailRef.current = [...trailRef.current, newTrail].slice(-15); // Keep last 15 points
      setCursorTrail([...trailRef.current]);
    };

    const animateTrail = () => {
      trailRef.current = trailRef.current.map((point, index) => ({
        ...point,
        opacity: point.opacity - 0.08
      })).filter(point => point.opacity > 0);
      
      setCursorTrail([...trailRef.current]);
      animationRef.current = requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  const skills = {
    Languages: ["Python", "TypeScript", "JavaScript", "Java", "HTML/CSS", "SQL", "VBA", "Bash"],
    Frameworks: ["React", "React Native", "Next.js", "Node.js", "Express", "Nest.js", "Flask", "Tailwind", "Bootstrap", "PyTorch"],
    Tools: ["Git", "MongoDB", "MySQL", "PostgreSQL", "Supabase", "Selenium", "Postman", "Figma", "AWS", "Vercel", "Render", "Linux", "PowerBI", "Excel"],
    Concepts: ["REST APIs", "RAG", "OOP", "DSA", "SDLC", "Unit Testing", "Scalability", "SEO", "Agile", "UI/UX Design", "UML", "Responsive Design"],
    Libraries: ["MediaPipe", "OpenCV", "NumPy", "scikit-learn"],
  };

  const galleryPhotos = [
    { src: "/images/gallery/photo1.jpg", caption: "happy 1 year grassrootskw!" },
    { src: "/images/gallery/photo2.jpg", caption: "w/ mayor of kitchener" },
    { src: "/images/gallery/photo3.jpg", caption: "golden gate bridge" },
    { src: "/images/gallery/photo4.jpg", caption: "outside yc headquarters" },
    { src: "/images/gallery/photo6.jpg", caption: "socratica symposium '26" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 overflow-hidden">
      {/* Cursor Trail Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {cursorTrail.map((point, index) => (
          <div
            key={point.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#ffffff] to-[#ffffff] rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              opacity: point.opacity,
              scale: point.opacity,
              filter: `blur(${(1 - point.opacity) * 2}px)`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-2xl flex flex-col sm:flex-row items-center text-left gap-6 mt-8 mb-6">
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100">
          <Image src="/images/profile_pic.png" alt="isha shenoy" width={128} height={128} className="object-cover w-full h-full" />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-3xl sm:text-4xl">isha shenoy</h1>
          <p className="text-sm sm:text-base text-gray-700">engineering @ uwaterloo</p>
          <div className="flex flex-row gap-4 mt-2 items-start">
            <Link href="mailto:ishenoy@uwaterloo.ca" target="_blank" rel="noopener noreferrer"><BsEnvelopeFill size={22} aria-hidden="true" /></Link>
            <Link href="https://www.linkedin.com/in/ishashenoy/" target="_blank" rel="noopener noreferrer"><BsLinkedin size={22} aria-hidden="true" /></Link>
            <Link href="https://github.com/ishashenoy" target="_blank" rel="noopener noreferrer"><BsGithub size={22} aria-hidden="true" /></Link>
            <Link href="https://mytria.app/profile/ichiberry" target="_blank" rel="noopener noreferrer"><Image src="/images/icons/mytria-white.png" alt="Mytria" width={22} height={22} /></Link>
            <Link href="https://x.com/ichiberries" target="_blank" rel="noopener noreferrer"><BsTwitter size={22} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-2xl flex flex-col gap-2 mb-6">
        <p className="text-gray-700 text-sm">↳ management engineering at <Image src="/images/icons/uwaterloo-crest.png" alt="University of Waterloo" width={16} height={16} className="inline-block" /> university of waterloo</p>
        <p className="text-gray-700 text-sm">↳ <a href="https://www.tiktok.com/@qoljee" target="_blank" rel="noopener noreferrer" className="hover:underline">6M+ content creator</a></p>
        <p className="text-gray-700 text-sm">↳ seeking summer 2026, winter 2027 co-op.</p>
      </section>

      <hr className="w-full max-w-2xl my-2 border-[#ebeae92b]"/>

      {/* Experience Section */}
      <section id="experience" className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <h2 className="heading">experience</h2>
        <div className="flex flex-col divide-y divide-[#ebeae92b]">
          {/* Mytria */}
          <div className="experience-entry pb-6">
            <div className="font-semibold text-sm flex items-center gap-2">
              Founder & Full-Stack Developer @<Image src="/images/icons/mytria.png" alt="Mytria" width={18} height={18} className="rounded-sm object-contain flex-shrink-0" /><span className="text-gray-500 font-normal">
              <a href="https://mytria.app/" target="_blank" rel="noopener noreferrer" className="hover:underline !text-blue-600">Mytria</a></span>
            </div>
            <div className="text-xs text-gray-500 mb-2 mt-0.5">Aug 2025 – Present</div>
            <ul className="experience-list list-disc pl-5 text-gray-700 text-sm mb-2">
              <li>15,000+ users and 200,000+ titles.</li>
              <li>Designed and developed full-stack architecture for mobile / web app (React, Node.js, MongoDB).</li>
              <li>Led product, growth, and user acquisition strategy.</li>
            </ul>
            <div className="flex flex-wrap gap-1 text-xs text-gray-500 mt-1">Skills: <span className="skill">REST APIs</span> <span className="skill">React.js</span> <span className="skill">Node.js</span> <span className="skill">Express.js</span> <span className="skill">React Native</span> <span className="skill">MongoDB</span> <span className="skill">SEO</span></div>
          </div>
          {/* Grassroots KW */}
          <div className="experience-entry pt-6">
            <div className="font-semibold text-sm flex items-center gap-2">
              Web Developer @<Image src="/images/icons/grassroots-kw.png" alt="Grassroots KW" width={18} height={18} className="rounded-sm object-contain flex-shrink-0" /><span className="text-gray-500 font-normal"><a href="https://www.grassrootskw.org/" target="_blank" rel="noopener noreferrer" className="hover:underline !text-blue-600">Grassroots KW</a></span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Sep 2025 – Present</div>
            <ul className="experience-list list-disc pl-5 text-gray-700 text-sm mb-1">
              <li>Funded by Bloomberg Philanthropies.</li>
              <li>Developing a climate advocacy platform with <b>TypeScript</b> and <b>Next.js</b>.</li>
              <li>Implementing Node.js backend with scraping pipeline (<b>Selenium</b>) for biweekly information refresh.</li>
            </ul>
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">Skills: <span className="skill">Automation</span> <span className="skill">Selenium</span> <span className="skill">TypeScript</span> <span className="skill">Next.js</span></div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <h2 className="heading">projects</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-2">
              <div className="relative w-full rounded overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image fill src={project.thumb_url} alt={project.title} className="object-cover" />
              </div>
              <div className="flex flex-col min-w-0 gap-1.5">
                <div className="flex flex-row items-center justify-between gap-2 mb-0.5">
                  <div className="font-semibold text-sm flex flex-row items-center gap-2">
                    {project.links?.demo
                      ? <Link href={project.links.demo} target="_blank" rel="noopener noreferrer">{project.title}</Link>
                      : project.links?.github
                      ? <Link href={project.links.github} target="_blank" rel="noopener noreferrer">{project.title}</Link>
                      : project.title}
                  </div>
                  {project.date && (
                    <span className="text-xs rounded-full px-2 py-0.5 flex-shrink-0" style={{ backgroundColor: 'white', color: '#09111f', fontWeight: '600' }}>{project.date}</span>
                  )}
                </div>
                <div className="flex flex-row gap-1 overflow-x-auto scrollbar-hidden">
                  {project.tech.map((tech) => (
                    <span key={tech} className="skill flex-shrink-0">{tech}</span>
                  ))}
                </div>
                <div className="text-gray-700 text-xs">{project.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <h2 className="heading">skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}>
              <div className="font-semibold text-sm mb-1">{group}</div>
              <div className="flex flex-wrap gap-1">
                {items.map((item) => (
                  <span key={item} className="skill">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <h2 className="heading">gallery</h2>
        <div className="overflow-hidden">
          <div className="flex flex-row gallery-row-0" style={{ width: 'max-content' }}>
            {[...galleryPhotos, ...galleryPhotos].map((photo, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col gap-1 mr-2" style={{ width: 'calc(130px * 4/3)' }}>
                <div className="relative rounded overflow-hidden" style={{ height: '110px', aspectRatio: '4/3' }}>
                  {photo?.src ? (
                    <Image fill src={photo.src} alt={photo.caption || `gallery photo ${i}`} className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#141c2e] border border-[#ebeae92b] rounded" />
                  )}
                </div>
                {photo?.caption && (
                  <p className="text-xs text-gray-500 text-center truncate">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <MusicPlayer />
      </section>

      <footer className="w-full max-w-2xl text-center text-xs text-gray-400 py-4 border-t border-[#ebeae9] mt-4">
        © {new Date().getFullYear()} isha shenoy · qoljee
      </footer>
    </div>
  );
}
