"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const STORAGE_KEY = "portfolio-theme";

function applyTheme(dark) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    /* ignore */
  }
}

function subscribe(onChange) {
  const el = document.documentElement;
  const obs = new MutationObserver(onChange);
  obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    applyTheme(!getSnapshot());
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-5 right-5 z-[9999] inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--btn-bg)] text-[var(--icon)] shadow-[0_2px_12px_var(--card-shadow)] transition hover:bg-[var(--btn-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <MdLightMode className="h-5 w-5" aria-hidden /> : <MdDarkMode className="h-5 w-5" aria-hidden />}
    </button>
  );
}
