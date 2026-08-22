import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, ShieldCheck, Wifi, Car, BedDouble, Building2 } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import AmenitiesSection from "@/components/AmenitiesSection";
import DeferredHeroVideo from "@/components/DeferredHeroVideo";
import { hotels } from "@/data/hotels";

const siteUrl = "https://www.suprajahotels.com";

export const metadata: Metadata = {
  title: { absolute: "Hotels in Hyderabad | Supraja Hotels" },
  description: "Looking for hotels in Hyderabad? Supraja Hotels offers comfortable stays in Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur. Call or WhatsApp for availability.",
  keywords: ["Hotels in Hyderabad", "Hotels in Madhapur", "Hotels near Hitech City", "Hotels in Chandanagar", "Hotel near Lingampally Railway Station", "Hotels near BHEL", "Budget hotel in Chandanagar", "Hotel booking Hyderabad", "Direct hotel booking Hyderabad", "Supraja Hotels"],
  alternates: { canonical: "/" },
  openGraph: { title: "Hotels in Hyderabad | Supraja Hotels", description: "Comfortable hotels in Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur with direct Call and WhatsApp support.", url: "/", siteName: "Supraja Hotels", images: [{ url: "/images/social/supraja-hotels-og.jpg", width: 1200, height: 630, alt: "Supraja Hotels in Hyderabad" }], locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image", title: "Hotels in Hyderabad | Supraja Hotels", description: "Hotels in Madhapur and Chandanagar with direct room availability support.", images: ["/images/social/supraja-hotels-og.jpg"] },
};

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view": "A comfortable hotel in Madhapur near HITEC City, opposite Shilpakala Vedika and convenient for HITEC City Metro, Shilparamam, Mindspace, Kondapur and Gachibowli.",
  "supraja-residency": "A comfortable hotel in Chandanagar near Gangaram with convenient access to Lingampally Railway Station, BHEL, Serilingampally, Nallagandla and Miyapur.",
  "supraja-lodge": "An affordable, budget-friendly hotel in Chandanagar for guests visiting Lingampally Railway Station, Gangaram, BHEL, Serilingampally and Miyapur.",
};

const featureCards = [
  { title: "Clean, Comfortable Rooms", description: "Well-maintained rooms for business visits, family stays and short Hyderabad trips.", icon: BedDouble },
  { title: "Useful Hyderabad Locations", description: "Choose Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur based on where you need to be.", icon: MapPin },
  { title: "Direct Booking Support", description: "Call or WhatsApp the hotel team for current room availability, rates and booking confirmation.", icon: Phone },
  { title: "Free WiFi", description: "Stay connected for work, video calls, streaming and everyday browsing.", icon: Wifi },
  { title: "Parking at Selected Hotels", description: "Parking facilities are available at selected properties. Confirm availability with the hotel before arrival.", icon: Car },
  { title: "Business and Family Stays", description: "Options for work trips, family visits, medical appointments, events and short stays in Hyderabad.", icon: ShieldCheck },
];

const locationTargets = ["HITEC City", "Madhapur", "HITEC City Metro", "Shilparamam", "Kondapur", "Gachibowli", "Chandanagar", "Lingampally", "BHEL", "Serilingampally", "Nallagandla", "Miyapur"];

export default function HomePage() {
  const homeSchema = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Supraja Hotels", url: siteUrl, description: "Supraja Hotels offers comfortable hotel stays in Hyderabad with properties in Madhapur near HITEC City and Chandanagar.", publisher: { "@id": `${siteUrl}/#organization` } };

  return (
    <main className="bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-slate-950 text-white md:min-h-[760px]" style={{ backgroundImage: "url('/media/home-hero/supraja-hotels-home-hero-poster.webp')", backgroundPosition: "center", backgroundSize: "cover" }}>
        <DeferredHeroVideo />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/58 to-slate-950/5" aria-hidden="true" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/62 via-transparent to-slate-950/10" aria-hidden="true" />
        <div className="container-custom relative z-20 w-full px-5 py-20 sm:px-6 md:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-base">Supraja Hotels | Hyderabad</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">Hotels in Hyderabad for Comfortable, Convenient Stays</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">Choose a Supraja Hotel based on where you need to be. Stay in <strong>Madhapur near HITEC City</strong> for business and event visits, or choose <strong>Chandanagar</strong> for convenient access to <strong>Lingampally, BHEL, Serilingampally and Miyapur</strong>. Call or WhatsApp the hotel directly to check current room availability.</p>
            <div className="mt-7 flex flex-wrap gap-2.5 text-xs font-semibold text-white sm:text-sm">{["Call for Current Availability", "WhatsApp Booking Support", "Madhapur & Chandanagar", "Free WiFi"].map((item) => <span key={item} className="rounded-full border border-white/25 bg-slate-950/35 px-4 py-2 backdrop-blur-sm">✓ {item}</span>)}</div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link href="/hotels" className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-700 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-600">Choose a Hotel</Link><a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-green-500"><MessageCircle size={18} aria-hidden="true" />Check on WhatsApp</a><a href="tel:+919550776161" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/60 bg-slate-950/25 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-950"><Phone size={18} aria-hidden="true" />Call 9550776161</a></div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-20"><div className="container-custom"><div className="max-w-4xl"><p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Our Hotels</p><h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Hotels in Madhapur and Chandanagar, Hyderabad</h2><p className="mt-5 leading-8 text-slate-600">Our three Hyderabad properties serve different travel needs. Compare the location, nearby landmarks and stay style, then contact the property directly for current availability and rates.</p></div>
        <div className="mt-10 space-y-6">{hotels.map((hotel) => <div key={hotel.slug} className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[330px_1fr_250px]">
          <Link href={`/hotels/${hotel.slug}`} className="group relative h-64 bg-slate-100 lg:h-full" aria-label={`View ${hotel.name}`}><SmartImage src={hotel.images.hero} alt={hotel.seo.featuredImageAlt} width={700} height={500} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
          <div className="p-7"><p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} aria-hidden="true" />{hotel.location}</p><Link href={`/hotels/${hotel.slug}`}><h3 className="mt-2 text-2xl font-bold text-slate-950 hover:text-blue-700">{hotel.name}</h3></Link><p className="mt-2 text-sm font-semibold text-blue-700">{hotel.seo.focusKeyword}</p><p className="mt-4 max-w-3xl leading-8 text-slate-600">{hotelDescriptions[hotel.slug] || hotel.shortDescription}</p><div className="mt-5 flex flex-wrap gap-2">{hotel.seo.targetLocations.slice(0, 4).map((location) => <span key={location} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{location}</span>)}</div></div>
          <div className="flex items-center justify-center border-t border-slate-200 p-7 lg:border-l lg:border-t-0"><div className="w-full text-center"><p className="text-sm font-semibold text-slate-500">Check Current Availability</p><p className="mt-2 text-lg font-bold text-slate-950">{hotel.phone}</p><div className="mt-5 grid gap-2"><a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white"><Phone size={16} />Call Hotel</a><a href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white"><MessageCircle size={16} />WhatsApp</a><Link href={`/hotels/${hotel.slug}`} className="text-sm font-semibold text-blue-700 hover:underline">View hotel details</Link></div></div></div>
        </div>)}</div></div></section>

      <section className="bg-slate-50 px-4 py-16 lg:py-20"><div className="container-custom"><div className="mx-auto max-w-3xl text-center"><p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Why Choose Supraja Hotels</p><h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Practical Hyderabad Stays with Direct Hotel Support</h2></div><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featureCards.map((feature) => { const Icon = feature.icon; return <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></div>; })}</div></div></section>

      <AmenitiesSection />

      <section className="bg-white px-4 py-16 lg:py-20"><div className="container-custom"><div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-12"><div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"><div><p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Nearby Locations</p><h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">Find a Hotel Near Where You Need to Be in Hyderabad</h2><p className="mt-5 max-w-4xl leading-8 text-slate-600">For HITEC City, Madhapur and nearby IT destinations, Hotel Supraja Cyber View is the relevant choice. For Chandanagar, Lingampally, BHEL, Serilingampally, Nallagandla and Miyapur, compare Supraja Residency and the budget-focused Supraja Lodge.</p></div><Building2 className="hidden h-16 w-16 text-amber-600 lg:block" /></div><div className="mt-8 flex flex-wrap gap-3">{locationTargets.map((location) => <span key={location} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{location}</span>)}</div><div className="mt-8 flex flex-wrap gap-4"><Link href="/hotels/supraja-cyber-view" className="text-blue-700 hover:underline">Hotel in Madhapur near HITEC City</Link><Link href="/hotels/supraja-residency" className="text-blue-700 hover:underline">Hotel in Chandanagar</Link><Link href="/hotels/supraja-lodge" className="text-blue-700 hover:underline">Budget hotel in Chandanagar</Link><Link href="/blog" className="text-blue-700 hover:underline">Hyderabad stay guides</Link><a href="https://www.telanganatourism.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Telangana Tourism</a></div></div></div></section>

      <section className="container-custom px-4 py-16 lg:py-20"><div className="rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Check Room Availability Directly with the Hotel</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">Choose the hotel that best matches your Hyderabad destination, then call or WhatsApp the property for current room availability, rates and booking confirmation.</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/hotels" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950">Compare Hyderabad Hotels</Link><a href="tel:+919550776161" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white">Call Supraja Hotels</a><a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-4 text-sm font-bold text-white">Check on WhatsApp</a></div></div></section>
    </main>
  );
}
