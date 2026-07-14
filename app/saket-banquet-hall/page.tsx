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
  "https://wa.me/919346316161?text=Hi%20I%20would%20like%20to%20check%20availability%20for%20Saket%20Banquet%20Hall%20at%20Hotel%20Supraja%20Residency";

export const metadata: Metadata = {
  title: "Saket Banquet Hall in Chandanagar | Supraja Hotels",
  description:
    "Plan family celebrations, social functions and corporate gatherings at Saket Banquet Hall, located on the dedicated second floor of Hotel Supraja Residency in Chandanagar.",
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
      "A dedicated second-floor venue at Hotel Supraja Residency for family celebrations, social functions and corporate gatherings.",
    url: `${siteUrl}/saket-banquet-hall`,
    siteName: "Supraja Hotels",
    images: [
      {
        url: `${siteUrl}/images/banquet-hall/hero.webp`,
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
      "A dedicated second-floor venue at Hotel Supraja Residency for family celebrations, social functions and corporate gatherings.",
    images: [`${siteUrl}/images/banquet-hall/hero.webp`],
  },
};

const venueHighlights = [
  {
    title: "Dedicated Second Floor",
    description:
      "A self-contained event area within Hotel Supraja Residency, offering a more focused setting for your gathering.",
    icon: Building2,
  },
  {
    title: "Well-Connected Location",
    description:
      "Conveniently placed in Chandanagar with access from BHEL, Miyapur, Serilingampally and nearby neighbourhoods.",
    icon: MapPin,
  },
  {
    title: "Flexible Event Use",
    description:
      "Suitable for family celebrations, social occasions, business meetings, training sessions and private functions.",
    icon: CalendarDays,
  },
  {
    title: "Rooms in the Same Property",
    description:
      "Guests travelling from outside the city can stay at Hotel Supraja Residency without arranging a separate hotel.",
    icon: Users,
  },
];

const eventTypes = [
  "Engagements",
  "Birthday Celebrations",
  "Anniversary Functions",
  "Naming Ceremonies",
  "Family Gatherings",
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

const practicalBenefits = [
  "Private event space on the second floor",
  "Direct access from key Chandanagar areas",
  "Guest rooms available within the property",
  "Suitable for social and professional occasions",
  "Personal booking assistance from the hotel team",
  "Arrangements discussed according to your event needs",
];

export default function SaketBanquetHallPage() {
  const banquetSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${siteUrl}/saket-banquet-hall#venue`,
    name: "Saket Banquet Hall",
    url: `${siteUrl}/saket-banquet-hall`,
    image: [
      `${siteUrl}/images/banquet-hall/hero.webp`,
      `${siteUrl}/images/banquet-hall/banquet-hall-seating.webp`,
      `${siteUrl}/images/banquet-hall/banquet-hall-stage.webp`,
    ],
    description:
      "Saket Banquet Hall is a dedicated second-floor event venue inside Hotel Supraja Residency in Chandanagar, Hyderabad.",
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

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />

        <div className="container-custom relative flex min-h-[620px] items-center px-4 py-20">
          <div className="max-w-3xl text-white">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-300">
              Saket Banquet Hall | Chandanagar
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              A Welcoming Venue for Meaningful Celebrations
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Located on the dedicated second floor of Hotel Supraja Residency,
              Saket Banquet Hall offers a comfortable setting for family
              occasions, social functions, corporate meetings and private
              gatherings.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-100">
              {[
                "Dedicated Event Floor",
                "Inside Hotel Supraja Residency",
                "Chandanagar Location",
                "Direct Booking Support",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
                >
                  ✓ {item}
                </span>
              ))}
            </div>

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

      <section className="bg-white px-4 py-14 md:py-16">
        <div className="container-custom">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {venueHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-slate-950">
                    {item.title}
                  </h2>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-14 md:py-16">
        <div className="container-custom grid gap-10 lg:grid-cols-[44%_56%] lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              About the Hall
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              A Practical Setting with the Convenience of a Hotel
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              Saket Banquet Hall brings together an event venue and hotel
              accommodation in one address. The hall provides a dedicated area
              for your occasion, while Hotel Supraja Residency offers a
              convenient stay option for visiting relatives, colleagues and
              other guests.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Our team can help you check date availability and discuss the
              arrangements needed for your programme.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 md:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Venue Gallery
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              See the Hall Before You Plan
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Explore the stage, seating arrangements and open floor areas to
              understand how the venue can suit your occasion.
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

      <section className="bg-slate-50 px-4 py-14 md:py-16">
        <div className="container-custom grid gap-10 lg:grid-cols-[42%_58%] lg:items-start">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Suitable Occasions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              A Versatile Space for Different Gatherings
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              The hall can be arranged according to the nature of your
              programme, guest profile and preferred seating style.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {eventTypes.map((event) => (
              <div
                key={event}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <Sparkles className="h-5 w-5 shrink-0 text-amber-600" />
                <span className="font-semibold text-slate-800">{event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 md:py-16">
        <div className="container-custom grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-10">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Practical Advantages
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
              Thoughtful Convenience for Hosts and Guests
            </h2>

            <div className="mt-8 space-y-4">
              {practicalBenefits.map((benefit) => (
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
              Saket Banquet Hall is on the dedicated second floor of Hotel
              Supraja Residency in Chandanagar, Hyderabad.
            </p>

            <p className="mt-5 leading-8 text-slate-300">
              The property is accessible from BHEL, Gangaram, Miyapur,
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

      <section className="bg-white px-4 pb-20 pt-8">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Check Your Preferred Date
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
              Speak with our team for availability, event requirements and
              booking assistance.
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
