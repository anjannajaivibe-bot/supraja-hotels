import type { Metadata } from "next";
import Link from "next/link";

import SmartImage from "@/components/SmartImage";

const siteUrl = "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "About Us | Comfortable Hotels in Hyderabad",
  description:
    "Learn about Supraja Hotels, offering clean rooms, convenient locations and friendly direct booking support across Hyderabad.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Supraja Hotels | Comfortable Hotels in Hyderabad",
    description:
      "Discover Supraja Hotels and our commitment to clean rooms, convenient locations, warm hospitality and easy direct booking.",
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
    title: "About Supraja Hotels | Comfortable Hotels in Hyderabad",
    description:
      "Discover Supraja Hotels and our commitment to clean rooms, convenient locations, warm hospitality and easy direct booking.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const promises = [
  {
    title: "Clean, Comfortable Rooms",
    description:
      "Well-maintained rooms prepared with care so every guest can relax and feel at ease.",
  },
  {
    title: "Convenient Locations",
    description:
      "Stay close to Hyderabad's major business districts, hospitals, residential areas and transport links.",
  },
  {
    title: "Easy Direct Booking",
    description:
      "Call or WhatsApp us for live availability, clear rates and quick booking confirmation.",
  },
  {
    title: "Friendly Guest Support",
    description:
      "Our team is available to help before, during and after your stay whenever you need assistance.",
  },
];

const hotels = [
  {
    name: "Hotel Supraja Cyber View",
    location: "Hitech City, Madhapur",
    description:
      "A convenient stay for business travellers visiting Hitech City, Madhapur, Gachibowli and Kondapur.",
    href: "/hotels/supraja-cyber-view",
  },
  {
    name: "Hotel Supraja Residency",
    location: "Chandanagar",
    description:
      "A comfortable choice for families, professionals and medical visitors near BHEL, Miyapur and Serilingampally.",
    href: "/hotels/supraja-residency",
  },
  {
    name: "Hotel Supraja Lodge",
    location: "Chandanagar",
    description:
      "An affordable and welcoming stay for short visits, work trips and family travel in the Chandanagar area.",
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
      "Learn about Supraja Hotels and our commitment to clean rooms, convenient locations, warm hospitality and easy direct booking across Hyderabad.",
    isPartOf: {
      "@id": `${siteUrl}#website`,
    },
    about: {
      "@id": `${siteUrl}#organization`,
    },
  };

  return (
    <main className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.2),transparent_34%)]" />

        <div className="container-custom relative grid gap-10 lg:grid-cols-[55%_45%] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">
              About Supraja Hotels
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Comfortable Stays, Genuine Hospitality
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Supraja Hotels offers clean, comfortable and well-located stays
              across Hyderabad. Whether you are travelling for work, visiting
              family or staying for a short city trip, we make your experience
              simple, welcoming and worry-free.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/hotels"
                className="rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Explore Our Hotels
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:h-[480px]">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Comfortable rooms at Supraja Hotels in Hyderabad"
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
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Hospitality Designed Around Real Guest Needs
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              We believe a good hotel stay should feel easy from the moment you
              book until the moment you check out. That is why we focus on the
              things that matter most: clean rooms, comfortable spaces,
              convenient locations and helpful service.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              With hotels in Hitech City, Madhapur and Chandanagar, Supraja
              Hotels welcomes business travellers, families, medical visitors
              and guests looking for dependable short stays across Hyderabad.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Our Promise
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              What You Can Expect Every Time
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
              We keep our promise simple: a clean room, a convenient stay and
              friendly support whenever you need it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {promises.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
              Our Hotels
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">
              Three Convenient Stays Across Hyderabad
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Choose the location that works best for your visit and enjoy the
              same focus on comfort, cleanliness and friendly service at every
              Supraja Hotel.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {hotels.map((hotel) => (
              <Link
                key={hotel.href}
                href={hotel.href}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  {hotel.location}
                </p>

                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  {hotel.name}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {hotel.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-blue-700 group-hover:underline">
                  Explore Hotel
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white lg:py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Plan Your Stay?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
            Contact Supraja Hotels directly for room availability, the best
            available rates and quick booking assistance from our team.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919550776161"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
            >
              Call Now
            </a>

            <a
              href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20Supraja%20Hotels"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Book on WhatsApp
            </a>

            <Link
              href="/hotels"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View All Hotels
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
