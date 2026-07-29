"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_VIDEO =
  "/media/home-hero/supraja-hotels-home-hero-mobile.webm";
const DESKTOP_VIDEO = "/media/home-hero/supraja-hotels-home-hero.webm";
const POSTER = "/media/home-hero/supraja-hotels-home-hero-poster.webp";

export default function DeferredHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) {
      return;
    }

    const selectedSource = window.matchMedia("(max-width: 767px)").matches
      ? MOBILE_VIDEO
      : DESKTOP_VIDEO;

    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      setVideoSource(selectedSource);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoSource) {
      return;
    }

    video.load();
    void video.play().catch(() => {
      // The poster remains visible if the browser blocks autoplay.
    });
  }, [videoSource]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      muted
      loop
      playsInline
      preload="none"
      poster={POSTER}
      aria-hidden="true"
      disablePictureInPicture
      tabIndex={-1}
    >
      {videoSource ? <source src={videoSource} type="video/webm" /> : null}
    </video>
  );
}
