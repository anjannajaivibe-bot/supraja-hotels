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

const siteUrl = "https://suprajahotels.com";
const phone = "9346316161";
const whatsappUrl =
  "https://wa.me/919346316161?text=Hi%20I%20would%20like%20to%20know%20more%20about%20Saket%20Banquet%20Hall%20at%20Hotel%20Supraja%20Residency";

export const metadata: Metadata = {
  title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
  description:
    "Host family functions, celebrations and corporate gatherings at Saket Banquet Hall, located on the dedicated second floor of Hotel Supraja Residency in Chandanagar.",
  keywords: [
    "Saket Banquet Hall",
    "Banquet Hall in Chandanagar",
    "Function Hall in Chandanagar",
    "Party Hall in Chandanagar",
    "Banquet Hall near BHEL",
    "Event Venue in Chandanagar",
    "Hotel Supraja Residency Banquet Hall",
  ],
  alternates: {
    canonical: `${siteUrl}/saket-banquet-hall`,
  },
  openGraph: {
    title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
    description:
      "A dedicated second-floor banquet venue at Hotel Supraja Residency for family functions, celebrations and corporate gatherings.",
    url: `${siteUrl}/saket-banquet-hall`,
    siteName: "Supraja Hotels",
    images: [
      {
        url: `${siteUrl}/images/homepage/hero.webp`,
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
      "A dedicated second-floor banquet venue at Hotel Supraja Residency for family functions, celebrations and corporate gatherings.",
    images: [`${siteUrl}/images/homepage/hero.webp`],
  },
};

const eventTypes = [
  "Birthday Celebrations",
  "Engagements",
  "Anniversary Events",
  "Naming Ceremonies",
  "Family Gatherings",
  "Corporate Meetings",
  "Training Sessions",
  "Private Celebrations",
];

const highlights = [
  {
    title: "Dedicated Second Floor",
    description:
      "The banquet hall occupies a dedicated floor inside Hotel Supraja Residency, giving your event a more private and organised setting.",
    icon: Building2,
  },
  {
    title: "Convenient Chandanagar Location",
    description:
      "A well-connected venue for guests travelling from Chandanagar, BHEL, Miyapur, Serilingampally and nearby areas.",
    icon: MapPin,
  },
  {
    title: "Suitable for Different Occasions",
    description:
      "A flexible venue for family functions, social celebrations, meetings, training programmes and private gatherings.",
    icon: CalendarDays,
  },
  {
    title: "Hotel Stay in the Same Property",
    description:
      "Outstation family members and event guests can stay at Hotel Supraja Residency without travelling to another location.",
    icon: Users,
  },
];

const venueBenefits = [
  "Dedicated event space on the second floor",
  "Convenient access from major Chandanagar locations",
  "Hotel rooms available within the same property",
  "Suitable for family, social and business events",
  "Direct booking assistance from the hotel team",
  "Flexible event planning based on your requirements",
];

export default function SaketBanquetHallPage() {
  const banquetSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${siteUrl}/saket-banquet-hall#venue`,
    name: "Saket Banquet Hall",
    url: `${siteUrl}/saket-banquet-hall`,
    description:
      "Saket Banquet Hall is a dedicated second-floor event venue located inside Hotel Supraja Residency in Chandanagar, Hyderabad.",
    telephone: `+91${phone}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chandanagar",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": "Hotel",
      name: "Hotel Supraja Residency",
      url: `${siteUrl}/hotels/supraja-residency`,
    },
  };

  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(banquetSchema) }}
      />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.2),transparent_34%)]" />

        <div className="container-custom relative grid gap-12 lg:grid-cols-[52%_48%] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">
              Saket Banquet Hall | Chandanagar
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              A Comfortable Venue for Your Special Moments
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Saket Banquet Hall is located on the dedicated second floor of
              Hotel Supraja Residency in Chandanagar. It offers a convenient
              setting for family functions, celebrations, corporate meetings
              and private gatherings.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
              {["Dedicated Second Floor", "Inside Hotel Supraja Residency", "Chandanagar Location", "Direct Event Enquiries"].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  ✓ {item}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
                <MessageCircle size={18} />
                Enquire on WhatsApp
              </a>

              <a href={`tel:+91${phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>

          <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:h-[520px]">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Saket Banquet Hall at Hotel Supraja Residency in Chandanagar"
              fill
              isHero
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">About the Venue</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              A Dedicated Event Space Within Hotel Supraja Residency
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              Saket Banquet Hall gives families, professionals and organisers a practical venue in the heart of Chandanagar. Since the hall is located inside Hotel Supraja Residency, event guests can also benefit from accommodation within the same property.
            </p>
            <p className="mt-5 leading-8 text-slate-600">
              Our team can assist with venue availability and event planning based on your occasion, guest requirements and preferred date.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Venue Highlights</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Designed for Convenient and Memorable Events</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[44%_56%] lg:items-start">
            <div>
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Events We Welcome</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">A Flexible Venue for Many Occasions</h2>
              <p className="mt-5 leading-8 text-slate-600">Speak with our team to plan the hall setup and arrangements based on the type and scale of your event.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {eventTypes.map((event) => (
                <div key={event} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
                  <span className="font-semibold text-slate-800">{event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20">
        <div className="container-custom grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Why Choose Saket Banquet Hall</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">Everything in One Convenient Location</h2>
            <div className="mt-8 space-y-4">
              {venueBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <p className="leading-7 text-slate-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">Location</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Inside Hotel Supraja Residency</h2>
            <p className="mt-5 leading-8 text-slate-300">Saket Banquet Hall is located on the dedicated second floor of Hotel Supraja Residency in Chandanagar, Hyderabad.</p>
            <p className="mt-5 leading-8 text-slate-300">The venue is conveniently accessible from BHEL, Gangaram, Miyapur, Serilingampally, Nallagandla and nearby areas.</p>
            <Link href="/hotels/supraja-residency" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100">
              View Hotel Supraja Residency
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-24">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Planning an Event in Chandanagar?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">Contact our team for hall availability, event requirements and booking assistance for Saket Banquet Hall.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={`tel:+91${phone}`} className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100">Call {phone}</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700">Enquire on WhatsApp</a>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
