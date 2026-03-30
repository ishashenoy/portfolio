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
    title: "BookTok",
    id: 3,
    date: "2026",
    thumb_url: "/images/thumb/booktok.jpg",
    desc: "TikTok-style React Native app with an async pipeline that generates narrated book-preview videos from summaries and keywords using Gemini, ElevenLabs, FFmpeg, and Cloudinary, backed by MongoDB.",
    tech: ["React Native", "MongoDB", "Gemini", "ElevenLabs", "FFmpeg", "Cloudinary"],
    links: { demo: "https://devpost.com/software/booktok-3680je" },
  },
  {
    id: 4,
    compact: true,
    line: "Pomodoro Pals, Match Me ... small web apps built for fun",
    tech: ["javascript", "html", "css"],
    links: {
      pomodoro: "https://pomodoropals.vercel.app/",
      matchme: "https://playmatchme.vercel.app/",
    },
  },
];
