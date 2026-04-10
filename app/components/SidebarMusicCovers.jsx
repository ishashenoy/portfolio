"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

const TRACKS = [
  {
    title: "Nineteen",
    href: "https://soundcloud.com/robarousal/nineteen-master-digital",
    artwork: "https://i1.sndcdn.com/artworks-000419144604-1bewlq-large.jpg",
  },
  {
    title: "Eterna Forest",
    href: "https://soundcloud.com/cyndiquil721/eterna-forest",
    artwork: "https://i1.sndcdn.com/artworks-000192692027-7n49xs-large.jpg",
  },
  {
    title: "Treehome95 (Instrumental)",
    href: "https://soundcloud.com/tylerthecreatorofficial/tyler-the-creator-treehome95",
    artwork: "https://i1.sndcdn.com/artworks-JmFvZ20FPBzN-0-large.jpg",
  },
  {
    title: "The Internet - Curse INSTRUMENTAL",
    href: "https://soundcloud.com/eyejaymusic/the-internet-curse-instrumental",
    artwork: "https://i1.sndcdn.com/artworks-000152710339-f3ziz3-large.jpg",
  },
];

function toEmbedUrl(trackUrl) {
  const encoded = encodeURIComponent(trackUrl);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%238ea0d8&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
}

export default function SidebarMusicCovers() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const pendingTrackRef = useRef(null);
  const activeTrack = TRACKS[activeIndex];
  const activeTrackUrl = activeTrack.href;

  const playerSrc = useMemo(() => toEmbedUrl(TRACKS[0].href), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.SC?.Widget) {
      setApiReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => setApiReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!iframeRef.current || !apiReady || !window.SC?.Widget) return;
    const widget = window.SC.Widget(iframeRef.current);
    widgetRef.current = widget;
    widget.bind(window.SC.Widget.Events.READY, () => {
      setWidgetReady(true);
      if (pendingTrackRef.current) {
        widget.load(pendingTrackRef.current, { auto_play: true });
        pendingTrackRef.current = null;
      }
    });
    widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
    widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
    widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));
  }, [apiReady]);

  const playTrackByIndex = (index) => {
    setActiveIndex(index);
    const widget = widgetRef.current;
    const nextTrackUrl = TRACKS[index].href;
    if (!widget || !widgetReady) {
      pendingTrackRef.current = nextTrackUrl;
      return;
    }
    widget.load(nextTrackUrl, { auto_play: true });
  };

  const togglePlayback = () => {
    const widget = widgetRef.current;
    if (!widget || !widgetReady) {
      pendingTrackRef.current = activeTrackUrl;
      return;
    }
    if (isPlaying) {
      widget.pause();
    } else {
      widget.play();
    }
  };

  const goPrev = () => {
    const nextIndex = (activeIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrackByIndex(nextIndex);
  };

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % TRACKS.length;
    playTrackByIndex(nextIndex);
  };

  return (
    <div className="mt-2">
      <div className="mb-2">
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">music</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous track"
          className="cursor-pointer p-0.5 text-[#222] transition hover:opacity-70"
        >
          <MdSkipPrevious className="h-5 w-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? `Pause ${activeTrack.title}` : `Play ${activeTrack.title}`}
          title={activeTrack.title}
          className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border border-[var(--border)] bg-white p-0"
        >
          <div
            className="h-full w-full rounded-full animate-[spin_4.2s_linear_infinite]"
            style={{ animationPlayState: isPlaying ? "running" : "paused" }}
          >
            <img
              src={activeTrack.artwork}
              alt={activeTrack.title}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b9b9b9] bg-white" />
          </div>
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next track"
          className="cursor-pointer p-0.5 text-[#222] transition hover:opacity-70"
        >
          <MdSkipNext className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <iframe
        ref={iframeRef}
        title="SoundCloud track player"
        src={playerSrc}
        width="1"
        height="1"
        allow="autoplay"
        loading="eager"
        className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
