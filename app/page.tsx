import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, ShieldCheck, Wifi, Car, BedDouble, ArrowRight, Camera, CheckCircle2 } from "lucide-react";
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
  "supraja-cyber-view": "Stay in Madhapur opposite Shilpakala Vedika, close to HITEC City Metro, Shilparamam, Mindspace, Kondapur and Gachibowli.",
  "supraja-residency": "A comfortable Chandanagar stay near Gangaram with access to Lingampally Railway Station, BHEL, Serilingampally and Miyapur.",
  "supraja-lodge": "An affordable Chandanagar option for short stays near Lingampally Railway Station, Gangaram, BHEL and Miyapur.",
};

const featureCards = [
  { title: "Clean & Comfortable Rooms", description: "Well-maintained rooms for business trips, family stays and short visits in Hyderabad.", icon: BedDouble },
  { title: "Convenient Locations", description: "Choose Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur.", icon: MapPin },
  { title: "Direct Booking Assistance", description: "Call or WhatsApp the hotel directly to check available rooms, rates and booking details.", icon: Phone },
  { title: "Free WiFi", description: "Complimentary WiFi for work, calls, streaming and staying connected during your visit.", icon: Wifi },
  { title: "Parking at All Hotels", description: "Parking is available at every Supraja Hotels property for guests travelling by car or two-wheeler.", icon: Car },
  { title: "Business & Family Friendly", description: "Comfortable stays for business travellers, families, events and short visits to Hyderabad.", icon: ShieldCheck },
];

export default function HomePage() {
  const homeSchema = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Supraja Hotels", url: siteUrl, description: "Supraja Hotels offers comfortable hotel stays in Hyderabad with properties in Madhapur near HITEC City and Chandanagar.", publisher: { "@id": `${siteUrl}/#organization` } };

  return (
    <main className="bg-white text-slate-900 pb-20 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />

      <section className="relative isolate flex min-h-[610px] items-center overflow-hidden bg-slate-950 text-white md:min-h-[660px] lg:min-h-[690px]" style={{ backgroundImage: "url('/media/home-hero/supraja-hotels-home-hero-poster.webp')", backgroundPosition: "center", backgroundSize: "cover" }}>
        <DeferredHeroVideo />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/48 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-slate-950/8" aria-hidden="true" />
        <div className="container-custom relative z-20 w-full py-14 md:py-16 lg:py-20">
          <div className="max-w-[900px]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300 sm:text-sm">Supraja Hotels · Hyderabad</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">Stay Close to Where Hyderabad Takes You</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">Comfortable hotels in <strong>Madhapur near HITEC City</strong> and <strong>Chandanagar near Lingampally, BHEL and Miyapur</strong>. See the property, choose your location and contact the hotel directly.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="#choose-hotel" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950 shadow-xl transition hover:bg-amber-50">Choose Your Hotel <ArrowRight size={17} /></Link><a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-green-700"><MessageCircle size={18} />Check Availability</a></div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Direct hotel contact</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Real property photos</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />Call & WhatsApp support</span></div>
          </div>
        </div>
      </section>

      <section id="choose-hotel" className="bg-[#f7f5f1] px-4 py-14 lg:py-20">
        <div className="container-custom">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Choose Your Stay</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Three Hotels. Two Key Hyderabad Locations.</h2><p className="mt-4 max-w-2xl leading-8 text-slate-600">Start with where you need to be. Each property has a different location and stay style, with direct phone and WhatsApp support.</p></div><Link href="/gallery" className="inline-flex items-center gap-2 self-start text-sm font-bold text-blue-800 hover:underline lg:self-auto"><Camera size={18} />Explore all hotel photos</Link></div>

          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {hotels.map((hotel) => <article key={hotel.slug} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]">
              <Link href={`/hotels/${hotel.slug}`} className="relative block h-[300px] overflow-hidden bg-slate-100"><SmartImage src={hotel.images.hero} alt={hotel.seo.featuredImageAlt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 33vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="flex items-center gap-2 text-sm font-semibold text-white/90"><MapPin size={16} />{hotel.location}</p><h3 className="mt-2 text-2xl font-semibold">{hotel.name}</h3></div></Link>
              <div className="p-6"><p className="text-sm font-bold text-blue-800">{hotel.seo.focusKeyword}</p><p className="mt-3 min-h-[84px] leading-7 text-slate-600">{hotelDescriptions[hotel.slug] || hotel.shortDescription}</p><div className="mt-5 flex flex-wrap gap-2">{hotel.seo.targetLocations.slice(0, 3).map((location) => <span key={location} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{location}</span>)}</div><div className="mt-6 grid grid-cols-2 gap-2"><a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-bold text-slate-900 transition hover:border-blue-700 hover:text-blue-700"><Phone size={16} />Call</a><a href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white transition hover:bg-green-700"><MessageCircle size={16} />WhatsApp</a></div><Link href={`/hotels/${hotel.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:underline">See rooms & hotel details <ArrowRight size={15} /></Link></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 lg:py-20"><div className="container-custom"><div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="grid grid-cols-2 gap-3"><div className="relative col-span-2 h-[340px] overflow-hidden rounded-[1.75rem] sm:h-[430px]"><SmartImage src={hotels[0].images.hero} alt="Hotel room experience at Supraja Hotels Hyderabad" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" /></div>{hotels.slice(1).map((hotel) => <div key={hotel.slug} className="relative h-[190px] overflow-hidden rounded-[1.5rem] sm:h-[230px]"><SmartImage src={hotel.images.hero} alt={`${hotel.name} accommodation in Hyderabad`} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 27vw" /></div>)}</div>
        <div className="lg:pl-8"><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">See Before You Stay</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">The Room Matters. So Does the Location.</h2><p className="mt-4 leading-8 text-slate-600">A hotel website should help you understand the stay before you call. Explore real property images, compare locations and choose the Supraja Hotel that fits your Hyderabad visit.</p><div className="mt-6 space-y-4">{["Madhapur option close to HITEC City and major IT destinations", "Chandanagar options for Lingampally, BHEL, Serilingampally and Miyapur", "Direct contact with each property for current availability and rates"].map((item) => <p key={item} className="flex gap-3 leading-7 text-slate-700"><CheckCircle2 className="mt-1 shrink-0 text-green-700" size={19} />{item}</p>)}</div><Link href="/gallery" className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"><Camera size={17} />View Hotel Gallery</Link></div>
      </div></div></section>

      <section className="bg-slate-950 px-4 py-9 text-white"><div className="container-custom grid gap-6 md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Book Direct</p><h2 className="mt-2 text-2xl font-semibold">Talk to the Hotel, Not a Call Centre</h2></div><div className="flex items-start gap-3"><Phone className="mt-1 text-amber-300" size={22} /><div><p className="font-bold">Current Availability</p><p className="mt-1 text-sm leading-6 text-slate-300">Ask the property about rooms and current rates before travelling.</p></div></div><div className="flex items-start gap-3"><MessageCircle className="mt-1 text-amber-300" size={22} /><div><p className="font-bold">WhatsApp Support</p><p className="mt-1 text-sm leading-6 text-slate-300">Message the hotel directly when calling is not convenient.</p></div></div></div></section>

      <section className="bg-[#f7f5f1] px-4 py-14 lg:py-20"><div className="container-custom"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Comfort, Location & Convenience</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">Why Stay With Supraja Hotels</h2></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featureCards.map((feature) => { const Icon = feature.icon; return <div key={feature.title} className="rounded-[1.5rem] bg-white p-7 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-800"><Icon size={21} /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></div>; })}</div></div></section>

      <AmenitiesSection />

      <section className="bg-white px-4 py-14 lg:py-20"><div className="container-custom"><div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">Ready to Stay?</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose Your Hotel and Check Availability</h2><p className="mt-4 max-w-2xl leading-8 text-slate-300">See the property first, choose the location that works for you and contact the hotel directly for current room availability and rates.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link href="/hotels" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-950">Choose a Hotel <ArrowRight size={16} /></Link><a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-bold text-white"><MessageCircle size={17} />WhatsApp</a></div></div></div></div></section>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(15,23,42,0.14)] md:hidden"><a href="tel:+919550776161" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold text-slate-950"><Phone size={18} />Call</a><a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white"><MessageCircle size={18} />Check Availability</a></div>
    </main>
  );
}