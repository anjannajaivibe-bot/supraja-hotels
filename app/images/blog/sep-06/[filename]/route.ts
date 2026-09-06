import { NextResponse } from "next/server";

export const dynamic = "force-static";

const art: Record<string, { title: string; subtitle: string; scene: "city" | "room" | "family" | "rail" | "local"; accent: string }> = {
  "shilparamam-hyderabad-featured.webp": { title: "Shilparamam & Madhapur", subtitle: "Culture, events and HITEC City stays", scene: "city", accent: "#d6a73b" },
  "shilparamam-hyderabad-stay.webp": { title: "Stay in Madhapur", subtitle: "A practical base for your Hyderabad itinerary", scene: "city", accent: "#d6a73b" },
  "shilparamam-hyderabad-room.webp": { title: "Rest Between Plans", subtitle: "Comfort for business and leisure travellers", scene: "room", accent: "#d6a73b" },
  "inorbit-mall-hyderabad-featured.webp": { title: "Inorbit Mall & Madhapur", subtitle: "Shopping, dining and business travel", scene: "city", accent: "#55a7c8" },
  "inorbit-mall-madhapur.webp": { title: "Madhapur City Stay", subtitle: "Keep shopping and work plans connected", scene: "city", accent: "#55a7c8" },
  "inorbit-mall-room.webp": { title: "Comfortable Short Stay", subtitle: "A calm room after a busy Hyderabad day", scene: "room", accent: "#55a7c8" },
  "kims-kondapur-featured.webp": { title: "Kondapur Medical Stay", subtitle: "Practical accommodation planning for families", scene: "family", accent: "#4aa889" },
  "kims-kondapur-family-stay.webp": { title: "Family Stay Planning", subtitle: "Room, transport and flexible schedules", scene: "family", accent: "#4aa889" },
  "kims-kondapur-room.webp": { title: "A Place to Rest", subtitle: "Comfort for patient attendants and families", scene: "room", accent: "#4aa889" },
  "hafeezpet-railway-featured.webp": { title: "Hafeezpet Rail Travel", subtitle: "Plan your west Hyderabad stay", scene: "rail", accent: "#e17d4b" },
  "hafeezpet-travel-stay.webp": { title: "Station to Stay", subtitle: "Plan the complete local journey", scene: "rail", accent: "#e17d4b" },
  "hafeezpet-hotel-room.webp": { title: "Arrive. Rest. Continue.", subtitle: "A practical room for rail-connected travel", scene: "room", accent: "#e17d4b" },
  "chandanagar-hyderabad-featured.webp": { title: "Stay in Chandanagar", subtitle: "For families, business and short visits", scene: "local", accent: "#8f73b5" },
  "chandanagar-local-stay.webp": { title: "West Hyderabad Base", subtitle: "Lingampally, BHEL, Miyapur and beyond", scene: "local", accent: "#8f73b5" },
  "chandanagar-hotel-room.webp": { title: "Comfort in Chandanagar", subtitle: "Simple, practical stay planning", scene: "room", accent: "#8f73b5" },
};

function sceneMarkup(scene: string, accent: string) {
  if (scene === "room") return `<rect x="120" y="300" width="960" height="280" rx="28" fill="#fff" opacity=".94"/><rect x="190" y="365" width="600" height="160" rx="20" fill="#dbe6f0"/><rect x="210" y="330" width="260" height="90" rx="18" fill="#fff"/><rect x="500" y="330" width="260" height="90" rx="18" fill="#fff"/><rect x="825" y="340" width="150" height="190" rx="12" fill="${accent}" opacity=".22"/><circle cx="900" cy="385" r="34" fill="${accent}"/><rect x="890" y="418" width="20" height="70" fill="#18314f"/>`;
  if (scene === "rail") return `<path d="M80 540 C300 430 900 430 1120 540" stroke="#fff" stroke-width="20" fill="none" opacity=".75"/><rect x="350" y="285" width="500" height="210" rx="34" fill="#fff" opacity=".95"/><rect x="400" y="330" width="120" height="80" rx="10" fill="${accent}" opacity=".35"/><rect x="540" y="330" width="120" height="80" rx="10" fill="${accent}" opacity=".35"/><rect x="680" y="330" width="120" height="80" rx="10" fill="${accent}" opacity=".35"/><circle cx="470" cy="500" r="38" fill="#18314f"/><circle cx="730" cy="500" r="38" fill="#18314f"/>`;
  if (scene === "family") return `<rect x="140" y="315" width="920" height="250" rx="30" fill="#fff" opacity=".92"/><circle cx="480" cy="375" r="48" fill="${accent}"/><circle cx="600" cy="390" r="42" fill="#d6a73b"/><circle cx="710" cy="375" r="48" fill="${accent}" opacity=".75"/><path d="M410 540 Q480 420 550 540 M545 540 Q600 440 655 540 M640 540 Q710 420 780 540" fill="#18314f" opacity=".9"/>`;
  return `<rect x="100" y="330" width="150" height="230" rx="8" fill="#fff" opacity=".88"/><rect x="275" y="250" width="190" height="310" rx="8" fill="#fff" opacity=".78"/><rect x="490" y="300" width="145" height="260" rx="8" fill="#fff" opacity=".9"/><rect x="660" y="205" width="220" height="355" rx="8" fill="#fff" opacity=".76"/><rect x="905" y="275" width="175" height="285" rx="8" fill="#fff" opacity=".88"/><g fill="${accent}" opacity=".7">${Array.from({ length: 18 }, (_, i) => `<rect x="${125 + (i % 6) * 165}" y="${355 + Math.floor(i / 6) * 65}" width="55" height="25" rx="4"/>`).join("")}</g>`;
}

function svg(item: (typeof art)[string]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${item.title}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0c2848"/><stop offset=".62" stop-color="#174a70"/><stop offset="1" stop-color="${item.accent}"/></linearGradient></defs><rect width="1200" height="675" fill="url(#bg)"/><circle cx="1040" cy="100" r="220" fill="#fff" opacity=".07"/><circle cx="100" cy="620" r="260" fill="${item.accent}" opacity=".10"/>${sceneMarkup(item.scene, item.accent)}<rect x="0" y="0" width="1200" height="185" fill="#071b31" opacity=".78"/><text x="70" y="70" fill="${item.accent}" font-family="Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="4">SUPRAJA HOTELS · HYDERABAD</text><text x="70" y="125" fill="#fff" font-family="Georgia, serif" font-size="46" font-weight="700">${item.title}</text><text x="72" y="166" fill="#e9f1f7" font-family="Arial, sans-serif" font-size="24">${item.subtitle}</text><text x="70" y="635" fill="#fff" font-family="Arial, sans-serif" font-size="20" opacity=".9">Comfortable stays · Convenient locations · Direct booking</text></svg>`;
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const item = art[filename];
  if (!item) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(svg(item), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
