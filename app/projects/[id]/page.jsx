"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import { BsBoxArrowUpRight } from 'react-icons/bs';

export default function Home() {
    const projects = [
        {
            title: "MyMediaTracker",
            thumb_url: "/images/thumb/mymediatracker.png",
            link: "https://mymediatracker.app/",
            highlight: "1K+ users",
            tech_feature: [
              "Secure, token-based authentication using **JWT** with **bcrypt** password hashing; rate-limiting and CAPTCHA reduce brute-force risk.",
              "Scalable document model in **MongoDB** with indexes and query patterns designed for social features (follow/unfollow) and efficient feed generation.",
              "RESTful **Node.js + Express** API with external media API integration and local caching to improve latency and reduce upstream requests.",
            ],
            overview: "Unified media-tracking platform for shows, movies, books, and games — follow friends, share lists, and discover new media through social recommendations.",
            pics: ['https://files.catbox.moe/2zn5ov.png','https://files.catbox.moe/m9ixt4.png','https://files.catbox.moe/63fkk8.png'],
            tech: ['React', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
          },
        {
            title: "MyMediaTracker | App",
            thumb_url: "/images/thumb/mymediatracker-app.png",
            tech_feature: [
              "Cross-platform mobile app (iOS & Android) built with **React Native**, optimized for performance and low memory footprint.",
              "Secure authentication flow using **JWT** with tokens stored in **SecureStore**; supports offline state sync and token refresh handling.",
              // "Native integrations: push notifications, deep linking, and optimized image handling for mobile bandwidth savings."
            ],
            overview: "Mobile companion app for MyMediaTracker offering fast, offline-first media tracking, push notifications, and seamless sync with the web service.",
            pics: ["/images/gallery/mymediatracker-app/4.jpg","/images/gallery/mymediatracker-app/3.jpg","/images/gallery/mymediatracker-app/2.jpg","/images/gallery/mymediatracker-app/1.jpg"],
            tech: ['React Native', 'Javascript', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS']
        },
        {
            title: "Pomodoro Pals",
            thumb_url: "/images/thumb/pomodoropals.png",
            link: "https://pomodoropals.vercel.app/",
            tech_feature: [
              "Persistent task and timer state using **localStorage**.",
              "Spotify integration for background music and playback controls via the Web Playback SDK."            ],
            overview: "Customizable Pomodoro timer study space and task manager that persists sessions, supports music integration.",
            tech: ['Javascript', 'HTML', 'CSS']
        },
        {
            title: "Match Me!",
            thumb_url: "/images/thumb/matchme.jpeg",
            link: "https://matchmegame.vercel.app/",
            tech_feature: [
              "Responsive memory-card game built with vanilla **JavaScript** and **Bootstrap** for fluid layouts and accessible interactions.",
            ],
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
          <p className='flex flex-row font-bold text-3xl sm:text-3xl'>
            {project?.link &&
            <Link target="_blank" rel="noopener noreferrer" href={project.link} className='inline-flex items-center gap-2 font-bold'>
              <span>{project.title}</span>
              <BsBoxArrowUpRight size={20} aria-hidden="true" />
            </Link>}
          </p>
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
          {project?.overview && 
          <div className="rounded-md border-1 border-solid border-[#ebeae92b] p-3">
            <p className='font-bold section bg-[#E1E366]'>Overview</p>
            <p className="pt-2">{project.overview}</p>
          </div>
          }
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
