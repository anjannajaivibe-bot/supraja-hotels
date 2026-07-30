const MOBILE_VIDEO =
  "/media/home-hero/supraja-hotels-home-hero-mobile.webm";

const DESKTOP_VIDEO =
  "/media/home-hero/supraja-hotels-home-hero.webm";

const POSTER =
  "/media/home-hero/supraja-hotels-home-hero-poster.webp";

export default function DeferredHeroVideo() {
  return (
    <video
      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={POSTER}
      aria-hidden="true"
      disablePictureInPicture
      tabIndex={-1}
    >
      <source
        src={MOBILE_VIDEO}
        type="video/webm"
        media="(max-width: 767px)"
      />

      <source src={DESKTOP_VIDEO} type="video/webm" />
    </video>
  );
}