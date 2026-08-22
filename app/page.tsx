import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Wifi,
  Car,
  BedDouble,
  Building2,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import AmenitiesSection from "@/components/AmenitiesSection";
import DeferredHeroVideo from "@/components/DeferredHeroVideo";
import { hotels } from "@/data/hotels";

export const metadata: Metadata = {
  title: {
    absolute: "Supraja Hotels | Hotels in Hyderabad for Direct Booking",
  },
  description:
    "Call or WhatsApp Supraja Hotels for clean, comfortable stays in Madhapur, Hitech City and Chandanagar with direct room availability support.",
  keywords: [
    "Hotels in Hyderabad",
    "Hotel booking Hyderabad",
    "Direct hotel booking Hyderabad",
    "Hotels near Hitech City",
    "Hotels in Madhapur",
    "Hotels in Chandanagar",
    "Hotels near BHEL",
    "Hotels near Miyapur",
    "Budget hotels Hyderabad",
    "Supraja Hotels",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Supraja Hotels | Hotels in Hyderabad for Direct Booking",
    description:
      "Clean rooms, convenient Hyderabad locations and direct booking support by phone or WhatsApp.",
    url: "/",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Supraja Hotels in Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supraja Hotels | Hotels in Hyderabad for Direct Booking",
    description:
      "Clean rooms, convenient Hyderabad locations and direct booking support by phone or WhatsApp.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view":
    "Stay in Madhapur with convenient access to Hitech City, Cyber Towers, Kondapur and Gachibowli. A practical choice for business travellers, event visitors and guests who want to stay close to Hyderabad's IT corridor.",
  "supraja-residency":
    "Stay in Chandanagar with convenient access to BHEL, Gangaram, Serilingampally, Nallagandla and Miyapur. Suitable for families, professionals, medical visitors and short stays.",
  "supraja-lodge":
    "A budget-friendly stay in Chandanagar with straightforward access to BHEL, Miyapur, Gangaram and nearby areas. Suitable for short stays, work trips and family visits.",
};

const featureCards = [
  {
    title: "Clean, Comfortable Rooms",
    description:
      "Stay in well-maintained rooms designed for a practical and comfortable visit.",
    icon: BedDouble,
  },
  {
    title: "Convenient Locations",
    description:
      "Choose locations close to major IT hubs, hospitals, business areas, shopping destinations and transport links.",
    icon: MapPin,
  },
  {
    title: "Direct Booking Support",
    description:
      "Call or WhatsApp the hotel team for current room availability, rates and booking confirmation.",
    icon: Phone,
  },
  {
    title: "Free WiFi",
    description:
      "Stay connected for work, video calls, streaming and everyday browsing.",
    icon: Wifi,
  },
  {
    title: "Parking at Selected Hotels",
    description:
      "Parking facilities are available at selected properties. Confirm availability with the hotel before arrival.",
    icon: Car,
  },
  {
    title: "For Business and Family Stays",
    description:
      "Suitable for work trips, family visits, medical appointments, events and short Hyderabad stays.",
    icon: ShieldCheck,
  },
];

const locationTargets = [
  "Hitech City",
  "Madhapur",
  "Kondapur",
  "Gachibowli",
  "Chandanagar",
  "Gangaram",
  "BHEL",
  "Serilingampally",
  "Nallagandla",
  "Miyapur",
];

export default function HomePage() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://suprajahotels.com/#website",
    name: "Supraja Hotels",
    url: "https://suprajahotels.com",
    description:
      "Supraja Hotels offers clean and comfortable stays in Hyderabad with properties in Madhapur, Hitech City and Chandanagar.",
    publisher: {
      "@id": "https://suprajahotels.com/#organization",
    },
  };

  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeSchema),
        }}
      />

      <section
        className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-slate-950 text-white md:min-h-[760px]"
        style={{
          backgroundImage:
            "url('/media/home-hero/supraja-hotels-home-hero-poster.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <DeferredHeroVideo />

        <div
          className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20"
          aria-hidden="true"
        />

        <div className="container-custom relative z-20 w-full px-5 py-20 sm:px-6 md:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-base">
              Supraja Hotels | Hyderabad
            </p>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Comfortable Stays Across Hyderabad
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
              Whether you are travelling for work, visiting family, attending a
              medical appointment or exploring the city, Supraja Hotels offers
              clean rooms, convenient locations and direct booking support. Stay
              close to <strong>Hitech City</strong>, <strong>Madhapur</strong>,{" "}
              <strong>Chandanagar</strong>, <strong>BHEL</strong> and{" "}
              <strong>Miyapur</strong>.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 text-xs font-semibold text-white sm:text-sm">
              {[
                "Call for Current Availability",
                "WhatsApp Booking Support",
                "Convenient Locations",
                "Free WiFi",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/25 bg-slate-950/35 px-4 py-2 backdrop-blur-sm"
                >
                  ✓ {item}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/hotels"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Choose a Hotel
              </Link>

              <a
                href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-green-950/25 transition hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Check on WhatsApp
              </a>

              <a
                href="tel:+919550776161"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/60 bg-slate-950/25 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Phone size={18} aria-hidden="true" />
                Call 9550776161
              </a>
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
              Choose the Right Location for Your Stay
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Choose from three Supraja Hotels locations in Hyderabad. Each
              property has its own direct phone and WhatsApp contact so you can
              check current room availability before you travel.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.slug}
                className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[330px_1fr_250px]"
              >
                <Link
                  href={`/hotels/${hotel.slug}`}
                  className="group relative h-64 bg-slate-100 lg:h-full"
                  aria-label={`View ${hotel.name}`}
                >
                  <SmartImage
                    src={hotel.images.hero}
                    alt={`${hotel.name} in ${hotel.location}`}
                    width={700}
                    height={500}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="p-7">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} aria-hidden="true" />
                    {hotel.location}
                  </p>

                  <Link href={`/hotels/${hotel.slug}`}>
                    <h3 className="mt-2 text-2xl font-bold text-slate-950 hover:text-blue-700">
                      {hotel.name}
                    </h3>
                  </Link>

                  <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                    {hotelDescriptions[hotel.slug] || hotel.shortDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {hotel.seo.targetLocations.slice(0, 4).map((location) => (
                      <span
                        key={location}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800"
                      >
                        {location}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
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
                  <div className="w-full text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      Check Current Availability
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {hotel.phone}
                    </p>

                    <div className="mt-5 grid gap-2">
                      <a
                        href={`tel:+91${hotel.phone}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                      >
                        <Phone size={16} aria-hidden="true" />
                        Call Hotel
                      </a>
                      <a
                        href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(
                          hotel.name,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        WhatsApp
                      </a>
                      <Link
                        href={`/hotels/${hotel.slug}`}
                        className="text-sm font-semibold text-blue-700 hover:underline"
                      >
                        View hotel details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Why Choose Supraja Hotels
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Practical Stays with Direct Hotel Support
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AmenitiesSection />

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Nearby Locations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
                  Stay Near Hyderabad&apos;s Important Business and Residential Areas
                </h2>

                <p className="mt-5 max-w-4xl leading-8 text-slate-600">
                  Our properties serve guests visiting Hitech City, Madhapur,
                  Gachibowli, Kondapur, Chandanagar, BHEL, Serilingampally,
                  Nallagandla and Miyapur. Choose the hotel page that best matches
                  your destination, then call or WhatsApp that property directly.
                </p>
              </div>

              <Building2 className="hidden h-16 w-16 text-amber-600 lg:block" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {locationTargets.map((location) => (
                <span
                  key={location}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {location}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/hotels" className="text-blue-700 hover:underline">
                Explore all hotels
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
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom px-4 py-16 lg:py-20">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Check Availability Directly with the Hotel
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Call or WhatsApp Supraja Hotels for current room availability, rates
            and booking confirmation. For the fastest response, choose your hotel
            first and contact that property directly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/hotels"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
            >
              Choose Your Hotel
            </Link>

            <a
              href="tel:+919550776161"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Call Cyber View
            </a>

            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
            >
              WhatsApp Supraja Hotels
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
