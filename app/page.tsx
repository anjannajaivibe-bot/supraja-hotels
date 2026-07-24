import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Star,
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
import { hotels } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Supraja Hotels | Comfortable Hotels in Hyderabad",
  description:
    "Book clean and comfortable hotels in Hyderabad near Hitech City, Madhapur, Chandanagar, BHEL and Miyapur with direct booking support from Supraja Hotels.",
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
    canonical: "https://suprajahotels.com",
  },
  openGraph: {
    title: "Supraja Hotels | Comfortable Hotels in Hyderabad",
    description:
      "Clean rooms, convenient Hyderabad locations and friendly direct booking support at Supraja Hotels.",
    url: "https://suprajahotels.com",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "https://suprajahotels.com/images/homepage/hero.webp",
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
    title: "Supraja Hotels | Comfortable Hotels in Hyderabad",
    description:
      "Clean rooms, convenient Hyderabad locations and friendly direct booking support at Supraja Hotels.",
    images: ["https://suprajahotels.com/images/homepage/hero.webp"],
  },
};

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view":
    "Stay close to Hitech City, Madhapur, Cyber Towers, Gachibowli and Kondapur. An ideal choice for business travellers looking for a clean, comfortable room with easy access to Hyderabad's IT corridor.",
  "supraja-residency":
    "Enjoy a comfortable stay in Chandanagar with easy access to BHEL, Gangaram, Serilingampally, Nallagandla and Miyapur. A convenient choice for families, professionals and medical visitors.",
  "supraja-lodge":
    "A budget-friendly stay in Chandanagar offering clean rooms, friendly service and easy access to BHEL, Miyapur and nearby areas. Ideal for short stays, work trips and family visits.",
};

const featureCards = [
  {
    title: "Spotlessly Clean Rooms",
    description:
      "Relax in clean, well-maintained rooms designed to give you a comfortable and peaceful stay every time.",
    icon: BedDouble,
  },
  {
    title: "Convenient Locations",
    description:
      "Stay close to Hyderabad's leading IT hubs, hospitals, business centres, shopping areas and transport links.",
    icon: MapPin,
  },
  {
    title: "Easy Direct Booking",
    description:
      "Call or WhatsApp us for live room availability, the best direct rates and quick booking confirmation.",
    icon: Phone,
  },
  {
    title: "Free High-Speed WiFi",
    description:
      "Stay connected with reliable internet for work, video calls, streaming and everyday browsing.",
    icon: Wifi,
  },
  {
    title: "Safe Parking",
    description:
      "Parking facilities are available at selected hotels, giving you one less thing to worry about during your stay.",
    icon: Car,
  },
  {
    title: "Perfect for Every Traveller",
    description:
      "Whether you are travelling for business, with family, for medical appointments or on a short visit, you will feel welcome.",
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
    "@id": "https://suprajahotels.com#website",
    name: "Supraja Hotels",
    url: "https://suprajahotels.com",
    description:
      "Clean and comfortable hotels in Hyderabad near Hitech City, Madhapur, Chandanagar, BHEL and Miyapur.",
    publisher: {
      "@id": "https://suprajahotels.com#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://suprajahotels.com/hotels?search={search_term_string}",
      "query-input": "required name=search_term_string",
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

      <section className="bg-white">
        <div className="grid md:grid-cols-[46%_54%]">
          <div className="flex min-h-[650px] items-center bg-slate-950 px-6 py-16 text-white md:px-16">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                Supraja Hotels | Hyderabad
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
                Comfortable Stays Across Hyderabad
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Whether you are travelling for work, visiting family, attending
                a medical appointment or exploring the city, Supraja Hotels
                offers clean rooms, convenient locations and warm hospitality.
                Stay close to <strong>Hitech City</strong>,{" "}
                <strong>Madhapur</strong>, <strong>Chandanagar</strong>,{" "}
                <strong>BHEL</strong> and <strong>Miyapur</strong>.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
                {[
                  "Best Direct Rates",
                  "Prime Locations",
                  "Free WiFi",
                  "24x7 Guest Support",
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
                <Link
                  href="/hotels"
                  className="rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Explore Hotels
                </Link>

                <a
                  href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20know%20room%20availability%20at%20Supraja%20Hotels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <MessageCircle size={18} />
                  Book on WhatsApp
                </a>

                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  <Phone size={18} />
                  Call Now
                </a>
              </div>
            </div>
          </div>

          <div
  className="relative h-[340px] overflow-hidden bg-slate-950 bg-cover bg-center md:h-[650px]"
  style={{
    backgroundImage:
      "url('/media/home-hero/supraja-hotels-home-hero-poster.webp')",
  }}
>
  <video
  className="absolute inset-0 h-full w-full object-cover object-center"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  poster="/media/home-hero/supraja-hotels-home-hero-poster.webp"
  aria-hidden="true"
  disablePictureInPicture
>
  <source
    src="/media/home-hero/supraja-hotels-home-hero-mobile.webm"
    type="video/webm"
    media="(max-width: 767px)"
  />

  <source
    src="/media/home-hero/supraja-hotels-home-hero.webm"
    type="video/webm"
    media="(min-width: 768px)"
  />

  <source
    src="/media/home-hero/supraja-hotels-home-hero.mp4"
    type="video/mp4"
  />
  </video>
</div>
</div>
</section>

      <section className="bg-white px-4 py-20">
        <div className="container-custom">
          <div className="max-w-4xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Our Hotels
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Find the Perfect Stay
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Every traveller has different needs. Choose from our three
              conveniently located hotels across Hyderabad, each offering clean
              rooms, friendly service and excellent value for business trips,
              family visits and short stays.
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
                      Highly Rated by Guests
                    </span>
                  </div>

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
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Book Direct</p>
                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {hotel.phone}
                    </p>

                    <span className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                      Explore Hotel
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Why Guests Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Everything You Need for a Comfortable Stay
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

      <section className="bg-white px-4 py-20">
        <div className="container-custom">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Nearby Locations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
                  Stay Near Hyderabad's Most Important Destinations
                </h2>

                <p className="mt-5 max-w-4xl leading-8 text-slate-600">
                  Our hotels are conveniently located near Hitech City,
                  Madhapur, Gachibowli, Kondapur, Chandanagar, BHEL,
                  Serilingampally, Nallagandla and Miyapur, helping you spend
                  less time travelling and more time enjoying your visit.
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

      <section className="container-custom px-4 py-16 lg:py-24">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book Direct. Stay Better. Save More.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Get the best available rates, quick room confirmation and friendly
            assistance by booking directly with Supraja Hotels. Our team is
            just a phone call or WhatsApp message away.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/hotels"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
            >
              View Hotels
            </Link>

            <a
              href="tel:+919550776161"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Call Now
            </a>

            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20Supraja%20Hotels"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
