"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { music } from "../data/music";

const PLAYLIST_URL = (music.soundcloudPlaylistUrl || "").trim();
const FALLBACK_ARTWORK = "https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8a.png";

function toBestArtwork(sound) {
  const soundArtwork = sound?.artwork_url;
  const userArtwork = sound?.user?.avatar_url;
  const src = soundArtwork || userArtwork || FALLBACK_ARTWORK;
  return src.replace("-large.", "-t500x500.");
}

function toEmbedUrl(trackUrl) {
  const encoded = encodeURIComponent(trackUrl);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%238ea0d8&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
}

export default function SidebarMusicCovers() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [displayTitle, setDisplayTitle] = useState("SoundCloud playlist");
  const [displayArtwork, setDisplayArtwork] = useState(FALLBACK_ARTWORK);
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const shouldAutoplayRef = useRef(false);

  const playerSrc = useMemo(() => toEmbedUrl(PLAYLIST_URL), []);

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

    const updateFromCurrentSound = () => {
      widget.getCurrentSound((sound) => {
        if (!sound) return;
        setDisplayTitle(sound.title || "SoundCloud playlist");
        setDisplayArtwork(toBestArtwork(sound));
      });
    };

    widget.bind(window.SC.Widget.Events.READY, () => {
      setWidgetReady(true);
      updateFromCurrentSound();
      if (shouldAutoplayRef.current) {
        widget.play();
        shouldAutoplayRef.current = false;
      }
    });
    widget.bind(window.SC.Widget.Events.PLAY, () => {
      setIsPlaying(true);
      updateFromCurrentSound();
    });
    widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
    widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));

  }, [apiReady]);

  useEffect(() => {
    let cancelled = false;
    const oEmbedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(PLAYLIST_URL)}`;
    fetch(oEmbedUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setDisplayTitle(data.title || "SoundCloud playlist");
        setDisplayArtwork(data.thumbnail_url || FALLBACK_ARTWORK);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const togglePlayback = () => {
    const widget = widgetRef.current;
    if (!widget || !widgetReady) {
      shouldAutoplayRef.current = true;
      return;
    }
    if (isPlaying) {
      widget.pause();
    } else {
      widget.play();
    }
  };

  const goPrev = () => {
    const widget = widgetRef.current;
    if (!widget || !widgetReady) return;
    widget.prev();
    widget.getCurrentSound((sound) => {
      if (!sound) return;
      setDisplayTitle(sound.title || "SoundCloud playlist");
      setDisplayArtwork(toBestArtwork(sound));
    });
  };

  const goNext = () => {
    const widget = widgetRef.current;
    if (!widget || !widgetReady) return;
    widget.next();
    widget.getCurrentSound((sound) => {
      if (!sound) return;
      setDisplayTitle(sound.title || "SoundCloud playlist");
      setDisplayArtwork(toBestArtwork(sound));
    });
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
          aria-label={isPlaying ? `Pause ${displayTitle}` : `Play ${displayTitle}`}
          title={displayTitle}
          className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border border-[var(--border)] bg-white p-0"
        >
          <div
            className="h-full w-full rounded-full animate-[spin_4.2s_linear_infinite]"
            style={{ animationPlayState: isPlaying ? "running" : "paused" }}
          >
            <img
              src={displayArtwork}
              alt={displayTitle}
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
