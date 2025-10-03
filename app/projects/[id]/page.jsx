"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";

export default function Home() {
    const projects = [
        {
            title: "MyMediaTracker",
            thumb_url: "/images/thumb/mymediatracker.png",
            link: "https://mymediatracker.app/",
            highlight: "900+ users",
            tech_feature: [
              "Secure authentication using **JWT + bcrypt** and **rate limiting for brute-force protection**.",
              "**Scalable NoSQL schema (MongoDB)** supporting social features (follow/unfollow).", 
              "**RESTful API backend (Node.js/Express)** with external API integration and **local caching** for performance.",
              "Responsive, mobile-first UI, deployed via Render + Vercel, with **Google reCAPTCHA** for bot prevention."
            ],
            overview: "Track shows, movies, books, and games in one clean hub — with social features to share and discover media.",
            pics: ['https://files.catbox.moe/2zn5ov.png','https://files.catbox.moe/m9ixt4.png','https://files.catbox.moe/63fkk8.png'],
            design_process: ['https://files.catbox.moe/2zn5ov.png','https://files.catbox.moe/m9ixt4.png','https://files.catbox.moe/63fkk8.png'],
            tech: ['React', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
          },
        {
            title: "MyMediaTracker | App",
            thumb_url: "/images/thumb/mymediatracker-app.png",
            tech_feature: [
              "Cross-Platform App (iOS + Android) with React Native", "Secure Authentication – JWT tokens stored safely (SecureStore)",
            ],
            overview: "Centralized Media Management Platform (Mobile).",
            pics: ["/images/gallery/mymediatracker-app/4.jpg","/images/gallery/mymediatracker-app/3.jpg","/images/gallery/mymediatracker-app/2.jpg","/images/gallery/mymediatracker-app/1.jpg"],
            tech: ['React Native', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
        },
        {
            title: "Pomodoro Pals",
            thumb_url: "/images/thumb/pomodoropals.png",
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
            thumb_url: "/images/thumb/matchme.jpeg",
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
      <div className="flex flex-col gap-2 justify-center items-left container max-w-screen-md w-full">
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
          <p className='font-bold text-3xl sm:text-3xl'>{project.title}</p>
          <p className="font-bold text-xl">{project?.highlight && project.highlight}</p>
          </div>
        <div className='flex-wrap overflow-hidden gap-1 flex rounded-md border-1 border-solid border-[#ebeae92b] p-2'>
          {project?.tech && project.tech.map((tech) => (
              <div key={tech} className="skill">
                {tech}
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border-1 border-solid border-[#ebeae92b] p-3">
            <p className='font-bold section bg-[#E1E366]'>Overview</p>
            {project?.link && <Link target="_blank" href={project.link} className='font-bold pt-2'>Link</Link>}
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
        </div>
        <Link href="/" className='heading'>Back</Link>
      </div>
    </div>
  );
}
