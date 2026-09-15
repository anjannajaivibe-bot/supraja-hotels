import { NextResponse } from "next/server";
import path from "node:path";
import sharp from "sharp";

export const runtime = "nodejs";

const images: Record<string, string> = {
  "hicc-hyderabad-featured.webp": "images/cyber-view/exterior.webp",
  "hicc-business-stay.webp": "images/cyber-view/reception.webp",
  "hicc-madhapur-room.webp": "images/cyber-view/room-2.webp",
  "patancheru-industrial-area-featured.webp": "images/residency/exterior.webp",
  "patancheru-business-stay.webp": "images/residency/reception.webp",
  "patancheru-chandanagar-room.webp": "images/residency/room-1.webp",
  "banquet-hall-rooms-chandanagar-featured.webp": "images/banquet-hall/banquet-hall-overview.webp",
  "saket-banquet-event-space.webp": "images/banquet-hall/banquet-hall-stage.webp",
  "residency-event-guest-room.webp": "images/residency/room-3.webp",
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const source = images[filename];

  if (!source) {
    return new NextResponse("Not found", { status: 404 });
  }

  const sourcePath = path.join(process.cwd(), "public", source);
  const image = await sharp(sourcePath)
    .resize(1200, 675, {
      fit: "cover",
      position: sharp.strategy.attention,
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
