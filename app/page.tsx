import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import SmartImage from "@/components/SmartImage";
import AmenitiesSection from "@/components/AmenitiesSection";
import DeferredHeroVideo from "@/components/DeferredHeroVideo";
import { hotels } from "@/data/hotels";

export const metadata: Metadata = {
  title: { absolute: "Hotels in Hyderabad | Madhapur & Chandanagar | Supraja Hotels" },
  description:
    "Looking for hotels in Hyderabad? Stay with Supraja Hotels in Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur. View rooms and book directly by Call or WhatsApp.",
  keywords: [
    "Hotels in Hyderabad",
    "Hotels in Madhapur",
    "Hotels near HITEC City",
    "Hotel in Chandanagar",
    "Hotel near Lingampally Railway Station",
    "Hotel near BHEL Hyderabad",
    "Budget hotel in Chandanagar",
    "Supraja Hotels",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Comfortable hotels in Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur. View rooms and contact the hotel directly.",
    url: "/",
    siteName: "Supraja Hotels",
    images: [{ url: "/images/social/supraja-hotels-og.jpg", width: 1200, height: 630, alt: "Supraja Hotels in Hyderabad" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels in Hyderabad | Supraja Hotels",
    description: "Hotels in Madhapur and Chandanagar with direct Call and WhatsApp booking.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view":
    "Hotel in Madhapur opposite Shilpakala Vedika, convenient for HITEC City Metro, Shilparamam, Mindspace, Kondapur and Gachibowli.",
  "supraja-residency":
    "Comfortable hotel in Chandanagar near Gangaram, with convenient access to Lingampally Railway Station, BHEL, Serilingampally and Miyapur.",
  "supraja-lodge":
    "Budget hotel in Chandanagar for short stays, work trips and family visits near Lingampally Railway Station, Gangaram, BHEL and Miyapur.",
};

export default function HomePage() {
  return (
    <main className="bg-white pb-20 text-slate-900 md:pb-0">
      <section
        className="relative isolate flex min-h-[610px] items-center overflow-hidden bg-slate-950 text-white md:min-h-[660px] lg:min-h-[690px]"
      >
        <SmartImage src="/media/home-hero/supraja-hotels-home-hero-poster.webp" alt="" fill isHero className="object-cover object-center" sizes="100vw" />
        <DeferredHeroVideo />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/48 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-slate-950/8" aria-hidden="true" />
        <div className="container-custom relative z-20 w-full py-14 md:py-16 lg:py-20">
          <div className="max-w-[900px]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300 sm:text-sm">Supraja Hotels · Hyderabad</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">Hotels in Hyderabad, Close to Where You Need to Be</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
              Choose a comfortable stay in <strong>Madhapur near HITEC City</strong> or <strong>Chandanagar near Lingampally, BHEL and Miyapur</strong>. Explore real hotel photos, compare locations and contact your preferred property directly.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#choose-hotel" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 shadow-xl transition hover:bg-amber-50">Choose Your Hotel <ArrowRight size={17} /></Link>
              <a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-700"><MessageCircle size={18} />Check Availability</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Real hotel photos</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Parking available</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Call & WhatsApp booking</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8">
        <div className="container-custom">
          <div className="grid gap-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-7 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-900">Supraja Direct Advantage</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Direct, Corporate, Long-Stay, Group and Day-Use Options</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-700">
                Tell us what kind of stay you need and check the current direct option for your dates and preferred Supraja Hotel.
              </p>
            </div>
            <Link href="/offers" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-slate-800">
              Explore Direct Advantages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="choose-hotel" className="bg-[#f7f5f1] px-4 py-14 lg:py-20">
        <div className="container-custom">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Choose Your Location</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Three Hotels Across Madhapur and Chandanagar</h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                Start with your destination. Stay in Madhapur for HITEC City, Shilparamam and nearby IT areas, or choose Chandanagar for Lingampally, BHEL, Serilingampally, Nallagandla and Miyapur.
              </p>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 self-start text-sm font-bold text-blue-800 hover:underline lg:self-auto"><Camera size={18} />Explore hotel photos</Link>
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <article key={hotel.slug} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]">
                <Link href={`/hotels/${hotel.slug}`} className="relative block h-[300px] overflow-hidden bg-slate-100">
                  <SmartImage src={hotel.images.hero} alt={hotel.seo.featuredImageAlt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white/90"><MapPin size={16} />{hotel.location}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{hotel.name}</h3>
                  </div>
                </Link>
                <div className="p-6">
                  <p className="text-sm font-bold text-blue-800">{hotel.seo.focusKeyword}</p>
                  <p className="mt-3 min-h-[84px] leading-7 text-slate-600">{hotelDescriptions[hotel.slug] || hotel.shortDescription}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {hotel.seo.targetLocations.slice(0, 3).map((location) => <span key={location} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{location}</span>)}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-bold text-slate-900 transition hover:border-blue-700 hover:text-blue-700"><Phone size={16} />Call</a>
                    <a href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white transition hover:bg-green-700"><MessageCircle size={16} />WhatsApp</a>
                  </div>
                  <Link href={`/hotels/${hotel.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:underline">View rooms, amenities & location <ArrowRight size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AmenitiesSection />

      <section aria-labelledby="guest-reviews-heading" className="bg-[#f7f5f1] px-4 py-14 lg:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Guest Reviews</p>
            <h2 id="guest-reviews-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Read Guest Feedback on Google</h2>
            <p className="mt-4 leading-7 text-slate-600">Visit each hotel’s Google profile to read guest reviews before choosing your stay.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <article key={hotel.slug} className="flex flex-col items-start rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-slate-950">{hotel.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{hotel.area}</p>
                <a href={hotel.googleBusinessUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${hotel.name} on Google (opens in a new tab)`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-blue-800 underline underline-offset-4 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800">View on Google <ExternalLink size={16} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 lg:py-20">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">Ready to Stay?</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose Your Hotel and Check Availability</h2>
                <p className="mt-4 max-w-2xl leading-8 text-slate-300">Pick the location that suits your visit, review the hotel details and contact the property directly for available rooms and current rates.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/hotels" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950">Choose a Hotel <ArrowRight size={16} /></Link>
                <a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white"><MessageCircle size={17} />WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(15,23,42,0.14)] md:hidden">
        <a href="tel:+919550776161" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold text-slate-950"><Phone size={18} />Call</a>
        <a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white"><MessageCircle size={18} />Check Availability</a>
      </div>
    </main>
  );
}
