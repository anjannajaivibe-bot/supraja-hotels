import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://www.suprajahotels.com";

export const metadata: Metadata = {
  title: "Contact Supraja Hotels | Direct Hotel Booking Hyderabad",
  description:
    "Contact Hotel Supraja Cyber View, Hotel Supraja Residency or Hotel Supraja Lodge directly by phone or WhatsApp for current room availability and rates.",
  keywords: [
    "Contact Supraja Hotels",
    "Direct hotel booking Hyderabad",
    "Hotel booking Hyderabad",
    "Hotel Supraja Cyber View contact",
    "Hotel Supraja Residency contact",
    "Hotel Supraja Lodge contact",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Supraja Hotels | Direct Booking Hyderabad",
    description:
      "Choose your Supraja Hotel and contact the property directly for current room availability and rates.",
    url: "/contact",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Supraja Hotels in Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Supraja Hotels | Direct Booking Hyderabad",
    description:
      "Call or WhatsApp the relevant Supraja Hotel for current availability and rates.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelNotes: Record<string, string> = {
  "supraja-cyber-view":
    "For stays in Madhapur with access to HITEC City, Shilparamam, Shilpakala Vedika and nearby business areas.",
  "supraja-residency":
    "For stays in Chandanagar near BHEL, Serilingampally, Nallagandla, Miyapur and Lingampally.",
  "supraja-lodge":
    "A value-focused Chandanagar option for short stays, work trips and family visits.",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteUrl}/contact#contactpage`,
  url: `${siteUrl}/contact`,
  name: "Contact Supraja Hotels",
  description: "Direct contact details for Supraja Hotels in Hyderabad.",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#organization` },
  mainEntity: hotels.map((hotel) => ({
    "@type": "Hotel",
    "@id": `${siteUrl}/hotels/${hotel.slug}#hotel`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-30">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Supraja Hotels in Hyderabad"
              fill
              isHero
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/78 to-slate-950/45" />

          <div className="container-custom relative grid gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200">
                <Phone className="mr-2 h-4 w-4" />
                Direct Hotel Contact
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Contact the Right Supraja Hotel Directly
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Choose your preferred property and call or WhatsApp the hotel team to check current room availability, rates and stay requirements.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
                {["Property-specific numbers", "Current availability check", "Current rate enquiry", "WhatsApp support"].map((item) => (
                  <span key={item} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {hotels.slice(0, 2).map((hotel) => (
                <div key={hotel.slug} className="relative h-56 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl">
                  <SmartImage src={hotel.images.hero} alt={`${hotel.name} in ${hotel.location}`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
              ))}
              <div className="relative col-span-2 h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl">
                <SmartImage src={hotels[2]?.images.hero || "/images/homepage/hero.webp"} alt="Hotel Supraja Lodge in Chandanagar" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Choose a Property</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Direct Contact for All Three Hotels</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Use the property-specific contact below so your enquiry reaches the right hotel directly.</p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {hotels.map((hotel) => (
              <article key={hotel.slug} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-60">
                  <SmartImage src={hotel.images.hero} alt={`${hotel.name} in ${hotel.location}`} width={700} height={500} className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-950 shadow">{hotel.location}</div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-950">{hotel.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{hotelNotes[hotel.slug]}</p>

                  <div className="mt-5 space-y-4 text-sm text-slate-700">
                    <p className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-700" /><span>{hotel.address}</span></p>
                    <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-amber-700" /><a href={`tel:+91${hotel.phone}`} className="font-bold text-slate-950 hover:text-blue-700">{hotel.phone}</a></p>
                    <p className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 shrink-0 text-amber-700" /><a href={`mailto:${hotel.email}`} className="break-all font-semibold text-slate-700 hover:text-blue-700">{hotel.email}</a></p>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <a href={`tel:+91${hotel.phone}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">
                      <Phone size={18} /> Call Hotel
                    </a>
                    <a
                      href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle size={18} /> Check on WhatsApp
                    </a>
                    <Link href={`/hotels/${hotel.slug}`} className="inline-flex w-full justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-blue-700 hover:text-blue-700">
                      View Hotel Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-slate-50">
          <div className="container-custom px-4 py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Before You Contact</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Share the Details That Help Us Answer Faster</h2>
                <p className="mt-5 max-w-2xl leading-8 text-slate-600">When calling or messaging, share your preferred hotel, check-in date, check-out date and number of guests. The hotel team can then check the relevant room availability.</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {["Preferred hotel", "Check-in and check-out dates", "Number of guests", "Number of rooms required"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                <BedDouble className="h-12 w-12 text-amber-600" />
                <h3 className="mt-5 text-2xl font-bold text-slate-950">Still Deciding?</h3>
                <p className="mt-3 leading-7 text-slate-600">Compare locations, room photos and property details before contacting the hotel.</p>
                <div className="mt-6 grid gap-3">
                  <Link href="/hotels" className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white">Compare Hotels</Link>
                  <Link href="/gallery" className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-bold text-slate-950">View Gallery</Link>
                  <Link href="/offers" className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-bold text-slate-950">Rate & Stay Enquiries</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
