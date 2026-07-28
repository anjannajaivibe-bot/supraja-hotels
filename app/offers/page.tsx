import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgePercent,
  CalendarCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Users,
  BriefcaseBusiness,
  MapPin,
  Wifi,
  Car,
  BedDouble,
  Clock,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotel Offers in Hyderabad",
  description:
    "Book direct with Supraja Hotels for best available rates, corporate stays, group bookings and long stay support in Hyderabad.",
  keywords: [
    "Hotel Offers in Hyderabad",
    "direct hotel booking Hyderabad",
    "hotel booking offers Hyderabad",
    "corporate stay Hyderabad",
    "group hotel booking Hyderabad",
    "long stay hotels Hyderabad",
    "hotels near Hitech City",
    "hotels in Chandanagar",
    "Supraja Hotels offers",
  ],
  alternates: {
    canonical: "/offers",
  },
  openGraph: {
    title: "Hotel Offers in Hyderabad | Supraja Hotels",
    description:
      "Direct booking benefits, best available rates and quick reservation support across Supraja Hotels in Hyderabad.",
    url: "/offers",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Offers in Hyderabad by Supraja Hotels",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Offers in Hyderabad | Supraja Hotels",
    description:
      "Book direct with Supraja Hotels for best available rates and quick booking support.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const directBenefits = [
  {
    icon: BadgePercent,
    title: "Best Available Rates",
    description:
      "Book directly with the hotel team for transparent pricing and quick rate assistance.",
    points: ["Direct rate guidance", "No booking confusion", "Fast confirmation"],
    imageIndex: 0,
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Stay Support",
    description:
      "Convenient accommodation support for business guests, company staff and project teams.",
    points: ["GST invoice support", "Multiple room booking", "Flexible stay plans"],
    imageIndex: 1,
  },
  {
    icon: Users,
    title: "Group Reservations",
    description:
      "Smooth coordination for family functions, staff stays, event guests and group visits.",
    points: ["Group room assistance", "Direct coordination", "Suitable hotel guidance"],
    imageIndex: 2,
  },
  {
    icon: CalendarCheck,
    title: "Long Stay Assistance",
    description:
      "Practical stay options for guests needing weekly, monthly or extended room support.",
    points: ["Extended stay help", "Clean rooms", "Prime location access"],
    imageIndex: 0,
  },
];

const amenityHighlights = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Clock, label: "24x7 Reception" },
  { icon: MapPin, label: "Prime Locations" },
  { icon: Car, label: "Parking Support" },
  { icon: BedDouble, label: "Clean Rooms" },
  { icon: Users, label: "Family Friendly" },
];

const bookingSteps = [
  "Choose your hotel",
  "Call or WhatsApp",
  "Confirm availability",
  "Check in comfortably",
];

const offersSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/offers#collectionpage`,
  url: `${siteUrl}/offers`,
  name: "Hotel Offers in Hyderabad",
  description:
    "Direct booking benefits, corporate stay support, group reservations and long stay assistance at Supraja Hotels in Hyderabad.",
  isPartOf: {
    "@id": `${siteUrl}#website`,
  },
  about: {
    "@type": "Thing",
    name: "Hotel Offers in Hyderabad",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: directBenefits.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.title,
      description: offer.description,
    })),
  },
};

export default function OffersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(offersSchema),
        }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-25">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Hotel Offers in Hyderabad by Supraja Hotels"
              fill
              isHero
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />

          <div className="container-custom relative grid gap-12 px-4 py-20 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-28">
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200">
                <BadgePercent className="mr-2 h-4 w-4" />
                Direct Booking Benefits
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Book Direct. Stay Better. Save More.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Get the best available rates, instant assistance and direct
                booking support across Supraja Hotels near Hitech City,
                Madhapur and Chandanagar.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Best Available Rates",
                  "Instant Confirmation",
                  "WhatsApp Booking",
                  "Corporate & Group Stays",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20I%20would%20like%20to%20know%20today%27s%20best%20available%20room%20rate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Booking
                </a>

                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {hotels.map((hotel) => (
                <div
                  key={hotel.slug}
                  className="relative h-48 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl"
                >
                  <SmartImage
                    src={hotel.images.hero}
                    alt={`${hotel.name} hotel offer`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}

              <div className="flex min-h-48 flex-col justify-center rounded-3xl border border-amber-300/20 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm font-semibold text-amber-200">
                  Direct Booking Desk
                </p>
                <p className="mt-2 text-3xl font-bold">9550776161</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Call or WhatsApp for current availability and direct rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Why Book Direct
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Better Clarity. Faster Confirmation.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Speak directly with our hotel team for room availability, tariffs,
              location guidance and stay support.
            </p>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-2">
            {directBenefits.map((offer) => {
              const Icon = offer.icon;
              const image =
                hotels[offer.imageIndex]?.images.hero || hotels[0].images.hero;

              return (
                <article
                  key={offer.title}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-60">
                    <SmartImage
                      src={image}
                      alt={`${offer.title} at Supraja Hotels`}
                      width={900}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-bold text-slate-950">
                      {offer.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {offer.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {offer.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm font-semibold text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="container-custom px-4 py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="relative h-[420px] overflow-hidden rounded-[2rem] shadow-xl">
                <SmartImage
                  src={hotels[0].images.hero}
                  alt="Comfortable rooms at Supraja Hotels Hyderabad"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Stay Comfortably
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Rooms Designed for Practical City Stays
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Supraja Hotels offers clean rooms, essential amenities and
                  prime access for business travellers, families, corporate
                  guests and short-stay visitors across Hyderabad.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Business travel",
                    "Family stays",
                    "Group bookings",
                    "Long stays",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/hotels"
                    className="inline-flex justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Explore Hotels
                  </Link>

                  <a
                    href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20I%20would%20like%20to%20book%20a%20room"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center rounded-full border border-slate-300 px-7 py-4 text-sm font-bold text-slate-950 transition hover:border-green-600 hover:text-green-700"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Locations
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Choose Your Preferred Supraja Hotel
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Three well-connected hotels across Hitech City, Madhapur and
              Chandanagar with direct booking assistance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {hotels.map((hotel) => (
              <Link
                key={hotel.slug}
                href={`/hotels/${hotel.slug}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <SmartImage
                    src={hotel.images.hero}
                    alt={`${hotel.name} in ${hotel.location}`}
                    width={700}
                    height={500}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {hotel.location}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {hotel.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Direct booking support near{" "}
                    {hotel.seo.targetLocations.slice(0, 3).join(", ")}.
                  </p>

                  <p className="mt-5 text-sm font-bold text-blue-700">
                    Check Availability
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="container-custom px-4 py-14">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {amenityHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
                  >
                    <Icon className="mx-auto h-7 w-7 text-amber-300" />
                    <p className="mt-3 text-sm font-bold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                Booking Process
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Reserve Your Room in Simple Steps
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                For direct hotel booking in Hyderabad, our team helps you choose
                the right property, confirm availability and complete your room
                reservation quickly.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-4">
              {bookingSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-900">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-custom px-4 pb-16 lg:pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="absolute inset-0 opacity-20">
              <SmartImage
                src="/images/homepage/hero.webp"
                alt="Book Supraja Hotels directly"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get Today&apos;s Best Available Rate
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Call or WhatsApp Supraja Hotels for current room availability,
                direct pricing, corporate stays and group reservations.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20please%20share%20today%27s%20best%20available%20room%20rate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Booking
                </a>

                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
