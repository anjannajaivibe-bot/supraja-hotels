import { NextResponse } from "next/server";
import path from "node:path";
import sharp from "sharp";

export const runtime = "nodejs";

const images: Record<
  string,
  { source: string; position?: sharp.Gravity | sharp.Strategy }
> = {
  "hicc-hyderabad-featured.webp": {
    source: "images/cyber-view/exterior.webp",
    position: sharp.strategy.attention,
  },
  "hicc-business-stay.webp": {
    source: "images/cyber-view/reception.webp",
    position: sharp.strategy.attention,
  },
  "hicc-madhapur-room.webp": {
    source: "images/cyber-view/room-2.webp",
    position: sharp.strategy.attention,
  },
  "patancheru-industrial-area-featured.webp": {
    source: "images/residency/exterior.webp",
    position: sharp.strategy.attention,
  },
  "patancheru-business-stay.webp": {
    source: "images/residency/reception.webp",
    position: sharp.strategy.attention,
  },
  "patancheru-chandanagar-room.webp": {
    source: "images/residency/room-1.webp",
    position: sharp.strategy.attention,
  },
  "banquet-hall-rooms-chandanagar-featured.webp": {
    source: "images/banquet-hall/banquet-hall-overview.webp",
    position: sharp.strategy.attention,
  },
  "saket-banquet-event-space.webp": {
    source: "images/banquet-hall/banquet-hall-stage.webp",
    position: sharp.strategy.attention,
  },
  "residency-event-guest-room.webp": {
    source: "images/residency/room-3.webp",
    position: sharp.strategy.attention,
  },
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const config = images[filename];

  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const sourcePath = path.join(process.cwd(), "public", config.source);
  const image = await sharp(sourcePath)
    .resize(1200, 675, {
      fit: "cover",
      position: config.position ?? sharp.strategy.attention,
      withoutEnlargement: false,
    })
    .webp({ quality: 84, effort: 5 })
    .toBuffer();

  return new NextResponse(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
