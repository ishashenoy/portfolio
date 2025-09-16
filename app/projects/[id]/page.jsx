"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";

export default function Home() {
    const projects = [
        {
            title: "MyMediaTracker",
            thumb_url: "https://private-user-images.githubusercontent.com/112519806/476156011-112ab1f0-fde9-4dff-95a3-a2a6272c0880.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc5MTY1NzUsIm5iZiI6MTc1NzkxNjI3NSwicGF0aCI6Ii8xMTI1MTk4MDYvNDc2MTU2MDExLTExMmFiMWYwLWZkZTktNGRmZi05NWEzLWEyYTYyNzJjMDg4MC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxNVQwNjA0MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNWRlNjMxNTQxNWE2ZWM3MDYxNjg0YzZlOGFhNzFlNWEyNThhYWU2MDdkZmRmYjU5MmNiN2EzMDY0ZDBlMmMxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.XJFBUxySsKEWnzVk-vVIqNpjqTDncOlQtR7ChrW_DQ8",
            link: "https://mymediatracker.vercel.app/",
            highlight: "600+ users",
            tech_feature: [
              "Secure authentication using **JWT + bcrypt** and **rate limiting for brute-force protection**.",
              "**Scalable NoSQL schema (MongoDB)** supporting social features (follow/unfollow).", 
              "**RESTful API backend (Node.js/Express)** with external API integration and **local caching** for performance.",
              "Responsive, mobile-first UI, deployed via Render + Vercel, with **Google reCAPTCHA** for bot prevention."
            ],
            overview: "Centralized Media Management Platform.",
            pics: ['https://files.catbox.moe/2zn5ov.png','https://files.catbox.moe/m9ixt4.png','https://files.catbox.moe/63fkk8.png'],
            design_process: ['https://files.catbox.moe/2zn5ov.png','https://files.catbox.moe/m9ixt4.png','https://files.catbox.moe/63fkk8.png'],
            tech: ['React', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
          },
        {
            title: "MyMediaTracker | App",
            thumb_url: "https://files.catbox.moe/vvdxg3.png",
            tech_feature: [
              "Cross-Platform App (iOS + Android) with React Native", "Secure Authentication – JWT tokens stored safely (SecureStore)",
            ],
            overview: "Centralized Media Management Platform (Mobile).",
            tech: ['React Native', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
        },
        {
            title: "Pomodoro Pals",
            thumb_url: "https://file.notion.so/f/f/cd5968b9-2ee7-47cc-9922-9a09715312c8/90b410d1-53b4-44d5-be94-724dc9a509bc/9ba08bc5-a0b8-4dd6-aafe-dd93318001ba.png?table=block&id=21b9b9a3-6e05-8063-ac49-db8eb2a87be0&spaceId=cd5968b9-2ee7-47cc-9922-9a09715312c8&expirationTimestamp=1757901600000&signature=h_RnoQQfxWfDxGbpgmjrJDRR-PkL907hedwQ4g665vQ&downloadName=image.png",
            link: "https://pomodoropals.vercel.app/",
            tech_feature: [
              "Data Persistence via Web Storage API (localStorage) to save tasks and timer state across sessions.", "Music Player Integration with Spotify.",
              "Optimized for desktop use."
            ],
            overview: "Customizable study hub.",
            tech: ['Javascript', 'HTML', 'CSS']
        },
        {
            title: "Match Me!",
            thumb_url: "https://private-user-images.githubusercontent.com/112519806/460913631-dd5c2e58-d62e-455f-b656-4bb1876b60af.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc5NDEyMTUsIm5iZiI6MTc1Nzk0MDkxNSwicGF0aCI6Ii8xMTI1MTk4MDYvNDYwOTEzNjMxLWRkNWMyZTU4LWQ2MmUtNDU1Zi1iNjU2LTRiYjE4NzZiNjBhZi5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkxNSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MTVUMTI1NTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MjFjYzI5OGVhNGVjMDc0ZWJmODU1ZTBiMGZiNjQzYjFlZDFkMGNkNzA2MTE0ZjMxYjRjYmE2NzI0ZDY2MGIzOCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.dxEjcx-gG9zsBbF7-zMb7Fc66zwwY06DzAxohQXI6Uw",
            link: "https://matchmegame.vercel.app/",
            tech_feature: [
              "Responsive Layout designed with Bootstrap grid system (mobile-friendly).", "Deployment on Vercel for live hosting."
            ],
            overview: "Cute memory card game where you flip cards, find pairs and unlock themes.",
            tech: ['Javascript', 'HTML', 'CSS', 'Bootstrap']
        }
    ]

    const params = useParams();
    const id = params.id;
    if (!id) return <p>Loading...</p>;
    const projectIndex = parseInt(id) - 1;
    const project = projects[projectIndex];

  return (
    <div className="flex min-h-screen p-5 justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-left container w-300 sm:w-125">
        <Image
          width={1000}
          height={100}
          src={project.thumb_url}
          alt=""
          className="thumbnail"
        />
        <div className="flex overflow-x-auto gap-3 overflow-y-scroll scrollbar-hidden">
        {project?.pics && project.pics.map((pic,i) => (
          <Image
            key={i}
            width={200}
            height={100}
            src={pic}
            alt=""
            className="thumbnail shrink"
          />
        ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {project?.link ? 
            <Link target="_blank" href={project.link} className='font-bold text-3xl sm:text-3xl'>{project.title}</Link> 
            :
            <p className='font-bold text-3xl sm:text-3xl'>{project.title}</p>
          }
          <p className="font-bold text-xl">{project?.highlight && project.highlight}</p>
          </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border-1 border-solid border-[#ebeae92b] p-3">
            <p className='font-bold section bg-[#E1E366]'>Overview</p>
            {project?.overview && <p className="pt-2">{project.overview}</p>}
          </div>
        <div className="rounded-md border-1 border-solid border-[#ebeae92b] p-3">
          <p className='font-bold section bg-[#EB649F]'>Technical Features</p>
          <ul className="list-disc gap-4 pt-2 pl-4">
          {project?.tech_feature && project.tech_feature.map((tech_feature) => (
            <li key={tech_feature} className="w-full">
                <ReactMarkdown>{tech_feature}</ReactMarkdown>
            </li>
          ))}
          </ul>
        </div>
        <div className='flex-wrap overflow-hidden gap-1 flex rounded-md border-1 border-solid border-[#ebeae92b] p-2'>
              {project?.tech && project.tech.map((tech) => (
                  <div key={tech} className="skill">
                      {tech}
                  </div>
              ))}
            </div>
        </div>
        <Link href="/" className='heading'>Back</Link>
      </div>
    </div>
  );
}
