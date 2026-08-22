"use client";

import { Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const hotelCtaData = [
  {
    slug: "supraja-cyber-view",
    name: "Hotel Supraja Cyber View",
    phone: "9550776161",
  },
  {
    slug: "supraja-residency",
    name: "Hotel Supraja Residency",
    phone: "9346316161",
  },
  {
    slug: "supraja-lodge",
    name: "Hotel Supraja Lodge",
    phone: "9348446161",
  },
];

export default function FloatingCTA() {
  const pathname = usePathname();

  const currentHotel = hotelCtaData.find((hotel) =>
    pathname.includes(hotel.slug),
  );

  const phone = currentHotel?.phone || "9550776161";
  const message = currentHotel
    ? `Hi, I would like to check room availability at ${currentHotel.name}.`
    : "Hi, I would like to check room availability at Supraja Hotels.";

  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] hidden flex-col gap-3 md:flex">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          currentHotel
            ? `Check room availability at ${currentHotel.name} on WhatsApp`
            : "Check Supraja Hotels room availability on WhatsApp"
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        <MessageCircle size={26} aria-hidden="true" />
      </a>

      <a
        href={`tel:+91${phone}`}
        aria-label={
          currentHotel ? `Call ${currentHotel.name}` : "Call Supraja Hotels"
        }
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition hover:scale-105 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        <Phone size={25} aria-hidden="true" />
      </a>
    </div>
  );
}
