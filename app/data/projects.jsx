/** Local thumbnails in /public/images/thumb — use simple filenames (no spaces) for reliable next/image URLs. */
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
          className="bg-[var(--accent)] px-1 text-[var(--accent-fg)] underline underline-offset-2 hover:opacity-90"
        >
          Y Combinator Full-Stack Hackathon
        </a>
        .
      </>
    ),
    tech: ["TypeScript", "Supabase", "Google Gemini", "Sim.ai", "RAG"],
    links: { github: "https://github.com/ishashenoy/AlphaHedge" },
    detail: {
      overview:
        "Parallel analyst agents and retrieval-augmented workflows deliver fast, structured equity-style research summaries from natural-language prompts.",
      tech_feature: [
        "Orchestrated **multi-agent** research flows with tool use and structured outputs.",
        "**Supabase** for auth, persistence, and server-adjacent glue.",
        "**Gemini** and **RAG** for grounded answers with citation-friendly excerpts.",
      ],
    },
  },
  {
    title: "SignWave",
    id: 2,
    date: "2026",
    thumb_url: "/images/thumb/signwave.png",
    desc: "Real-time computer vision rhythm game that uses a custom-trained PyTorch neural network and hand tracking to turn live hand gestures into interactive gameplay.",
    tech: ["Python", "Flask", "PyTorch", "OpenCV", "MediaPipe", "NumPy"],
    links: { github: "https://github.com/ishashenoy/SignWave" },
    detail: {
      overview:
        "Hand landmarks drive gameplay timing and scoring; a small custom model classifies poses for low-latency interaction in the browser or local demo.",
      tech_feature: [
        "**MediaPipe** hand tracking with stable landmark streams for gesture input.",
        "**PyTorch** model training and inference integrated with a lightweight **Flask** backend.",
        "**OpenCV** capture and preprocessing for robust frames under varied lighting.",
      ],
    },
  },
  {
    title: "BookTok",
    id: 3,
    date: "2026",
    thumb_url: "/images/thumb/booktok.png",
    desc: "TikTok-style app with an async pipeline that generates narrated book-preview videos from summaries and keywords.",
    tech: ["React Native", "MongoDB", "Gemini", "ElevenLabs", "FFmpeg", "Cloudinary"],
    links: { demo: "https://devpost.com/software/booktok-3680je" },
    detail: {
      overview:
        "End-to-end pipeline from text prompts to short narrated clips: orchestration, TTS, video assembly, and cloud delivery for shareable previews.",
      tech_feature: [
        "**Gemini** for structured copy and keywords from user or catalog input.",
        "**ElevenLabs** narration and **FFmpeg** assembly into vertical video.",
        "**Cloudinary** for media hosting; **MongoDB** for app data and job metadata.",
      ],
    },
  },
  {
    id: 4,
    compact: true,
    line: "Pomodoro Pals, Match Me — small web apps built for fun",
    tech: ["JavaScript", "HTML", "CSS"],
    links: {
      pomodoro: "https://pomodoropals.vercel.app/",
      matchme: "https://playmatchme.vercel.app/",
    },
  },
];
