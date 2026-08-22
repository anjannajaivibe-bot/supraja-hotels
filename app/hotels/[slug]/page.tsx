import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  BedDouble,
} from "lucide-react";

import { amenities } from "@/data/amenities";
import { hotels } from "@/data/hotels";
import HotelGallery from "@/components/HotelGallery";
import HotelMap from "@/components/HotelMap";
import HotelSchema from "@/components/schema/HotelSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import FAQSchema from "@/components/schema/FAQSchema";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://suprajahotels.com";

const hotelOgImages: Record<string, string> = {
  "supraja-cyber-view": "/images/social/supraja-cyber-view-og.jpg",
  "supraja-residency": "/images/social/supraja-residency-og.jpg",
  "supraja-lodge": "/images/social/supraja-lodge-og.jpg",
};

const hotelHeroVideos: Record<string, string> = {
  "supraja-cyber-view":
    "/images/hero-vids/hotel-supraja-cyber-view-hero-video.webm",
  "supraja-residency":
    "/images/hero-vids/sri-supraja-residency-hero-video.webm",
  "supraja-lodge": "/images/hero-vids/hotel-supraja-lodge-hero-video.webm",
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = hotels.find((item) => item.slug === slug);

  if (!hotel) {
    return {
      title: "Hotel Not Found",
      description: "The requested hotel page could not be found.",
    };
  }

  const canonicalUrl = `${siteUrl}/hotels/${hotel.slug}`;
  const ogImageUrl = `${siteUrl}${
    hotelOgImages[hotel.slug] || "/images/social/supraja-hotels-og.jpg"
  }`;

  return {
    title: hotel.seo.metaTitle,
    description: hotel.seo.metaDescription,
    keywords: [
      hotel.seo.focusKeyword,
      ...hotel.seo.synonyms,
      ...hotel.seo.longTailKeywords,
      ...hotel.seo.targetLocations,
      ...hotel.seo.tags,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: hotel.seo.ogTitle,
      description: hotel.seo.ogDescription,
      url: canonicalUrl,
      siteName: "Supraja Hotels",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: hotel.seo.featuredImageAlt,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hotel.seo.ogTitle,
      description: hotel.seo.ogDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function HotelPage({ params }: Props) {
  const { slug } = await params;
  const hotel = hotels.find((item) => item.slug === slug);

  if (!hotel) {
    notFound();
  }

  return (
    <>
      <HotelSchema hotel={hotel} />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteUrl },
          { name: "Hotels", url: `${siteUrl}/hotels` },
          {
            name: hotel.name,
            url: `${siteUrl}/hotels/${hotel.slug}`,
          },
        ]}
      />

      <FAQSchema
        faqs={
          hotel.seo?.faqs?.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })) || []
        }
      />

      <main className="bg-white text-slate-900">
        <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-slate-950 text-white sm:min-h-[640px] lg:min-h-[660px]">
          <SmartImage
            src={hotel.images.hero}
            alt={hotel.seo.featuredImageAlt}
            fill
            isHero
            className="object-cover"
            sizes="100vw"
          />

          {hotelHeroVideos[hotel.slug] ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={hotel.images.hero}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={hotelHeroVideos[hotel.slug]} type="video/webm" />
            </video>
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/58 to-slate-950/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/62 via-transparent to-slate-950/10" />

          <div className="container-custom relative z-10 w-full px-4 py-10 sm:py-12 lg:py-14">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300 backdrop-blur-sm sm:text-sm">
                <MapPin size={16} aria-hidden="true" />
                Supraja Hotels · {hotel.location}
              </p>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                {hotel.name}
              </h1>

              <p className="mt-4 text-xl font-medium text-amber-300 sm:text-2xl">
                {hotel.seo.focusKeyword}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-100 drop-shadow md:text-lg md:leading-8">
                {hotel.description} Call or WhatsApp the hotel directly to check
                current room availability and confirm your stay.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-semibold text-white sm:text-sm">
                {[
                  "Call for Availability",
                  "WhatsApp Booking Support",
                  "Clean Rooms",
                  "Convenient Location",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-slate-950/40 px-4 py-2 backdrop-blur-sm"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:+91${hotel.phone}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Phone size={18} aria-hidden="true" />
                  Call {hotel.phone}
                </a>

                <a
                  href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(
                    hotel.name,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Check on WhatsApp
                </a>

                {hotel.googleBusinessUrl ? (
                  <a
                    href={hotel.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-slate-950/35 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Navigation size={18} aria-hidden="true" />
                    View on Google
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <HotelGallery
              hotelName={hotel.name}
              hero={hotel.images.hero}
              gallery={hotel.images.gallery}
            />
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 lg:py-20">
          <div className="container-custom grid gap-10 lg:grid-cols-[65%_35%]">
            <div>
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Stay Overview
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  A Comfortable Stay in {hotel.area}
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  {hotel.name} offers a practical Hyderabad stay for business
                  guests, families, visitors and short-stay travellers. The
                  property provides direct booking support and convenient access
                  to {hotel.seo.targetLocations.slice(0, 5).join(", ")}.
                </p>

                <p className="mt-4 leading-8 text-slate-600">
                  Before travelling, call or WhatsApp the hotel team to confirm
                  current room availability, rates and any property-specific
                  requirements. This gives you direct information from the hotel
                  rather than relying on third-party availability.
                </p>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Comfortable Rooms",
                    text: "Clean, practical accommodation for business, family and short stays.",
                    icon: BedDouble,
                  },
                  {
                    title: "Direct Booking",
                    text: "Call or WhatsApp the property for current room availability and rates.",
                    icon: Phone,
                  },
                  {
                    title: "Helpful Hotel Support",
                    text: "Speak directly with the hotel team before confirming your stay.",
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                        <Icon size={24} />
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-slate-950">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7">
                <h2 className="text-3xl font-bold text-slate-900">
                  Why Guests Choose {hotel.name}
                </h2>

                <p className="mt-5 leading-8 text-slate-600">
                  The property combines a convenient {hotel.area} location with
                  practical amenities, straightforward direct booking and access
                  to nearby business, residential and transport areas. It is a
                  useful option for guests whose plans involve {hotel.seo.targetLocations
                    .slice(0, 5)
                    .join(", ")}.
                </p>

                <ul className="mt-8 grid gap-3 text-slate-700 sm:grid-cols-2">
                  <li>✓ Comfortable and well-maintained rooms</li>
                  <li>✓ Direct phone and WhatsApp booking support</li>
                  <li>✓ Convenient access to nearby locations</li>
                  <li>✓ Suitable for business and family stays</li>
                  <li>✓ Essential amenities for a practical stay</li>
                  <li>✓ Direct hotel guidance before confirmation</li>
                </ul>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Nearby Locations and Landmarks
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {hotel.name} is positioned for guests visiting these nearby
                  Hyderabad locations and landmarks:
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {hotel.seo.nearbyLandmarks.map((landmark) => (
                    <span
                      key={landmark}
                      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800"
                    >
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7">
                <h2 className="text-3xl font-bold text-slate-900">
                  Amenities at {hotel.name}
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {hotel.amenities.map((amenity) => {
                    const amenityData = amenities.find(
                      (item) => item.title === amenity,
                    );

                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-800"
                      >
                        {amenityData?.icon ? (
                          <SmartImage
                            src={amenityData.icon}
                            alt={`${amenity} at ${hotel.name}`}
                            width={34}
                            height={34}
                          />
                        ) : (
                          <div className="h-[34px] w-[34px] rounded-full bg-blue-100" />
                        )}

                        <span className="font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>

                <div className="mt-6 space-y-6">
                  {hotel.seo.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-bold text-slate-900">
                        {faq.question}
                      </h3>
                      <p className="mt-2 leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-xl font-bold text-slate-900">
                  Useful Links for Guests
                </h3>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <Link
                    href="/hotels"
                    className="text-blue-700 hover:underline"
                  >
                    Compare Supraja Hotels
                  </Link>

                  <Link
                    href="/offers"
                    className="text-blue-700 hover:underline"
                  >
                    View current stay offers
                  </Link>

                  <Link
                    href="/gallery"
                    className="text-blue-700 hover:underline"
                  >
                    See hotel photos
                  </Link>

                  <Link
                    href="/contact"
                    className="text-blue-700 hover:underline"
                  >
                    Contact Supraja Hotels
                  </Link>

                  <a
                    href="https://www.telanganatourism.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Telangana Tourism
                  </a>

                  <a
                    href="https://tourism.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    India Tourism
                  </a>
                </div>
              </div>

              <p className="mt-8 leading-8 text-slate-600">
                If {hotel.name} matches your destination, contact the property
                directly by phone or WhatsApp to check room availability before
                your Hyderabad visit.
              </p>
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <h3 className="text-2xl font-bold text-slate-900">
                Check Room Availability
              </h3>

              <p className="mt-3 text-slate-600">
                Contact this hotel directly for current availability, rates and
                booking confirmation.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Phone</p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {hotel.phone}
                </p>

                <p className="mt-4 text-sm text-slate-500">Email</p>

                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  {hotel.email}
                </p>
              </div>

              <a
                href={`tel:+91${hotel.phone}`}
                className="mt-6 block rounded-full bg-blue-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Call Hotel
              </a>

              <a
                href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(
                  hotel.name,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Check on WhatsApp
              </a>

              {hotel.googleBusinessUrl ? (
                <a
                  href={hotel.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:border-blue-700 hover:text-blue-700"
                >
                  View on Google
                </a>
              ) : null}

              <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Direct hotel contact
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  For the most current room information, contact the property
                  directly before travelling.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {hotel.mapEmbed ? (
          <HotelMap title={hotel.name} embedUrl={hotel.mapEmbed} />
        ) : null}

        <section className="bg-slate-950 px-4 py-16 text-white lg:py-20">
          <div className="container-custom flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Check Availability at {hotel.name}
              </h2>

              <p className="mt-3 text-slate-300">
                Call or WhatsApp the hotel directly for current room
                availability, rates and booking confirmation.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={`tel:+91${hotel.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Phone size={18} aria-hidden="true" />
                Call Hotel
              </a>
              <a
                href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(
                  hotel.name,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp Hotel
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
