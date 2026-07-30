import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "Contact Us | Hotel Booking in Hyderabad",
  description:
    "Contact Supraja Hotels for direct hotel booking in Hyderabad near Hitech City, Madhapur, Chandanagar, BHEL and Miyapur.",
  keywords: [
    "Hotel Booking in Hyderabad",
    "Contact Supraja Hotels",
    "Direct hotel booking Hyderabad",
    "Hotels near Hitech City",
    "Hotels in Madhapur",
    "Hotels in Chandanagar",
    "Hotels near BHEL",
    "Hotels near Miyapur",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Supraja Hotels | Hotel Booking in Hyderabad",
    description:
      "Call or WhatsApp Supraja Hotels for clean rooms, prime locations and direct booking support in Hyderabad.",
    url: "/contact",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Supraja Hotels for Hotel Booking in Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Supraja Hotels | Hotel Booking in Hyderabad",
    description:
      "Direct hotel booking support near Hitech City, Madhapur and Chandanagar.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelNotes: Record<string, string> = {
  "supraja-cyber-view":
    "Best suited for business travellers, IT professionals and short stays near Hitech City.",
  "supraja-residency":
    "A convenient stay for families, business guests and visitors near Chandanagar and BHEL.",
  "supraja-lodge":
    "A practical, value-focused option for guests looking for easy access around Chandanagar.",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteUrl}/contact#contactpage`,
  url: `${siteUrl}/contact`,
  name: "Contact Supraja Hotels",
  description:
    "Contact Supraja Hotels for direct hotel booking in Hyderabad.",
  isPartOf: {
    "@id": `${siteUrl}#website`,
  },
  about: {
    "@id": `${siteUrl}#organization`,
  },
  mainEntity: hotels.map((hotel) => ({
    "@type": "Hotel",
    name: hotel.name,
    telephone: `+91-${hotel.phone}`,
    email: hotel.email,
    url: `${siteUrl}/hotels/${hotel.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.state,
      postalCode: hotel.postalCode,
      addressCountry: "IN",
    },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-25">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Supraja Hotels in Hyderabad"
              fill
              isHero
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />

          <div className="container-custom relative px-4 py-16 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200">
                  <Phone className="mr-2 h-4 w-4" />
                  Direct Booking Desk
                </span>

                <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Book Your Stay Directly with Supraja Hotels
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Clean rooms, prime Hyderabad locations and quick reservation
                  support near Hitech City, Madhapur, Chandanagar, BHEL and
                  Miyapur.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="tel:+919550776161"
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call for Availability
                  </a>

                  <a
                    href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20I%20would%20like%20to%20book%20a%20room"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Book on WhatsApp
                  </a>
                </div>

                <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  {["Instant Assistance", "Direct Hotel Support", "Prime Locations"].map(
                    (item) => (
                      <span key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-300" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {hotels.slice(0, 2).map((hotel) => (
                  <div
                    key={hotel.slug}
                    className="relative h-56 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl"
                  >
                    <SmartImage
                      src={hotel.images.hero}
                      alt={`${hotel.name} contact image`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}

                <div className="relative col-span-2 h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl">
                  <SmartImage
                    src={hotels[2]?.images.hero || "/images/homepage/hero.webp"}
                    alt="Supraja Hotels contact booking"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Contact Hotels
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Choose the Right Supraja Hotel
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Select your preferred location and connect directly for room
              availability, tariffs and booking confirmation.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {hotels.map((hotel) => (
              <div
                key={hotel.slug}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-60">
                  <SmartImage
                    src={hotel.images.hero}
                    alt={`${hotel.name} in ${hotel.location}`}
                    width={700}
                    height={500}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-950 shadow">
                    {hotel.location}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-950">
                    {hotel.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {hotelNotes[hotel.slug]}
                  </p>

                  <div className="mt-5 space-y-4 text-sm text-slate-700">
                    <p className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                      <span>{hotel.address}</span>
                    </p>

                    <p className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-amber-700" />
                      <a
                        href={`tel:+91${hotel.phone}`}
                        className="font-bold text-slate-950 hover:text-blue-700"
                      >
                        {hotel.phone}
                      </a>
                    </p>

                    <p className="flex items-start gap-3">
                      <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
                      <a
                        href={`mailto:${hotel.email}`}
                        className="break-all font-semibold text-slate-700 hover:text-blue-700"
                      >
                        {hotel.email}
                      </a>
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <a
                      href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20${encodeURIComponent(
                        hotel.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle size={18} />
                      WhatsApp Booking
                    </a>

                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="inline-flex w-full justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      View Hotel Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="container-custom px-4 py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Booking Support
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Simple Reservations. Better Guidance.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  Speak directly with Supraja Hotels for location guidance,
                  room availability, group stays, corporate bookings and quick
                  confirmation.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Business stays near Hitech City",
                    "Family stays in Chandanagar",
                    "Group room booking support",
                    "Direct room availability check",
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
              </div>

              <div className="rounded-[2rem] border border-amber-200 bg-white p-8 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      Quick Links
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Helpful pages for faster booking decisions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    { label: "Explore Supraja Hotels", href: "/hotels" },
                    { label: "View Stay Offers", href: "/offers" },
                    { label: "See Hotel Photos", href: "/gallery" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-slate-200 p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <a
                    href="https://www.telanganatourism.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-slate-200 p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Telangana Tourism
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
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
              <BedDouble className="mx-auto h-12 w-12 text-amber-300" />

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Need Help Choosing the Right Hotel?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Tell us your location preference, stay dates and room
                requirement. Our team will suggest the most suitable Supraja
                Hotel.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>

                <a
                  href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20please%20help%20me%20choose%20the%20right%20hotel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
