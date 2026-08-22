import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  Camera,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://www.suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotel Gallery | Supraja Hotels Hyderabad",
  description:
    "View photos of Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge, including rooms, exteriors and guest spaces.",
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
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Hotel Gallery | Supraja Hotels Hyderabad",
    description:
      "Explore room photos, hotel exteriors and guest spaces across all three Supraja Hotels properties in Hyderabad.",
    url: "/gallery",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Supraja Hotels Hyderabad gallery",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Gallery | Supraja Hotels Hyderabad",
    description:
      "View room, exterior and guest-space photos from Supraja Hotels in Hyderabad.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelIntro: Record<string, string> = {
  "supraja-cyber-view":
    "View Hotel Supraja Cyber View in Madhapur, with access to HITEC City, Shilparamam and nearby business areas.",
  "supraja-residency":
    "View Hotel Supraja Residency in Chandanagar for family, business and short-stay requirements.",
  "supraja-lodge":
    "View Hotel Supraja Lodge, a value-focused Chandanagar property for practical short stays.",
};

const galleryBenefits = [
  {
    icon: Camera,
    title: "Property Photos",
    description: "Review hotel images before selecting your preferred property.",
  },
  {
    icon: BedDouble,
    title: "Room Views",
    description: "See rooms and guest spaces across the three properties.",
  },
  {
    icon: MapPin,
    title: "Compare Locations",
    description: "Compare Madhapur and Chandanagar properties before booking.",
  },
  {
    icon: ShieldCheck,
    title: "Direct Follow-up",
    description: "Contact the relevant hotel directly after reviewing its photos.",
  },
];

export default function GalleryPage() {
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteUrl}/gallery#imagegallery`,
    url: `${siteUrl}/gallery`,
    name: "Supraja Hotels Hyderabad Gallery",
    description:
      "Photo gallery of Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    image: hotels.flatMap((hotel) => [
      `${siteUrl}${hotel.images.hero}`,
      ...hotel.images.gallery.map((image) => `${siteUrl}${image}`),
    ]),
    about: hotels.map((hotel) => ({
      "@type": "Hotel",
      "@id": `${siteUrl}/hotels/${hotel.slug}#hotel`,
      name: hotel.name,
      url: `${siteUrl}/hotels/${hotel.slug}`,
    })),
  };

  const heroImages = [
    hotels[0]?.images.hero,
    hotels[1]?.images.hero,
    hotels[2]?.images.hero,
    hotels[0]?.images.gallery?.[0],
  ].filter(Boolean) as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-30">
            <SmartImage
              src="/images/homepage/hero.webp"
              alt="Supraja Hotels gallery in Hyderabad"
              fill
              isHero
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/78 to-slate-950/45" />

          <div className="container-custom relative grid gap-10 px-4 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200">
                <Camera className="mr-2 h-4 w-4" />
                Supraja Hotels Gallery
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                See Our Hotels Before You Choose
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Browse room, exterior and guest-space photos from our properties in Madhapur and Chandanagar, then contact the relevant hotel for current availability.
              </p>

              <div className="mt-7 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                {["Three Hotel Galleries", "Room & Exterior Views", "Madhapur & Chandanagar", "Direct Hotel Contact"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/hotels" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100">
                  Compare Hotels
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700">
                  Contact Hotels
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroImages.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl lg:rounded-3xl">
                  <SmartImage
                    src={image}
                    alt={`Supraja Hotels property gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-custom px-4 py-16 lg:py-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-slate-950">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {hotels.map((hotel, hotelIndex) => {
          const allImages = [hotel.images.hero, ...hotel.images.gallery];
          return (
            <section key={hotel.slug} className={hotelIndex % 2 === 0 ? "bg-slate-50" : "bg-white"}>
              <div className="container-custom px-4 py-16 lg:py-20">
                <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <span className="inline-flex items-center text-sm font-bold uppercase tracking-[0.22em] text-amber-700">
                      <Building2 className="mr-2 h-4 w-4" />
                      {hotel.location}
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{hotel.name}</h2>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-600">{hotelIntro[hotel.slug] || hotel.shortDescription}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {hotel.seo.targetLocations.slice(0, 4).map((location) => (
                        <span key={location} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{location}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/hotels/${hotel.slug}`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:border-blue-700 hover:text-blue-700">
                      View Hotel
                    </Link>
                    <a
                      href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20viewed%20the%20photos%20and%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Check Availability
                    </a>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {allImages.map((image, index) => {
                    const label = index === 0 ? "Hotel View" : index <= 3 ? "Room View" : index === 4 ? "Reception / Common Area" : "Guest Space";
                    return (
                      <figure key={`${hotel.slug}-${image}-${index}`} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/70">
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          <SmartImage
                            src={image}
                            alt={`${hotel.name} ${label} in ${hotel.location}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        </div>
                        <figcaption className="px-4 py-3 text-sm font-semibold text-slate-700">{label}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Before Booking</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Compare the Property, Then Contact the Hotel</h2>
              <p className="mt-5 max-w-3xl leading-8 text-slate-600">
                Review the photos together with each hotel&apos;s location and amenities. When you have selected a property, call or WhatsApp that hotel directly for current room availability and rates.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {["Compare room photos", "Check hotel location", "Review property amenities", "Contact the hotel directly"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Sparkles className="h-7 w-7" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">Continue Your Search</h3>
                  <p className="mt-1 text-sm text-slate-600">Useful pages before you contact a property.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <Link href="/hotels" className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:text-blue-800">Compare Supraja Hotels</Link>
                <Link href="/offers" className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:text-blue-800">Current Rate & Stay Enquiries</Link>
                <Link href="/contact" className="rounded-2xl border border-slate-200 bg-white p-5 font-bold text-slate-800 transition hover:border-blue-700 hover:text-blue-800">Property Contact Details</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container-custom px-4 pb-16 lg:pb-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="absolute inset-0 opacity-20">
              <SmartImage src="/images/homepage/hero.webp" alt="Contact Supraja Hotels after viewing property photos" fill className="object-cover" sizes="100vw" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Found the Right Property?</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">Open the hotel page or contact the relevant property directly for current availability and rates.</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-100">
                  <Phone className="mr-2 h-5 w-5" />Contact Hotels
                </Link>
                <Link href="/hotels" className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-green-700">Compare Hotels</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
