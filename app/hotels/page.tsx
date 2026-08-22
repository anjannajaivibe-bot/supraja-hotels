import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Wifi,
  Car,
  ShieldCheck,
  BedDouble,
  Phone,
  MessageCircle,
  Building2,
} from "lucide-react";

import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

const siteUrl = "https://suprajahotels.com";

export const metadata: Metadata = {
  title: "Hotels in Hyderabad | Supraja Hotels",
  description:
    "Explore Supraja Hotels in Hyderabad with stays in Madhapur and Chandanagar. Compare locations and contact each hotel directly for current room availability.",
  keywords: [
    "Hotels in Hyderabad",
    "hotel booking in Hyderabad",
    "budget hotels in Hyderabad",
    "business hotels in Hyderabad",
    "family hotels in Hyderabad",
    "hotels near Hitech City",
    "hotels in Madhapur",
    "hotels in Chandanagar",
    "direct hotel booking Hyderabad",
    "Supraja Hotels",
  ],
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Compare Supraja Hotels in Madhapur and Chandanagar and contact the hotel directly for current availability.",
    url: "/hotels",
    siteName: "Supraja Hotels",
    images: [{
      url: "/images/social/supraja-hotels-og.jpg",
      width: 1200,
      height: 630,
      alt: "Hotels in Hyderabad by Supraja Hotels",
    }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Compare Supraja Hotels in Madhapur and Chandanagar with direct booking support.",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

const benefits = [
  { title: "Comfortable Rooms", text: "Practical rooms for business visits, family stays and short city trips.", icon: BedDouble },
  { title: "Convenient Locations", text: "Stay in Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur.", icon: MapPin },
  { title: "WiFi Access", text: "Stay connected for work, calls, browsing and everyday communication.", icon: Wifi },
  { title: "Parking at Selected Hotels", text: "Parking is available at selected properties. Confirm availability directly before arrival.", icon: Car },
  { title: "Direct Hotel Support", text: "Speak directly with the property team for current information about your stay.", icon: ShieldCheck },
  { title: "Direct Booking Assistance", text: "Call or WhatsApp the hotel for current room availability, rates and booking support.", icon: Phone },
];

const hotelDescriptions: Record<string, string> = {
  "supraja-cyber-view": "Stay in Madhapur with convenient access to HITEC City Metro, Shilparamam, Shilpakala Vedika, Mindspace IT Park, Kondapur and Gachibowli.",
  "supraja-residency": "Stay in Chandanagar with convenient access to Gangaram, BHEL, Lingampally Railway Station, Serilingampally and Miyapur.",
  "supraja-lodge": "A budget-friendly stay in Chandanagar with convenient access to BHEL, Lingampally Railway Station, Miyapur and nearby commercial areas.",
};

const hotelsPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/hotels#collectionpage`,
  url: `${siteUrl}/hotels`,
  name: "Hotels in Hyderabad",
  description: "Supraja Hotels offers hotel stays in Hyderabad across Madhapur and Chandanagar.",
  isPartOf: { "@id": `${siteUrl}#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: hotels.map((hotel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: hotel.name,
      url: `${siteUrl}/hotels/${hotel.slug}`,
    })),
  },
};

export default function HotelsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelsPageSchema) }} />
      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.18),transparent_30%)]" />
          <div className="container-custom relative grid items-center gap-12 lg:grid-cols-[52%_48%]">
            <div>
              <p className="mb-5 inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950">Supraja Hotels Hyderabad</p>
              <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">Hotels in Hyderabad for Business, Family and Short Stays</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Compare three <strong>Supraja Hotels in Hyderabad</strong> across <strong>Madhapur</strong> and <strong>Chandanagar</strong>. Choose the location that suits your visit, then call or WhatsApp the property directly to check current room availability and rates.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
                {["Direct Hotel Contact", "Madhapur & Chandanagar", "Call for Availability", "WhatsApp Support"].map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2">✓ {item}</span>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href="tel:+919550776161" className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"><Phone size={18} />Call for Booking</a>
                <a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20know%20room%20availability%20at%20Supraja%20Hotels" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-700"><MessageCircle size={18} />WhatsApp Booking</a>
              </div>
            </div>
            <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:h-[500px]">
              <SmartImage src="/images/homepage/hero.webp" alt="Supraja Hotels in Hyderabad" fill isHero className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-5 text-slate-950 shadow-xl backdrop-blur">
                <p className="text-sm font-semibold text-slate-500">Choose by Location</p>
                <p className="mt-1 text-2xl font-bold">Madhapur • HITEC City • Chandanagar</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="max-w-4xl">
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Our Hotels</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Choose the Right Supraja Hotel for Your Visit</h2>
              <p className="mt-5 leading-8 text-slate-600">Each property serves a different location and travel need. Cyber View is positioned for Madhapur and HITEC City visitors, while Residency and Lodge serve Chandanagar, Lingampally, BHEL, Miyapur and surrounding areas.</p>
            </div>
            <div className="mt-10 space-y-6">
              {hotels.map((hotel) => (
                <Link key={hotel.slug} href={`/hotels/${hotel.slug}`} className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[330px_1fr_230px]">
                  <div className="relative h-64 bg-slate-100 lg:h-full">
                    <SmartImage src={hotel.images.hero} alt={`${hotel.name} in ${hotel.location}`} width={700} height={500} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-7">
                    <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} />{hotel.location}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-950">{hotel.name}</h3>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-600">{hotelDescriptions[hotel.slug] || hotel.shortDescription}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {hotel.seo.targetLocations.slice(0, 4).map((location) => <span key={location} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{location}</span>)}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      {hotel.amenities.slice(0, 4).map((amenity) => <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1">{amenity}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center border-t border-slate-200 p-7 lg:border-l lg:border-t-0">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Direct Hotel Contact</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{hotel.phone}</p>
                      <span className="mt-5 inline-block rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white">View Hotel</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Why Choose Us</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 md:text-5xl">Practical Hyderabad Stays with Direct Hotel Support</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => { const Icon = item.icon; return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                </div>
              ); })}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-20">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">Direct Reservations</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Hotel Booking in Hyderabad with Direct Support</h2>
                <p className="mt-5 leading-8 text-slate-600">Contacting the hotel directly makes it easier to confirm current room availability, rates, check-in requirements and whether the location suits your travel plans before you arrive.</p>
                <ul className="mt-6 space-y-3 text-slate-700">
                  <li>✓ Direct phone and WhatsApp assistance</li><li>✓ Hotels in Madhapur and Chandanagar</li><li>✓ Options for business, family and short stays</li><li>✓ Access to important Hyderabad business and residential areas</li><li>✓ Property-specific availability information before travel</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <Building2 className="h-12 w-12 text-amber-600" />
                <h3 className="mt-5 text-2xl font-bold text-slate-950">Which Supraja Hotel Should You Choose?</h3>
                <p className="mt-5 leading-8 text-slate-600"><strong>Hotel Supraja Cyber View</strong> is suited to guests visiting Madhapur, HITEC City and nearby business and event destinations. <strong>Hotel Supraja Residency</strong> is a practical Chandanagar option for family, work and local visits. <strong>Hotel Supraja Lodge</strong> provides a budget-focused option in Chandanagar.</p>
                <p className="mt-5 leading-8 text-slate-600">Open the individual hotel page to compare its location, photos, amenities, nearby places and direct contact details.</p>
              </div>
            </div>
            <div className="mt-10 rounded-3xl bg-slate-50 p-7">
              <h3 className="text-xl font-bold text-slate-950">Helpful Guest Links</h3>
              <div className="mt-4 flex flex-wrap gap-5 text-sm">
                <Link href="/contact" className="text-blue-700 hover:underline">Contact Supraja Hotels</Link>
                <Link href="/about" className="text-blue-700 hover:underline">About Supraja Hotels</Link>
                <Link href="/offers" className="text-blue-700 hover:underline">View current offers</Link>
                <Link href="/gallery" className="text-blue-700 hover:underline">View hotel photos</Link>
                <Link href="/blog" className="text-blue-700 hover:underline">Hyderabad stay guides</Link>
                <a href="https://www.telanganatourism.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Telangana Tourism</a>
              </div>
            </div>
            <p className="mt-10 leading-8 text-slate-600">For guests comparing <strong>Hotels in Hyderabad</strong>, Supraja Hotels offers location-focused choices in Madhapur and Chandanagar with direct phone and WhatsApp support for current room information.</p>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white lg:py-20">
          <div className="container-custom flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div><h2 className="text-3xl font-bold">Need Help Choosing a Hotel?</h2><p className="mt-3 text-slate-300">Contact Supraja Hotels for current availability and location guidance.</p></div>
            <a href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20help%20choosing%20a%20Supraja%20Hotel" target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700">Ask on WhatsApp</a>
          </div>
        </section>
      </main>
    </>
  );
}
