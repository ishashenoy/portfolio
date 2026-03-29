export const projects = [
  {
    title: "AlphaHedge",
    id: 1,
    date: "2026",
    thumb_url: "/images/thumb/alphahedge.png",
    desc: (
      <>
        AI-powered investment research platform that simulates institutional-grade equity analysis in under two minutes using parallel analyst agents, built during the{" "}
        <a
          href="https://events.ycombinator.com/fullstackhackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-blue-600"
        >
          Y Combinator Full-Stack Hackathon
        </a>
        .
      </>
    ),
    tech: ["TypeScript", "Supabase", "Google Gemini", "Sim.ai", "RAG"],
    links: { github: "https://github.com/ishashenoy/AlphaHedge" },
  },
  {
    title: "SignWave",
    id: 2,
    date: "2026",
    thumb_url: "/images/thumb/signwave.png",
    desc: "Real-time computer vision rhythm game that uses a custom-trained PyTorch neural network and MediaPipe hand tracking to turn live hand gestures into interactive gameplay.",
    tech: ["Python", "Flask", "PyTorch", "OpenCV", "MediaPipe", "NumPy"],
    links: { github: "https://github.com/ishashenoy/SignWave" },
  },
  {
    title: "Pomodoro Pals",
    id: 3,
    date: "2025",
    thumb_url: "/images/thumb/pomodoropals.png",
    desc: "Customizable Pomodoro timer and task manager that persists sessions, supports music integration, and provides session analytics to improve focus.",
    tech: ["JavaScript", "HTML", "CSS"],
    links: { demo: "https://pomodoropals.vercel.app/" },
  },
  {
    title: "Match Me!",
    id: 4,
    date: "2025",
    thumb_url: "/images/thumb/matchme.jpeg",
    desc: "Responsive memory-card matching game with theme unlocks, local high-score persistence, and smooth animations for cross-platform play.",
    tech: ["JavaScript", "Bootstrap", "HTML", "CSS"],
    links: { demo: "https://playmatchme.vercel.app/" },
  },
];
