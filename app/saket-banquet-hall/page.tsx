import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";

const siteUrl = "https://www.suprajahotels.com";
const phone = "9346316161";
const pageUrl = `${siteUrl}/saket-banquet-hall`;
const socialImage = `${siteUrl}/images/social/saket-banquet-hall-og.jpg`;
const whatsappUrl =
  "https://wa.me/919346316161?text=Hi%20I%20would%20like%20to%20check%20availability%20for%20Saket%20Banquet%20Hall%20at%20Hotel%20Supraja%20Residency";

export const metadata: Metadata = {
  title: "Saket Banquet Hall in Chandanagar",
  description:
    "Saket Banquet Hall at Hotel Supraja Residency in Chandanagar for family functions, celebrations, meetings and private events. Call or WhatsApp for availability.",
  keywords: [
    "Saket Banquet Hall",
    "Banquet Hall in Chandanagar",
    "Function Hall in Chandanagar",
    "Party Hall in Chandanagar",
    "Banquet Hall near BHEL",
    "Event Venue in Chandanagar",
    "Hotel Supraja Residency Banquet Hall",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
    description:
      "View Saket Banquet Hall at Hotel Supraja Residency and contact the team directly for current date availability.",
    url: pageUrl,
    siteName: "Supraja Hotels",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Saket Banquet Hall at Hotel Supraja Residency in Chandanagar",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
    description:
      "Family functions, celebrations and meetings at Hotel Supraja Residency in Chandanagar.",
    images: [socialImage],
  },
};

const venueHighlights = [
  {
    title: "Inside Hotel Supraja Residency",
    description:
      "The banquet hall is located on the second floor of Hotel Supraja Residency in Chandanagar.",
    icon: Building2,
  },
  {
    title: "Chandanagar Location",
    description:
      "Convenient for guests travelling from Chandanagar, BHEL, Serilingampally, Nallagandla and Miyapur.",
    icon: MapPin,
  },
  {
    title: "Flexible Event Use",
    description:
      "Suitable for engagements, birthdays, anniversaries, naming ceremonies, meetings, training sessions and private gatherings.",
    icon: CalendarDays,
  },
  {
    title: "Rooms in the Same Property",
    description:
      "Hotel Supraja Residency rooms are available separately for guests who also need accommodation, subject to availability.",
    icon: Users,
  },
];

const socialCelebrations = [
  "Engagements",
  "Birthday Celebrations",
  "Anniversary Functions",
  "Naming Ceremonies",
  "Family Gatherings",
];

const professionalEvents = [
  "Corporate Meetings",
  "Training Sessions",
  "Private Gatherings",
];

const galleryImages = [
  { src: "/images/banquet-hall/banquet-hall-seating.webp", alt: "Seating arrangement inside Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-overview.webp", alt: "Wide interior view of Saket Banquet Hall in Chandanagar" },
  { src: "/images/banquet-hall/banquet-hall-stage.webp", alt: "Stage area at Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-main.webp", alt: "Main floor area inside Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-conference.webp", alt: "Conference-style seating at Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-lobby.webp", alt: "Open event area at Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-overview-2.webp", alt: "Open floor layout at Saket Banquet Hall" },
  { src: "/images/banquet-hall/banquet-hall-event-stage.webp", alt: "Event stage at Saket Banquet Hall in Hotel Supraja Residency" },
];

const conveniences = [
  "Second-floor event space inside Hotel Supraja Residency",
  "Direct availability enquiry by phone or WhatsApp",
  "Hotel rooms available separately, subject to availability",
  "Suitable for social and professional events",
  "Location access from nearby Chandanagar areas",
  "Event details can be discussed directly with the property team",
];

export default function SaketBanquetHallPage() {
  const banquetSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${pageUrl}#venue`,
    name: "Saket Banquet Hall",
    url: pageUrl,
    image: [
      socialImage,
      `${siteUrl}/images/banquet-hall/banquet-hall-seating.webp`,
      `${siteUrl}/images/banquet-hall/banquet-hall-stage.webp`,
    ],
    description:
      "Saket Banquet Hall is a second-floor event venue inside Hotel Supraja Residency in Chandanagar, Hyderabad.",
    telephone: `+91-${phone}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 4-91, Above Parampara Sweets",
      addressLocality: "Chandanagar",
      addressRegion: "Telangana",
      postalCode: "500050",
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": "Hotel",
      "@id": `${siteUrl}/hotels/supraja-residency#hotel`,
      name: "Hotel Supraja Residency",
      url: `${siteUrl}/hotels/supraja-residency`,
    },
  };

  return (
    <main className="bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(banquetSchema) }} />

      <section className="relative min-h-[620px] overflow-hidden bg-slate-950">
        <SmartImage src="/images/banquet-hall/banquet-hall-seating.webp" alt="Saket Banquet Hall in Chandanagar" fill isHero className="object-cover" sizes="100vw" />
        <video autoPlay muted loop playsInline preload="metadata" poster="/images/banquet-hall/banquet-hall-seating.webp" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
          <source src="/images/hero-vids/saket-banquet-hall-hero-video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/62 to-slate-950/12" />

        <div className="container-custom relative flex min-h-[620px] items-center px-4 py-16 lg:py-20">
          <div className="max-w-3xl text-white">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">Saket Banquet Hall | Chandanagar</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">A Flexible Event Venue Inside Hotel Supraja Residency</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Plan family functions, celebrations, meetings and private gatherings at the second-floor Saket Banquet Hall in Chandanagar. Contact the property team directly to check date availability and discuss your event requirements.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                <MessageCircle size={18} /> Check Availability
              </a>
              <a href={`tel:+91${phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                <Phone size={18} /> Call {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Venue Overview</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Saket Banquet Hall in Chandanagar</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {venueHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom grid gap-10 lg:grid-cols-[44%_56%] lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Event + Stay</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Event Space with Hotel Rooms in the Same Property</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-600">
              Guests attending an event can also enquire about rooms at Hotel Supraja Residency. Room booking is separate from the banquet hall and depends on current availability.
            </p>
            <p className="mt-5 leading-8 text-slate-600">
              For event-date availability, room requirements and other property-specific details, speak directly with the hotel team before confirming your plans.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Venue Gallery</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">View Saket Banquet Hall</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">Review the stage, seating arrangements and open event areas before contacting the property.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image) => (
              <figure key={image.src} className="overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70">
                <div className="relative aspect-[4/3]">
                  <SmartImage src={image.src} alt={image.alt} fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Event Types</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Suitable for Social and Professional Gatherings</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Social Celebrations</h3>
              <div className="mt-6 space-y-4">
                {socialCelebrations.map((event) => <div key={event} className="flex items-center gap-3"><Sparkles className="h-5 w-5 shrink-0 text-amber-600" /><span className="font-semibold text-slate-700">{event}</span></div>)}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Professional Events</h3>
              <div className="mt-6 space-y-4">
                {professionalEvents.map((event) => <div key={event} className="flex items-center gap-3"><Sparkles className="h-5 w-5 shrink-0 text-amber-600" /><span className="font-semibold text-slate-700">{event}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Planning Information</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">What to Confirm with the Property</h2>
            <div className="mt-8 space-y-4">
              {conveniences.map((benefit) => <div key={benefit} className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" /><p className="leading-7 text-slate-600">{benefit}</p></div>)}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">Location</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Inside Hotel Supraja Residency</h2>
            <p className="mt-5 leading-8 text-slate-300">Plot No. 4-91, Above Parampara Sweets, Chandanagar, Hyderabad, Telangana 500050.</p>
            <p className="mt-5 leading-8 text-slate-300">The venue is suitable for guests travelling from Chandanagar and nearby BHEL, Serilingampally, Nallagandla, Miyapur and Lingampally areas.</p>
            <Link href="/hotels/supraja-residency" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100">View Hotel Supraja Residency</Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 lg:pb-20">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Check Your Preferred Date</h2>
            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-300">Contact Saket Banquet Hall directly to check current date availability and discuss your event requirements before confirming.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={`tel:+91${phone}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"><Phone size={17} />Call {phone}</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"><MessageCircle size={17} />Enquire on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
