"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { music } from "../data/music";

/** Accept full playlist URL or raw playlist id (e.g. PL…). */
function extractPlaylistId(input) {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";
  const fromQuery = trimmed.match(/[?&]list=([^&]+)/);
  if (fromQuery) return decodeURIComponent(fromQuery[1]);
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
  return "";
}

function readVideoTitle(player) {
  try {
    const data = player.getVideoData?.();
    if (data?.title) return data.title;
  } catch {
    /* ignore */
  }
  return null;
}

export default function SidebarMusicCovers() {
  const playlistId = useMemo(
    () => extractPlaylistId(music.youtubePlaylist),
    []
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [trackName, setTrackName] = useState("music");
  const reactId = useId();
  const playerContainerId = useMemo(
    () => `yt-blog-${reactId.replace(/[^a-zA-Z0-9_-]+/g, "-")}`,
    [reactId]
  );
  const playerRef = useRef(null);
  const shouldPlayAfterReadyRef = useRef(false);
  const initGenRef = useRef(0);

  const refreshTitle = useCallback((player) => {
    const t = readVideoTitle(player);
    if (t) setTrackName(t);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT?.Player) {
      setApiReady(true);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      setApiReady(true);
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (!playlistId || !apiReady || !window.YT?.Player) return;

    const gen = ++initGenRef.current;
    const elId = playerContainerId;

    const ytPlayer = new window.YT.Player(elId, {
      width: "320",
      height: "240",
      playerVars: {
        listType: "playlist",
        list: playlistId,
        autoplay: 0,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (e) => {
          if (gen !== initGenRef.current) return;
          playerRef.current = e.target;
          refreshTitle(e.target);
          if (shouldPlayAfterReadyRef.current) {
            shouldPlayAfterReadyRef.current = false;
            e.target.playVideo();
            setIsPlaying(true);
          }
        },
        onStateChange: (e) => {
          if (gen !== initGenRef.current) return;
          const YT = window.YT;
          if (!YT) return;
          if (e.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            refreshTitle(e.target);
          } else if (e.data === YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            refreshTitle(e.target);
          } else if (e.data === YT.PlayerState.ENDED) {
            setIsPlaying(false);
          }
        },
      },
    });

    return () => {
      playerRef.current = null;
      try {
        ytPlayer.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [apiReady, playerContainerId, playlistId, refreshTitle]);

  useEffect(() => {
    if (!playlistId) return;
    let cancelled = false;
    const pageUrl = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(pageUrl)}&format=json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.title) return;
        setTrackName(data.title);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [playlistId]);

  const togglePlayback = () => {
    const player = playerRef.current;
    if (!player) {
      shouldPlayAfterReadyRef.current = true;
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      player.pauseVideo();
    } else {
      setIsPlaying(true);
      player.playVideo();
    }
  };

  const goPrev = () => {
    const player = playerRef.current;
    if (!player) return;
    player.previousVideo();
    window.setTimeout(() => {
      refreshTitle(player);
    }, 400);
  };

  const goNext = () => {
    const player = playerRef.current;
    if (!player) return;
    player.nextVideo();
    window.setTimeout(() => {
      refreshTitle(player);
    }, 400);
  };

  if (!playlistId) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Set <code className="text-xs">youtubePlaylist</code> in{" "}
        <code className="text-xs">app/data/music.jsx</code>.
      </p>
    );
  }

  return (
    <div className="w-full min-w-0">
      <p className="mb-3 truncate text-sm font-medium lowercase text-[var(--fg)]">{trackName}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous track"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--fg)] transition hover:bg-black/[0.04]"
        >
          <MdSkipPrevious className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--fg)] transition hover:bg-black/[0.04]"
        >
          {isPlaying ? <MdPause className="h-5 w-5" aria-hidden /> : <MdPlayArrow className="h-5 w-5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next track"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--bg)] px-3 py-2 text-[var(--fg)] transition hover:bg-black/[0.04]"
        >
          <MdSkipNext className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div
        id={playerContainerId}
        className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />
    </div>
  );
}
