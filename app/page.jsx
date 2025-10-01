"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const skills = [
    "Python",
    "Java",
    "JavaScript",
    "Git",
    "Node.js",
    "React",
    "React Native",
    "Next.js",
    "Selenium",
    "MongoDB",
    "Express",
    "Tailwind",
    "HTML",
    "Bootstrap",
    "CSS",
    "Excel"
  ];

  const projects = [
    {
      title: "MyMediaTracker",
      id: 1,
      thumb_url: "/images/thumb/mymediatracker.png"
    },
    {
      title: "MyMediaTracker | App",
      id: 2,
      thumb_url: "/images/thumb/mymediatracker-app.png",
    },
    {
      title: "Pomodoro Pals",
      id: 3,
      thumb_url: "/images/thumb/pomodoropals.png"
    },
    {
      title: "Match Me!",
      id: 4,
      thumb_url: "/images/thumb/matchme.jpeg",
    }
  ]

  return (
    <div className="flex min-h-screen p-5 justify-center items-center">
      
      <div className="relative flex flex-col gap-3 justify-center items-center">
        <p className='font-bold text-4xl sm:text-7xl'>isha shenoy</p>
        <div className='flex gap-3 justify-center'>
          <button onClick={()=> {setShowAbout(!showAbout); setShowProjects(false)}} className='cursor-pointer section bg-[#EB649F] hover:-rotate-5' >About</button>
          <button onClick={()=> {setShowProjects(!showProjects); setShowAbout(false)}} className='cursor-pointer section bg-[#E1E366] hover:-rotate-5' >Projects</button>
          <Link href='/IshaShenoy_Resume_Online.pdf' target="_blank" rel="noopener noreferrer" className='section bg-[#EEE0E0] hover:-rotate-5'>Resume</Link>
        </div>
        { showAbout && 
          <div className="overflow-auto md:w-150 gap-3 flex flex-col">
          <div className='flex flex-col gap-2 container'>
            <div className='heading'>Education</div>
            <div className='gap-3 flex'>
                <Image
                    width={50}
                    height={50}
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/University_of_Waterloo_seal.svg/1200px-University_of_Waterloo_seal.svg.png"
                    alt=""
                />
                <div>
                    <p className="paragraph">2025-2030 | University of Waterloo</p>
                    <p>Bachelor's of Applied Science in Management Engineering</p>
                </div>
            </div>
            </div>
            <div className='flex flex-col gap-2 container'>
            <div className='heading'>Skills</div>
                <div className='flex-wrap overflow-hidden gap-1 flex'>
                    {skills.map((skill) => (
                        <div key={skill} className="skill">
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        }
        { showProjects && 
          <div>
            <div className='flex md:w-150 flex-col gap-3 container' >
              <div className='heading'>Projects</div>
                <div className='flex flex-wrap gap-3'>
                    {projects.map((project) => (
                      <div key={project.id} className="relative flex-1 h-32 w-50 min-w-[150px]">
                        <Link href={"/projects/"+project.id} className="project">
                            <Image
                              fill
                              src={project.thumb_url}
                              alt=""
                              className="thumbnail"
                            />
                            <p className="absolute bottom-1 left-1 bg-black/50 px-1 rounded text-sm">{project.title}</p>
                        </Link>
                      </div>
                    ))}
                </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
