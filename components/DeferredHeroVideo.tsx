"use client";

import { useEffect, useRef, useState } from "react";

type Props = { src?: string };

export default function DeferredHeroVideo({
  src = "/media/home-hero/supraja-hotels-home-hero.webm",
}: Props) {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    let idle: number | undefined;
    let timer: number | undefined;

    const cancelPending = () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };

    const canPlay = () => desktop.matches && !reducedMotion.matches &&
      !connection?.saveData && !/^(slow-)?2g$/.test(connection?.effectiveType ?? "");

    const begin = () => {
      if (canPlay()) setEnabled(true);
    };

    function schedule() {
      cancelPending();
      if (!canPlay()) {
        setEnabled(false);
        return;
      }
      if (document.readyState !== "complete") {
        window.addEventListener("load", schedule, { once: true });
      } else if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(begin, { timeout: 2500 });
      } else {
        timer = window.setTimeout(begin, 1500);
      }
    }

    schedule();
    desktop.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelPending();
      desktop.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [src]);

  if (!enabled) return null;

  function togglePlayback() {
    if (!video.current) return;
    if (video.current.paused) {
      void video.current.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      video.current.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video
        ref={video}
        src={src}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        disablePictureInPicture
        tabIndex={-1}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onError={() => setEnabled(false)}
      />
      <button type="button" onClick={togglePlayback} aria-label={paused ? "Play background video" : "Pause background video"} className="absolute bottom-4 right-4 z-30 min-h-11 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
        {paused ? "Play video" : "Pause video"}
      </button>
    </>
  );
}
