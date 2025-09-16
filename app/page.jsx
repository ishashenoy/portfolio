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
      thumb_url: "https://private-user-images.githubusercontent.com/112519806/476156011-112ab1f0-fde9-4dff-95a3-a2a6272c0880.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc5MTY1NzUsIm5iZiI6MTc1NzkxNjI3NSwicGF0aCI6Ii8xMTI1MTk4MDYvNDc2MTU2MDExLTExMmFiMWYwLWZkZTktNGRmZi05NWEzLWEyYTYyNzJjMDg4MC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxNVQwNjA0MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNWRlNjMxNTQxNWE2ZWM3MDYxNjg0YzZlOGFhNzFlNWEyNThhYWU2MDdkZmRmYjU5MmNiN2EzMDY0ZDBlMmMxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.XJFBUxySsKEWnzVk-vVIqNpjqTDncOlQtR7ChrW_DQ8"
    },
    {
      title: "MyMediaTracker | App",
      id: 2,
      thumb_url: "https://files.catbox.moe/vvdxg3.png"
    },
    {
      title: "Pomodoro Pals",
      id: 3,
      thumb_url: "https://file.notion.so/f/f/cd5968b9-2ee7-47cc-9922-9a09715312c8/90b410d1-53b4-44d5-be94-724dc9a509bc/9ba08bc5-a0b8-4dd6-aafe-dd93318001ba.png?table=block&id=21b9b9a3-6e05-8063-ac49-db8eb2a87be0&spaceId=cd5968b9-2ee7-47cc-9922-9a09715312c8&expirationTimestamp=1757901600000&signature=h_RnoQQfxWfDxGbpgmjrJDRR-PkL907hedwQ4g665vQ&downloadName=image.png"
    },
    {
      title: "Match Me!",
      id: 4,
      thumb_url: "https://private-user-images.githubusercontent.com/112519806/460913631-dd5c2e58-d62e-455f-b656-4bb1876b60af.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc5NDEyMTUsIm5iZiI6MTc1Nzk0MDkxNSwicGF0aCI6Ii8xMTI1MTk4MDYvNDYwOTEzNjMxLWRkNWMyZTU4LWQ2MmUtNDU1Zi1iNjU2LTRiYjE4NzZiNjBhZi5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkxNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MTVUMTI1NTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MjFjYzI5OGVhNGVjMDc0ZWJmODU1ZTBiMGZiNjQzYjFlZDFkMGNkNzA2MTE0ZjMxYjRjYmE2NzI0ZDY2MGIzOCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.dxEjcx-gG9zsBbF7-zMb7Fc66zwwY06DzAxohQXI6Uw"
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
