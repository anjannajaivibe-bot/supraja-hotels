import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  Camera,
  CheckCircle2,
  Eye,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotel Gallery | Hyderabad",
  description:
    "View Supraja Hotels photos including rooms, hotel exteriors and stay spaces near Hitech City, Madhapur and Chandanagar.",
  keywords: [
    "Hotel Gallery Hyderabad",
    "Supraja Hotels gallery",
    "hotel photos Hyderabad",
    "Hotel Supraja Cyber View photos",
    "Hotel Supraja Residency photos",
    "Hotel Supraja Lodge photos",
    "rooms in Madhapur Hyderabad",
    "rooms in Chandanagar Hyderabad",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Hotel Gallery | Supraja Hotels Hyderabad",
    description:
      "Explore room photos, hotel exteriors and stay spaces across Supraja Hotels in Hyderabad.",
    url: "/gallery",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Gallery of Supraja Hotels Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Gallery | Supraja Hotels Hyderabad",
    description:
      "View Supraja Hotels photos including rooms, exteriors and stay spaces in Hyderabad.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelIntro: Record<string, string> = {
  "supraja-cyber-view":
    "A refined business stay near Hitech City, Madhapur, Cyber Towers and Gachibowli.",
  "supraja-residency":
    "A convenient Chandanagar stay for families, business guests and visitors near BHEL.",
  "supraja-lodge":
    "A practical, value-focused hotel with essential comfort near Chandanagar and Miyapur.",
};

const galleryBenefits = [
  {
    icon: Camera,
    title: "Real Hotel Photos",
    description: "Browse actual hotel images before choosing your stay.",
  },
  {
    icon: BedDouble,
    title: "Room Clarity",
    description: "See room layouts, interiors and essential stay spaces.",
  },
  {
    icon: MapPin,
    title: "Location Confidence",
    description: "Compare hotels across Hitech City and Chandanagar.",
  },
  {
    icon: ShieldCheck,
    title: "Better Decisions",
    description: "Book with more confidence after reviewing the property.",
  },
];

export default function GalleryPage() {
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteUrl}/gallery#imagegallery`,
    url: `${siteUrl}/gallery`,
    name: "Hotel Gallery | Supraja Hotels Hyderabad",
    description:
      "Photo gallery of Supraja Hotels in Hyderabad including rooms, exteriors and stay spaces.",
    isPartOf: {
      "@id": `${siteUrl}#website`,
    },
    image: hotels.flatMap((hotel) => [
      `${siteUrl}${hotel.images.hero}`,
      ...hotel.images.gallery.map((image) => `${siteUrl}${image}`),
    ]),
    about: hotels.map((hotel) => ({
      "@type": "Hotel",
      name: hotel.name,
      url: `${siteUrl}/hotels/${hotel.slug}`,
    })),
  };

  const heroImages = [
    hotels[0]?.images.hero,
    hotels[1]?.images.hero,
    hotels[2]?.images.hero,
    hotels[0]?.images.gallery?.[0],
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gallerySchema),
        }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-25">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Supraja Hotels gallery in Hyderabad"
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
                <Camera className="mr-2 h-4 w-4" />
                Supraja Hotels Gallery
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                View Supraja Hotels Before You Book
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Explore hotel exteriors, clean rooms and essential stay spaces
                across our properties near Hitech City, Madhapur and
                Chandanagar.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Actual Hotel Photos",
                  "Room & Exterior Views",
                  "Hitech City & Chandanagar",
                  "Direct Booking Support",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/hotels"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                >
                  Explore Hotels
                </Link>

                <a
                  href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20I%20viewed%20the%20gallery%20and%20would%20like%20to%20book%20a%20room"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Booking
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {heroImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl ${
                    index === 0 ? "h-72" : "h-48"
                  } ${index === 0 ? "row-span-2" : ""}`}
                >
                  <SmartImage
                    src={image}
                    alt={`Supraja Hotels gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-14">
          <div className="grid gap-5 md:grid-cols-4">
            {galleryBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-950">
                    {benefit.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {hotels.map((hotel, hotelIndex) => {
          const allImages = [hotel.images.hero, ...hotel.images.gallery];

          return (
            <section
              key={hotel.slug}
              className={hotelIndex % 2 === 0 ? "bg-slate-50" : "bg-white"}
            >
              <div className="container-custom px-4 py-16 lg:py-20">
                <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <span className="inline-flex items-center text-sm font-bold uppercase tracking-[0.22em] text-amber-700">
                      <Building2 className="mr-2 h-4 w-4" />
                      {hotel.location}
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      {hotel.name}
                    </h2>

                    <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                      {hotelIntro[hotel.slug] || hotel.shortDescription}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {hotel.seo.targetLocations.slice(0, 4).map((location) => (
                        <span
                          key={location}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      View Hotel
                    </Link>

                    <a
                      href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20book%20a%20room%20at%20${encodeURIComponent(
                        hotel.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 sm:inline-flex"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Book Now
                    </a>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {allImages.map((image, index) => {
                    const isFeature = index === 0;
                    const label =
                      index === 0
                        ? "Exterior View"
                        : index === 1
                        ? "Room View"
                        : index === 2
                        ? "Stay Space"
                        : index === 3
                        ? "Room Interior"
                        : index === 4
                        ? "Hotel Facility"
                        : "Guest Space";

                    return (
                      <div
                        key={`${hotel.slug}-${image}-${index}`}
                        className={`group relative overflow-hidden rounded-3xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70 ${
                          isFeature ? "sm:col-span-2 sm:row-span-2" : ""
                        }`}
                      >
                        <SmartImage
                          src={image}
                          alt={`${hotel.name} ${label} in ${hotel.location}`}
                          width={1000}
                          height={800}
                          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                            isFeature ? "min-h-[430px]" : "min-h-[270px]"
                          }`}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                          <p className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow backdrop-blur">
                            {label}
                          </p>

                          <span className="hidden rounded-full bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur sm:inline-flex">
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            View
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">
                  Before Booking
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  See What Awaits You
                </h2>

                <p className="mt-5 max-w-3xl leading-8 text-slate-600">
                  Review authentic hotel photos before choosing your preferred
                  Supraja Hotel. Compare rooms, exteriors and key spaces across
                  our Hyderabad properties, then contact our team for direct
                  room availability.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    "Room photos before booking",
                    "Exterior and location views",
                    "Useful for family stays",
                    "Helpful for corporate guests",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-amber-200 bg-slate-50 p-8 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Sparkles className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      Useful Gallery Links
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Helpful pages for quick booking decisions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    { label: "Explore Supraja Hotels", href: "/hotels" },
                    { label: "View Hotel Offers", href: "/offers" },
                    { label: "Learn About Supraja Hotels", href: "/about" },
                    { label: "Contact Booking Team", href: "/contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 pb-16 lg:pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="absolute inset-0 opacity-20">
              <SmartImage
                src="/images/homepage/hero.webp"
                alt="Book Supraja Hotels after viewing gallery"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Reserve Your Room?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Call or WhatsApp Supraja Hotels for today&apos;s availability,
                direct rates and quick booking assistance.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+919550776161"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call 9550776161
                </a>

                <a
                  href="https://wa.me/919550776161?text=Hi%20Supraja%20Hotels%2C%20I%20viewed%20the%20gallery%20and%20would%20like%20to%20book%20a%20room"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Booking
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
