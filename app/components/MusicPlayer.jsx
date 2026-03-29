"use client";

import { useEffect, useRef, useState } from "react";

const TRACK_URL = "https://soundcloud.com/ishas_14/sets/faves?si=3b515896ee06495697d96fab67f5116d";

export default function MusicPlayer({ iconFill = "#ffffff" }) {
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const readyRef = useRef(false);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateTrack = (widget) => {
    widget.getCurrentSound((sound) => {
      if (!sound) return;
      const art = sound.artwork_url?.replace("-large", "-t500x500") ?? sound.user?.avatar_url;
      setTrack({ title: sound.title, artist: sound.user?.username ?? "", artwork: art });
    });
  };

  useEffect(() => {
    const init = () => {
      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        readyRef.current = true;
        updateTrack(widget);
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
        updateTrack(widget);
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));
    };

    if (window.SC) { init(); return; }

    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.onload = init;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const toggle = () => {
    if (!widgetRef.current || !readyRef.current) return;
    isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
  };

  const skipBtn = (onClick, title, children) => (
    <button
      onClick={onClick}
      title={title}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", opacity: 0.5, lineHeight: 0 }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
    >
      {children}
    </button>
  );

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}&auto_play=false&buying=false&sharing=false&show_artwork=false`}
        style={{ position: "fixed", top: "-9999px", left: "-9999px", width: 300, height: 166 }}
        allow="autoplay"
        title="SoundCloud Player"
      />

      {track && (
        <div
          className="fixed bottom-6 right-6 z-50"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          {/* Prev */}
          {skipBtn(() => widgetRef.current?.prev(), "Previous",
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconFill}>
              <polygon points="19,4 7,12 19,20" />
              <rect x="4" y="4" width="3" height="16" rx="1" />
            </svg>
          )}

          {/* Record */}
          <button
            onClick={toggle}
            title={`${track.title} — ${track.artist}`}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div
              className={isPlaying ? "vinyl-spinning" : "vinyl-paused"}
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Album art fills the whole disc */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={track.artwork} alt={track.title} style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }} />

              {/* CD iridescent sheen */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none",
                background: "conic-gradient(from 0deg, rgba(255,80,80,0.13), rgba(255,200,80,0.13), rgba(80,255,180,0.13), rgba(80,160,255,0.13), rgba(200,80,255,0.13), rgba(255,80,80,0.13))",
                mixBlendMode: "screen",
              }} />

              {/* Outer CD ring */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none",
                boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.15), inset 0 0 0 3px rgba(0,0,0,0.3)",
              }} />

              {/* Center hole */}
              <div style={{
                position: "absolute", width: 12, height: 12, borderRadius: "50%",
                top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, #d0d0d0 40%, #a0a0a0 100%)",
                boxShadow: "0 0 0 1.5px rgba(0,0,0,0.4)",
                zIndex: 2,
              }} />
            </div>
          </button>

          {/* Next */}
          {skipBtn(() => widgetRef.current?.next(), "Next",
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconFill}>
              <polygon points="5,4 17,12 5,20" />
              <rect x="17" y="4" width="3" height="16" rx="1" />
            </svg>
          )}
        </div>
      )}
    </>
  );
}
