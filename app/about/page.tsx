import type { Metadata } from "next";
import Link from "next/link";

import SmartImage from "@/components/SmartImage";

const siteUrl = "https://www.suprajahotels.com";

export const metadata: Metadata = {
  title: "About Supraja Hotels | Hotels in Hyderabad",
  description:
    "Learn about Supraja Hotels and our three Hyderabad properties in Madhapur and Chandanagar, with direct booking support by phone or WhatsApp.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Supraja Hotels | Hotels in Hyderabad",
    description:
      "Discover Supraja Hotels, our Hyderabad properties and our focus on clean rooms, convenient locations and direct guest support.",
    url: "/about",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "About Supraja Hotels in Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Supraja Hotels | Hotels in Hyderabad",
    description:
      "Three Hyderabad hotel properties with direct booking support in Madhapur and Chandanagar.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const promises = [
  {
    title: "Clean, Comfortable Rooms",
    description:
      "Practical rooms maintained for business visits, family stays and short Hyderabad trips.",
  },
  {
    title: "Convenient Locations",
    description:
      "Properties in Madhapur and Chandanagar with access to nearby business, residential and transport areas.",
  },
  {
    title: "Direct Booking Support",
    description:
      "Call or WhatsApp the relevant hotel to check current availability, room rates and stay requirements.",
  },
  {
    title: "Hotel Team Assistance",
    description:
      "Speak directly with the property team when you need information before or during your stay.",
  },
];

const hotels = [
  {
    name: "Hotel Supraja Cyber View",
    location: "Madhapur, Hitech City",
    description:
      "A Madhapur stay with convenient access to HITEC City Metro, Shilparamam, Shilpakala Vedika and nearby business areas.",
    href: "/hotels/supraja-cyber-view",
  },
  {
    name: "Hotel Supraja Residency",
    location: "Chandanagar",
    description:
      "A Chandanagar property serving families, professionals and visitors travelling around BHEL, Serilingampally, Nallagandla and Miyapur.",
    href: "/hotels/supraja-residency",
  },
  {
    name: "Hotel Supraja Lodge",
    location: "Chandanagar",
    description:
      "A value-focused Chandanagar stay for short visits, work trips and guests seeking practical accommodation.",
    href: "/hotels/supraja-lodge",
  },
];

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: "About Supraja Hotels",
    description:
      "Learn about Supraja Hotels and its Hyderabad properties in Madhapur and Chandanagar.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.2),transparent_34%)]" />

        <div className="container-custom relative grid gap-10 lg:grid-cols-[55%_45%] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">
              About Supraja Hotels
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Three Hyderabad Hotels. Direct Guest Support.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Supraja Hotels operates three properties across Madhapur and
              Chandanagar. We focus on practical comfort, convenient locations
              and direct communication with guests before they confirm a stay.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/hotels" className="rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                Explore Our Hotels
              </Link>
              <Link href="/contact" className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                Contact Hotels
              </Link>
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:h-[480px]">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Supraja Hotels properties in Hyderabad"
              fill
              isHero
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Who We Are</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Hyderabad Stays Across Madhapur and Chandanagar
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-600">
              Hotel Supraja Cyber View serves guests visiting Madhapur and HITEC City. Hotel Supraja Residency and Hotel Supraja Lodge serve guests looking for accommodation in Chandanagar and nearby areas.
            </p>
            <p className="mt-5 leading-8 text-slate-600">
              Each property has its own direct phone and WhatsApp contact. Guests can check room availability, current rates and property-specific requirements with the hotel team before travelling.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Our Focus</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">What Guests Can Expect</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              Straightforward accommodation information, practical rooms and direct support from the relevant hotel.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {promises.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Our Hotels</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Choose the Property That Fits Your Location</h2>
            <p className="mt-5 leading-8 text-slate-600">
              Compare the three Supraja Hotels and contact the relevant property directly for current availability.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {hotels.map((hotel) => (
              <Link key={hotel.href} href={hotel.href} className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">{hotel.location}</p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">{hotel.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{hotel.description}</p>
                <p className="mt-6 text-sm font-semibold text-blue-700 group-hover:underline">View Hotel Details</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white lg:py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Check Room Availability Directly</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
            Choose a hotel and contact its team by phone or WhatsApp for current room availability, rates and booking support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/hotels" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100">View All Hotels</Link>
            <Link href="/contact" className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700">Contact Hotels</Link>
            <Link href="/gallery" className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">View Photos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
