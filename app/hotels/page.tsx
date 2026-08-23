import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://www.suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotels in Hyderabad | Supraja Hotels",
  description: "Compare Supraja Hotels in Madhapur and Chandanagar. View real hotel photos, nearby locations and amenities, then call or WhatsApp your preferred hotel.",
  alternates: { canonical: "/hotels" },
  openGraph: { title: "Hotels in Hyderabad | Supraja Hotels", description: "Choose a Supraja Hotel in Madhapur or Chandanagar for your Hyderabad stay.", url: "/hotels", siteName: "Supraja Hotels", images: [{ url: "/images/social/supraja-hotels-og.jpg", width: 1200, height: 630, alt: "Supraja Hotels in Hyderabad" }], locale: "en_IN", type: "website" },
};

const copy: Record<string, string> = {
  "supraja-cyber-view": "Stay in Madhapur opposite Shilpakala Vedika, close to HITEC City Metro, Shilparamam, Mindspace, Kondapur and Gachibowli.",
  "supraja-residency": "Comfortable accommodation in Chandanagar near Gangaram, with easy access to Lingampally Railway Station, BHEL, Serilingampally and Miyapur.",
  "supraja-lodge": "Affordable accommodation in Chandanagar for short stays near Lingampally Railway Station, Gangaram, BHEL and Miyapur.",
};

export default function HotelsPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${siteUrl}/hotels#collectionpage`, url: `${siteUrl}/hotels`, name: "Hotels in Hyderabad", mainEntity: { "@type": "ItemList", itemListElement: hotels.map((hotel, index) => ({ "@type": "ListItem", position: index + 1, name: hotel.name, url: `${siteUrl}/hotels/${hotel.slug}` })) } };

  return <main className="bg-white pb-20 text-slate-900 md:pb-0">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <SmartImage src="/images/homepage/hero.webp" alt="Supraja Hotels in Hyderabad" fill isHero className="object-cover opacity-70" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/62 to-slate-950/20" />
      <div className="container-custom relative z-10 px-5 py-20 sm:px-6 lg:py-24">
        <div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">Our Hotels</p><h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">Choose the Right Hotel for Your Hyderabad Stay</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/88">Choose between Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur. Explore real photos, amenities and nearby landmarks before you book.</p><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/90">{["Real hotel photos","Free parking","Madhapur & Chandanagar","Call & WhatsApp booking"].map((item)=><span key={item} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300"/>{item}</span>)}</div></div>
      </div>
    </section>
    <section className="bg-[#f7f5f1] px-4 py-16 lg:py-24"><div className="container-custom">
      <div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Three Hyderabad Properties</p><h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Compare Locations and Find Your Stay</h2><p className="mt-4 max-w-2xl leading-8 text-slate-600">Each Supraja Hotel serves a different part of Hyderabad. Choose the property closest to where you need to be.</p></div>
      <div className="mt-10 grid gap-7 lg:grid-cols-3">
        {hotels.map((hotel)=><article key={hotel.slug} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,.14)]">
          <Link href={`/hotels/${hotel.slug}`} className="relative block h-[330px] overflow-hidden"><SmartImage src={hotel.images.hero} alt={hotel.seo.featuredImageAlt} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 33vw"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="flex items-center gap-2 text-sm"><MapPin size={16}/>{hotel.location}</p><h3 className="mt-2 text-2xl font-bold">{hotel.name}</h3></div></Link>
          <div className="p-6"><p className="leading-7 text-slate-600">{copy[hotel.slug]}</p><div className="mt-5 flex flex-wrap gap-2">{hotel.seo.targetLocations.slice(0,3).map((x)=><span key={x} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{x}</span>)}</div><div className="mt-6 grid grid-cols-2 gap-2"><a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-bold"><Phone size={16}/>Call</a><a href={`https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white"><MessageCircle size={16}/>WhatsApp</a></div><Link href={`/hotels/${hotel.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:underline">View rooms, amenities & details <ArrowRight size={15}/></Link></div>
        </article>)}
      </div>
    </div></section>
    <section className="bg-white px-4 py-16 lg:py-20"><div className="container-custom rounded-[2rem] bg-slate-950 p-8 text-white md:p-12"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">Need Help Choosing?</p><h2 className="mt-3 text-3xl font-bold">Tell Us Where You Need to Stay</h2><p className="mt-3 max-w-2xl text-slate-300">Share the area you are visiting and we will help you choose the most convenient Supraja Hotel.</p></div><a href="https://wa.me/919550776161?text=Hi%20I%20need%20help%20choosing%20a%20Supraja%20Hotel" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 text-sm font-bold"><MessageCircle size={17}/>Ask on WhatsApp</a></div></div></section>
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(15,23,42,.14)] md:hidden"><a href="tel:+919550776161" className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-bold"><Phone size={18}/>Call</a><a href="https://wa.me/919550776161" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white"><MessageCircle size={18}/>WhatsApp</a></div>
  </main>;
}
