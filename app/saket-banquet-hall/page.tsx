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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://suprajahotels.com";

const phone = "9346316161";
const pageUrl = `${siteUrl}/saket-banquet-hall`;
const socialImage = `${siteUrl}/images/social/saket-banquet-hall-og.jpg`;

const whatsappUrl =
  "https://wa.me/919346316161?text=Hi%20I%20would%20like%20to%20check%20availability%20for%20Saket%20Banquet%20Hall%20at%20Hotel%20Supraja%20Residency";

export const metadata: Metadata = {
  title: "Saket Banquet Hall in Chandanagar",
  description:
    "Plan family milestones, social soirees, corporate conclaves and private gatherings at Saket Banquet Hall on the exclusive second floor of Hotel Supraja Residency in Chandanagar.",
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
    canonical: pageUrl,
  },
  openGraph: {
    title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
    description:
      "An exquisite second-floor venue at Hotel Supraja Residency for family milestones, social soirees, corporate conclaves and private gatherings.",
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
      "An exquisite second-floor venue at Hotel Supraja Residency for family milestones, social soirees, corporate conclaves and private gatherings.",
    images: [socialImage],
  },
};

const venueHighlights = [
  {
    title: "Dedicated Second-Floor Venue",
    description:
      "A self-contained event precinct within Hotel Supraja Residency, ensuring complete privacy and an uninterrupted experience for your occasion.",
    icon: Building2,
  },
  {
    title: "Prime Connectivity",
    description:
      "Strategically located in Chandanagar, with seamless access from BHEL, Miyapur, Serilingampally and adjacent neighbourhoods.",
    icon: MapPin,
  },
  {
    title: "Versatile Event Capabilities",
    description:
      "Ideally suited for engagements, birthday galas, anniversary celebrations, naming ceremonies, corporate seminars, training workshops and private festivities.",
    icon: CalendarDays,
  },
  {
    title: "Luxury Accommodation On-Site",
    description:
      "For guests travelling from outside the city, Hotel Supraja Residency offers elegant, well-appointed rooms available at a separate tariff, eliminating the need to coordinate external hotel arrangements.",
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
  "Private Celebrations",
];

const galleryImages = [
  {
    src: "/images/banquet-hall/banquet-hall-seating.webp",
    alt: "Seating arrangement inside Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-overview.webp",
    alt: "Wide interior view of Saket Banquet Hall in Chandanagar",
  },
  {
    src: "/images/banquet-hall/banquet-hall-stage.webp",
    alt: "Stage area at Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-main.webp",
    alt: "Main floor area inside Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-conference.webp",
    alt: "Conference-style seating at Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-lobby.webp",
    alt: "Open event area at Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-overview-2.webp",
    alt: "Open floor layout at Saket Banquet Hall",
  },
  {
    src: "/images/banquet-hall/banquet-hall-event-stage.webp",
    alt: "Event stage at Saket Banquet Hall in Hotel Supraja Residency",
  },
];

const curatedConveniences = [
  "Private, exclusive event floor with controlled access",
  "Excellent connectivity from all major Chandanagar thoroughfares",
  "Premium guest rooms available within the same premises, chargeable separately",
  "Equally suited for social festivities and professional engagements",
  "Personalised event coordination from our experienced hospitality team",
  "Bespoke arrangements crafted to align with your specific programme requirements",
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
      "Saket Banquet Hall is an exclusive second-floor event venue inside Hotel Supraja Residency in Chandanagar, Hyderabad.",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(banquetSchema),
        }}
      />

      <section className="relative min-h-[620px] overflow-hidden bg-slate-950">
        <SmartImage
          src="/images/banquet-hall/banquet-hall-seating.webp"
          alt="Saket Banquet Hall in Chandanagar"
          fill
          isHero
          className="object-cover"
          sizes="100vw"
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/images/hero-vids/saket-banquet-hall-hero-video.webm"
            type="video/webm"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />

        <div className="container-custom relative flex min-h-[620px] items-center px-4 py-20">
          <div className="max-w-3xl text-white">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">
              Saket Banquet Hall | Chandanagar
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              An Exquisite Venue for Life&apos;s Most Meaningful Celebrations
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Perched on the exclusive second floor of Hotel Supraja Residency,
              our banquet hall provides a refined and versatile setting for
              family milestones, social soirees, corporate conclaves and
              intimate private gatherings.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Check Availability
              </a>

              <a
                href={`tel:+91${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                <Phone size={18} />
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Venue Distinction
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              An Exclusive Enclave, Strategically Positioned
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {venueHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom grid gap-10 lg:grid-cols-[44%_56%] lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Premium Hospitality
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              The Perfect Synergy of Event Space and Premium Hospitality
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              Saket Banquet Hall seamlessly integrates a distinguished event
              venue with the world-class hospitality of Hotel Supraja
              Residency. While the hall serves as the centrepiece of your
              celebration, the hotel offers discerning guests the option to
              retire to luxurious rooms, ensuring their comfort and convenience
              throughout their stay.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Our dedicated team is on hand to assist with availability checks,
              customised layouts, catering selections and every nuanced detail
              that elevates your event from memorable to extraordinary.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Venue Gallery
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Explore Saket Banquet Hall
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              View the stage, seating arrangements and open event areas before
              planning your celebration.
            </p>
          </div>

          <div className="mt-10">
            <div className="group relative overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
              <div className="relative aspect-[16/7]">
                <SmartImage
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="100vw"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.slice(1).map((image) => (
                <div
                  key={image.src}
                  className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <SmartImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Occasion Planning
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              A Curated Space for Every Occasion
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-600">
              The hall is meticulously adapted to reflect the nature of your
              programme, guest profile and preferred ambience. Whether formal
              or festive, we tailor the environment to your exact
              specifications.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Social Celebrations
              </h3>

              <div className="mt-6 space-y-4">
                {socialCelebrations.map((event) => (
                  <div key={event} className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
                    <span className="font-semibold text-slate-700">{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Professional Events
              </h3>

              <div className="mt-6 space-y-4">
                {professionalEvents.map((event) => (
                  <div key={event} className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
                    <span className="font-semibold text-slate-700">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Guest Convenience
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
              Curated Conveniences for Hosts and Guests Alike
            </h2>

            <div className="mt-8 space-y-4">
              {curatedConveniences.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                  <p className="leading-7 text-slate-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">
              Location
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Inside Hotel Supraja Residency
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              Saket Banquet Hall occupies the dedicated second floor of Hotel
              Supraja Residency in Chandanagar, Hyderabad.
            </p>

            <p className="mt-5 leading-8 text-slate-300">
              The property is conveniently accessible from BHEL, Miyapur,
              Serilingampally, Nallagandla and surrounding localities.
            </p>

            <Link
              href="/hotels/supraja-residency"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
            >
              Explore Hotel Supraja Residency
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Reserve Your Date Today
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-300">
              Your preferred date is just a conversation away. Reach out to our
              team to check availability, discuss your event vision and begin
              the booking process. No site visit is required. We&apos;ll guide
              you through every detail, from seating to catering, so your
              celebration is seamless from start to finish.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={`tel:+91${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
              >
                <Phone size={17} />
                Call {phone}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={17} />
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
