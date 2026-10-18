import Image, { type ImageProps } from "next/image";

type Props = ImageProps & {
  isHero?: boolean;
};

export default function SmartImage({
  isHero = false,
  sizes,
  quality,
  alt,
  ...props
}: Props) {
  return (
    <Image
      {...props}
      alt={alt}
      preload={isHero}
      loading={isHero ? undefined : "lazy"}
      quality={quality ?? (isHero ? 70 : 60)}
      placeholder="empty"
      sizes={
        sizes ??
        (isHero
          ? "100vw"
          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")
      }
    />
  );
}
