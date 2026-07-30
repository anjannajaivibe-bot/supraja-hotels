import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  ShieldCheck,
  BedDouble,
  Phone,
  MessageCircle,
  Building2,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotels in Hyderabad",
  description:
    "Explore Supraja Hotels in Hyderabad including Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge. Book directly.",
  keywords: [
    "Hotels in Hyderabad",
    "hotel booking in Hyderabad",
    "budget hotels in Hyderabad",
    "business hotels in Hyderabad",
    "family hotels in Hyderabad",
    "hotels near Hitech City",
    "hotels in Madhapur",
    "hotels in Chandanagar",
    "direct hotel booking Hyderabad",
    "Supraja Hotels",
  ],
  alternates: {
    canonical: "/hotels",
  },
  openGraph: {
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Explore Supraja Hotels in Hyderabad for comfortable rooms, prime locations and direct booking support.",
    url: "/hotels",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Hotels in Hyderabad by Supraja Hotels",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Explore Supraja Hotels in Hyderabad with direct booking support across Madhapur and Chandanagar.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const benefits = [
  {
    title: "Impeccably Maintained Rooms",
    text: "Clean, comfortable and well-kept rooms for business visits, family stays and short city trips.",
    icon: BedDouble,
  },
  {
    title: "Strategic Locations",
    text: "Stay near Madhapur, Hitech City, Chandanagar, BHEL, Miyapur and major access points.",
    icon: MapPin,
  },
  {
    title: "Complimentary WiFi",
    text: "Convenient WiFi access for work, calls, browsing and daily communication.",
    icon: Wifi,
  },
  {
    title: "Parking Support",
    text: "Practical parking assistance for guests travelling by personal or business vehicles.",
    icon: Car,
  },
  {
    title: "Trusted Hospitality",
    text: "Responsive support, direct communication and dependable service throughout the stay.",
    icon: ShieldCheck,
  },
  {
    title: "Direct Booking Assistance",
    text: "Call or WhatsApp our team for room availability, stay guidance and booking support.",
    icon: Phone,
  },
];

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view":
    "A refined hotel in Madhapur with convenient access to Hitech City, Cyber Towers, Kondapur and Gachibowli.",
  "supraja-residency":
    "A trusted hotel in Chandanagar for families, professionals and guests visiting Gangaram, BHEL and Miyapur.",
  "supraja-lodge":
    "A budget-friendly hotel in Chandanagar with practical amenities, clean rooms and direct booking support.",
};

const hotelsPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/hotels#collectionpage`,
  url: `${siteUrl}/hotels`,
  name: "Hotels in Hyderabad",
  description:
    "Supraja Hotels offers hotel stays in Hyderabad across Madhapur, Hitech City and Chandanagar.",
  isPartOf: {
    "@id": `${siteUrl}#website`,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hotel.name,
      url: `${siteUrl}/hotels/${hotel.slug}`,
    })),
  },
};

export default function HotelsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hotelsPageSchema),
        }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.18),transparent_30%)]" />

          <div className="container-custom relative grid items-center gap-12 lg:grid-cols-[52%_48%]">
            <div>
              <p className="mb-5 inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">
                Supraja Hotels Hyderabad
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
                Hotels in Hyderabad for Refined, Convenient Stays
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                <strong>Hotels in Hyderabad</strong> by Supraja Hotels are
                designed for guests who value clean rooms, strategic locations,
                direct hotel booking support and dependable hospitality across{" "}
                <strong>Madhapur</strong>, <strong>Hitech City</strong> and{" "}
                <strong>Chandanagar</strong>.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
                {[
                  "Direct Reservations",
                  "Clean Rooms",
                  "Prime Locations",
                  "WhatsApp Booking",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  <Phone size={18} />
                  Call for Booking
                </a>

                <a
                  href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20know%20room%20availability%20at%20Supraja%20Hotels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle size={18} />
                  WhatsApp Booking
                </a>
              </div>
            </div>

            <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:h-[500px]">
              <SmartImage
                src="/images/homepage/hero.webp"
                alt="Hotels in Hyderabad by Supraja Hotels"
                fill
                isHero
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-5 text-slate-950 shadow-xl backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">
                  Direct Booking Support
                </p>
                <p className="mt-1 text-2xl font-bold">
                  Madhapur • Hitech City • Chandanagar
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                Our Hotels
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
                Choose Supraja Hotels in Hyderabad
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Choose from three Supraja properties located in Madhapur and
                Chandanagar. Whether you are searching for{" "}
                <strong>hotel booking in Hyderabad</strong>,{" "}
                <strong>budget hotels in Hyderabad</strong>,{" "}
                <strong>business hotels in Hyderabad</strong>,{" "}
                <strong>family hotels in Hyderabad</strong> or{" "}
                <strong>hotels near Hitech City</strong>, Supraja Hotels offers
                practical comfort with direct reservation support.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              {hotels.map((hotel) => (
                <Link
                  key={hotel.slug}
                  href={`/hotels/${hotel.slug}`}
                  className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[330px_1fr_230px]"
                >
                  <div className="relative h-64 bg-slate-100 lg:h-full">
                    <SmartImage
                      src={hotel.images.hero}
                      alt={`${hotel.name} in ${hotel.location}`}
                      width={700}
                      height={500}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-7">
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} />
                      {hotel.location}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-950">
                      {hotel.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                        4.5
                      </span>

                      <div className="flex text-green-600">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <Star key={item} size={14} fill="currentColor" />
                        ))}
                      </div>

                      <span className="text-sm text-slate-500">
                        Guest rated
                      </span>
                    </div>

                    <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                      {hotelDescriptions[hotel.slug] ||
                        hotel.shortDescription}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {hotel.seo.targetLocations
                        .slice(0, 4)
                        .map((location) => (
                          <span
                            key={location}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"
                          >
                            {location}
                          </span>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center border-t border-slate-200 p-7 lg:border-l lg:border-t-0">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Direct Booking</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">
                        {hotel.phone}
                      </p>

                      <span className="mt-5 inline-block rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white">
                        View Hotel
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                Why Choose Us
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
                Trusted Hyderabad Hospitality, Designed Around Your Stay
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Icon size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Direct Reservations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  Hotel Booking in Hyderabad with Direct Support
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  Direct booking helps guests speak with the hotel team before
                  confirming a stay. This is useful for checking room
                  availability, location suitability, check-in requirements and
                  the best property based on travel purpose.
                </p>

                <ul className="mt-6 space-y-3 text-slate-700">
                  <li>✓ Direct phone and WhatsApp booking assistance</li>
                  <li>✓ Hotels in Madhapur and Chandanagar</li>
                  <li>✓ Comfortable rooms for business and family guests</li>
                  <li>✓ Easy access to key Hyderabad locations</li>
                  <li>✓ Practical amenities including WiFi and parking support</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <Building2 className="h-12 w-12 text-amber-600" />

                <h3 className="mt-5 text-2xl font-bold text-slate-950">
                  Hotels in Hyderabad for Business and Family Guests
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  Hotel Supraja Cyber View is suitable for guests looking for
                  access to Madhapur, Hitech City and nearby business districts.
                  Hotel Supraja Residency and Hotel Supraja Lodge serve guests
                  looking for hotels in Chandanagar with comfortable access to
                  local residential, commercial and transport areas.
                </p>

                <p className="mt-5 leading-8 text-slate-600">
                  If you are comparing accommodation options, Supraja Hotels
                  gives you a balanced choice between comfort, location and
                  booking convenience.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-50 p-7">
              <h3 className="text-xl font-bold text-slate-950">
                Helpful Travel Resources
              </h3>

              <div className="mt-4 flex flex-wrap gap-5 text-sm">
                <Link href="/contact" className="text-blue-700 hover:underline">
                  Speak with reservations
                </Link>

                <Link href="/about" className="text-blue-700 hover:underline">
                  Learn about Supraja hospitality
                </Link>

                <Link href="/offers" className="text-blue-700 hover:underline">
                  View hotel offers
                </Link>

                <Link href="/gallery" className="text-blue-700 hover:underline">
                  View hotel gallery
                </Link>

                <a
                  href="https://www.telanganatourism.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Telangana Tourism
                </a>

                <a
                  href="https://tourism.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  India tourism guide
                </a>
              </div>
            </div>

            <p className="mt-10 leading-8 text-slate-600">
              For guests searching for reliable{" "}
              <strong>Hotels in Hyderabad</strong>, Supraja Hotels offers
              comfortable rooms, practical amenities, convenient locations and
              direct booking support across Madhapur and Chandanagar.
            </p>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white lg:py-20">
          <div className="container-custom flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Book Direct and Stay Better
              </h2>
              <p className="mt-3 text-slate-300">
                Speak with Supraja Hotels for current room availability and
                property guidance.
              </p>
            </div>

            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20book%20a%20room"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Book on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
