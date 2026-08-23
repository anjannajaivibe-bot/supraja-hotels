import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { amenities } from "@/data/amenities";
import { hotels } from "@/data/hotels";
import HotelGallery from "@/components/HotelGallery";
import HotelMap from "@/components/HotelMap";
import HotelSchema from "@/components/schema/HotelSchema";
import BreadcrumbSchema from "@/components/schema/BreadcrumbSchema";
import FAQSchema from "@/components/schema/FAQSchema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.suprajahotels.com";

const hotelOgImages: Record<string, string> = {
  "supraja-cyber-view": "/images/social/supraja-cyber-view-og.jpg",
  "supraja-residency": "/images/social/supraja-residency-og.jpg",
  "supraja-lodge": "/images/social/supraja-lodge-og.jpg",
};

const hotelHeroVideos: Record<string, string> = {
  "supraja-cyber-view": "/images/hero-vids/hotel-supraja-cyber-view-hero-video.webm",
  "supraja-residency": "/images/hero-vids/sri-supraja-residency-hero-video.webm",
  "supraja-lodge": "/images/hero-vids/hotel-supraja-lodge-hero-video.webm",
};

const searchCopy: Record<
  string,
  {
    eyebrow: string;
    heading: string;
    intro: string;
    overview: string;
    why: string;
    nearbyIntro: string;
    final: string;
    highlights: string[];
  }
> = {
  "supraja-cyber-view": {
    eyebrow: "Hotel in Madhapur near HITEC City",
    heading: "Hotel Supraja Cyber View in Madhapur near HITEC City",
    intro:
      "Stay opposite Shilpakala Vedika in Madhapur, with convenient access to HITEC City Metro Station, Shilparamam, Mindspace IT Park, Kondapur and Gachibowli.",
    overview:
      "Hotel Supraja Cyber View is a well-located hotel in Madhapur for business travellers, event visitors and short Hyderabad stays. Its position opposite Shilpakala Vedika makes it especially convenient for guests attending programmes nearby, while HITEC City, Shilparamam, Mindspace, Kondapur and Gachibowli remain within the surrounding business and entertainment corridor.",
    why:
      "Choose Cyber View when your Hyderabad plans are centred around Madhapur or HITEC City. The location reduces unnecessary cross-city travel for many IT, event and business destinations, while the hotel provides comfortable rooms, everyday amenities and direct Call or WhatsApp contact with the property team.",
    nearbyIntro:
      "Guests searching for a hotel near HITEC City, Shilpakala Vedika or Shilparamam can use these nearby locations to judge whether Cyber View fits their itinerary:",
    final:
      "Planning to stay in Madhapur near HITEC City, Shilpakala Vedika or Shilparamam? Contact Hotel Supraja Cyber View directly to check available rooms and current rates.",
    highlights: ["Opposite Shilpakala Vedika", "Near HITEC City & Shilparamam", "Suitable for business and event stays"],
  },
  "supraja-residency": {
    eyebrow: "Hotel in Chandanagar Hyderabad",
    heading: "Hotel Supraja Residency in Chandanagar, Hyderabad",
    intro:
      "Comfortable accommodation near Gangaram in Chandanagar, with convenient access to Lingampally Railway Station, BHEL, Serilingampally, Nallagandla and Miyapur.",
    overview:
      "Hotel Supraja Residency is a comfortable hotel in Chandanagar for families, professionals and visitors travelling around western Hyderabad. The Gangaram location works well for guests whose plans involve Lingampally Railway Station, BHEL, Serilingampally, Nallagandla, Miyapur or nearby residential and business areas.",
    why:
      "Residency is a strong choice when Chandanagar is the right base for your visit. Guests get comfortable rooms and essential amenities without travelling unnecessarily toward central Hyderabad, with direct access to the property team by phone or WhatsApp for room and booking information.",
    nearbyIntro:
      "If you are looking for a hotel in Chandanagar or accommodation near Lingampally Railway Station and BHEL, these nearby areas can help you compare the location:",
    final:
      "Need a hotel in Chandanagar near Gangaram, Lingampally Railway Station or BHEL? Call or WhatsApp Hotel Supraja Residency to check rooms and current rates.",
    highlights: ["Near Gangaram, Chandanagar", "Convenient for Lingampally & BHEL", "Comfortable family and business stays"],
  },
  "supraja-lodge": {
    eyebrow: "Budget Hotel in Chandanagar",
    heading: "Hotel Supraja Lodge: Budget Stay in Chandanagar",
    intro:
      "Affordable rooms in Chandanagar for short stays, work trips and family visits, with access to Lingampally Railway Station, Gangaram, BHEL, Serilingampally and Miyapur.",
    overview:
      "Hotel Supraja Lodge is a budget hotel in Chandanagar for travellers who want straightforward accommodation in a convenient western Hyderabad location. It is suited to short visits, work trips and family travel around Lingampally Railway Station, Gangaram, BHEL, Serilingampally and Miyapur.",
    why:
      "Choose Supraja Lodge when value and location matter more than unnecessary extras. The property keeps you close to Chandanagar and nearby western Hyderabad destinations, with essential amenities and direct contact with the hotel team for available rooms and current rates.",
    nearbyIntro:
      "For guests comparing budget hotels in Chandanagar or accommodation near Lingampally and BHEL, these are the main nearby locations:",
    final:
      "Looking for an affordable hotel in Chandanagar near Lingampally Railway Station, Gangaram or BHEL? Contact Hotel Supraja Lodge directly for available rooms and current rates.",
    highlights: ["Budget-friendly Chandanagar stay", "Near Lingampally & BHEL", "Suitable for short and work stays"],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = hotels.find((item) => item.slug === slug);

  if (!hotel) {
    return { title: "Hotel Not Found", description: "The requested hotel page could not be found." };
  }

  const canonicalUrl = `${siteUrl}/hotels/${hotel.slug}`;
  const ogImageUrl = `${siteUrl}${hotelOgImages[hotel.slug] || "/images/social/supraja-hotels-og.jpg"}`;

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
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: hotel.seo.ogTitle,
      description: hotel.seo.ogDescription,
      url: canonicalUrl,
      siteName: "Supraja Hotels",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: hotel.seo.featuredImageAlt }],
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
  if (!hotel) notFound();

  const copy = searchCopy[hotel.slug];
  const whatsapp = `https://wa.me/91${hotel.whatsapp}?text=Hi%20I%20would%20like%20to%20check%20room%20availability%20at%20${encodeURIComponent(hotel.name)}`;

  return (
    <>
      <HotelSchema hotel={hotel} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteUrl },
          { name: "Hotels", url: `${siteUrl}/hotels` },
          { name: hotel.name, url: `${siteUrl}/hotels/${hotel.slug}` },
        ]}
      />
      <FAQSchema faqs={hotel.seo?.faqs?.map((f) => ({ question: f.question, answer: f.answer })) || []} />

      <main className="bg-white pb-20 text-slate-900 md:pb-0">
        <section className="relative isolate flex min-h-[650px] items-end overflow-hidden bg-slate-950 text-white md:min-h-[720px] md:items-center">
          <SmartImage src={hotel.images.hero} alt={hotel.seo.featuredImageAlt} fill isHero className="object-cover" sizes="100vw" />
          {hotelHeroVideos[hotel.slug] ? (
            <video autoPlay muted loop playsInline preload="metadata" poster={hotel.images.hero} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
              <source src={hotelHeroVideos[hotel.slug]} type="video/webm" />
            </video>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/48 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/10" />
          <div className="container-custom relative z-10 w-full px-5 pb-12 pt-32 sm:px-6 md:py-20">
            <div className="max-w-4xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-sm"><MapPin size={16} />{copy?.eyebrow || hotel.location}</p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">{copy?.heading || hotel.name}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/90 md:text-lg md:leading-8">{copy?.intro || hotel.description}</p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                {(copy?.highlights || ["Comfortable rooms", "Convenient location", "Direct Call & WhatsApp"]).map((x) => (
                  <span key={x} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-amber-300" />{x}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 text-sm font-bold text-white shadow-xl"><MessageCircle size={18} />Check Availability</a>
                <a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-slate-950"><Phone size={18} />Call {hotel.phone}</a>
                {hotel.googleBusinessUrl ? (
                  <a href={hotel.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-black/25 px-6 text-sm font-bold text-white backdrop-blur-sm"><Navigation size={17} />Directions</a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f5f1] px-4 py-16 lg:py-24">
          <div className="container-custom"><HotelGallery hotelName={hotel.name} hero={hotel.images.hero} gallery={hotel.images.gallery} /></div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-24">
          <div className="container-custom grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">About This Hotel</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{hotel.seo.focusKeyword}</h2>
              <p className="mt-6 max-w-3xl leading-8 text-slate-600">{copy?.overview}</p>
              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                If the location fits your plans, contact the hotel directly to check available rooms, the current rate for your dates and any stay-specific requirements.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {[
                  { title: "Comfortable Rooms", text: "Well-maintained accommodation for business, family and short stays.", icon: BedDouble },
                  { title: "Well-Connected Location", text: `Stay in ${hotel.area} with convenient access to the places that matter to your visit.`, icon: MapPin },
                  { title: "Direct Booking", text: "Call or WhatsApp the property team for rooms, rates and booking details.", icon: Phone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.5rem] bg-[#f7f5f1] p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-800 shadow-sm"><Icon size={21} /></div>
                      <h3 className="mt-5 font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-14">
                <h2 className="text-3xl font-bold tracking-tight">Why Choose {hotel.name}?</h2>
                <p className="mt-5 leading-8 text-slate-600">{copy?.why}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Comfortable and well-maintained rooms",
                    "Direct phone and WhatsApp contact",
                    "Parking available for guests",
                    "Convenient access to nearby locations",
                    "Suitable for business and family stays",
                    "Clear hotel, location and amenity information",
                  ].map((x) => (
                    <p key={x} className="flex gap-3 text-slate-700"><CheckCircle2 size={18} className="mt-1 shrink-0 text-green-700" />{x}</p>
                  ))}
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-xl lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Book Direct</p>
              <h3 className="mt-3 text-2xl font-bold">Check Rooms at {hotel.name}</h3>
              <p className="mt-3 leading-7 text-slate-300">Speak directly with the property team for available rooms, current rates and booking details.</p>
              <div className="mt-6 border-y border-white/15 py-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Phone</p>
                <p className="mt-1 text-xl font-bold">{hotel.phone}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Location</p>
                <p className="mt-1 text-sm leading-6">{hotel.location}</p>
              </div>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-sm font-bold"><MessageCircle size={17} />WhatsApp Hotel</a>
              <a href={`tel:+91${hotel.phone}`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-950"><Phone size={17} />Call Hotel</a>
            </aside>
          </div>
        </section>

        <section className="bg-[#f7f5f1] px-4 py-16 lg:py-24">
          <div className="container-custom grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Location</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Hotel Near Key Locations in {hotel.area}</h2>
              <p className="mt-5 leading-8 text-slate-600">{copy?.nearbyIntro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {hotel.seo.nearbyLandmarks.map((x) => <span key={x} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{x}</span>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">At the Hotel</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Amenities at {hotel.name}</h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {hotel.amenities.map((a) => {
                  const d = amenities.find((i) => i.title === a);
                  return (
                    <div key={a} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                      {d?.icon ? <SmartImage src={d.icon} alt={`${a} at ${hotel.name}`} width={32} height={32} /> : <div className="h-8 w-8 rounded-full bg-amber-50" />}
                      <span className="font-semibold">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:py-24">
          <div className="container-custom grid gap-10 lg:grid-cols-[1fr_.7fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700">Good to Know</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
              <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                {hotel.seo.faqs.map((f) => (
                  <div key={f.question} className="py-6">
                    <h3 className="font-bold">{f.question}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-[#f7f5f1] p-7">
              <ShieldCheck className="text-amber-800" size={28} />
              <h3 className="mt-4 text-xl font-bold">Plan Your Stay</h3>
              <p className="mt-3 leading-7 text-slate-600">Compare Supraja Hotels, view more property photos or read local Hyderabad stay guides to find the location that suits your visit.</p>
              <div className="mt-6 grid gap-3">
                {[
                  ["/hotels", "Compare Supraja Hotels"],
                  ["/gallery", "View Hotel Gallery"],
                  ["/blog", "Hyderabad Stay Guides"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 font-semibold">{label}<ArrowRight size={17} /></Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {hotel.mapEmbed ? <HotelMap title={hotel.name} embedUrl={hotel.mapEmbed} /> : null}

        <section className="bg-slate-950 px-4 py-16 text-white">
          <div className="container-custom flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Ready to Stay?</p>
              <h2 className="mt-2 text-3xl font-bold">Check Availability at {hotel.name}</h2>
              <p className="mt-3 max-w-2xl text-slate-300">{copy?.final}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-slate-950"><Phone size={17} />Call Hotel</a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 text-sm font-bold"><MessageCircle size={17} />WhatsApp</a>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(15,23,42,0.14)] md:hidden">
          <a href={`tel:+91${hotel.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold text-slate-950"><Phone size={18} />Call Hotel</a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 text-sm font-bold text-white"><MessageCircle size={18} />Check Availability</a>
        </div>
      </main>
    </>
  );
}
