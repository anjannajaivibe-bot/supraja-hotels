import type { Metadata } from "next";
import Link from "next/link";
import {
  BedDouble,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { hotels } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Supraja Direct Advantage | Hotel Offers in Hyderabad",
  description:
    "Explore direct booking, corporate, long-stay, group, day-use and event stay enquiries at Supraja Hotels in Madhapur and Chandanagar, Hyderabad.",
  alternates: { canonical: "/offers" },
  openGraph: {
    title: "Supraja Direct Advantage | Supraja Hotels",
    description:
      "Explore direct booking advantages for corporate, extended, group, day-use and event stays at Supraja Hotels in Hyderabad.",
    url: "/offers",
    siteName: "Supraja Hotels",
    images: [
      {
        url: "/images/social/supraja-hotels-og.jpg",
        width: 1200,
        height: 630,
        alt: "Supraja Direct Advantage hotel offers in Hyderabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

const directAdvantages = [
  {
    title: "Book Direct Advantage",
    text: "Contact the hotel directly for the current direct rate, room availability and booking assistance for your stay dates.",
    icon: Phone,
    message: "Hi, I would like to check the current direct booking rate and availability at Supraja Hotels.",
    badge: "Direct booking",
  },
  {
    title: "Corporate Advantage",
    text: "For business travellers, company staff, consultants and project teams. Ask about negotiated corporate stay arrangements and recurring requirements.",
    icon: BriefcaseBusiness,
    message: "Hi, I would like to discuss a corporate stay requirement with Supraja Hotels.",
    badge: "Business stays",
  },
  {
    title: "Stay Longer Advantage",
    text: "Planning an extended stay? Ask about current weekly, fortnightly and monthly stay options based on property and availability.",
    icon: CalendarCheck,
    message: "Hi, I would like to check long-stay options and rates at Supraja Hotels.",
    badge: "7+ nights",
  },
  {
    title: "Group Advantage",
    text: "Coordinate multiple rooms for family functions, staff travel, event guests and small groups with one direct hotel contact.",
    icon: Users,
    message: "Hi, I would like to enquire about a group room booking at Supraja Hotels.",
    badge: "Multiple rooms",
  },
  {
    title: "Flexible Day Stay",
    text: "Need a room for part of the day? Ask about day-use availability at selected properties. Duration and pricing depend on the hotel and date.",
    icon: Clock3,
    message: "Hi, I would like to check day-use room availability at Supraja Hotels.",
    badge: "Selected properties",
  },
  {
    title: "Event + Stay Advantage",
    text: "Planning a function at Saket Banquet Hall? Ask about combining the event requirement with guest rooms at Hotel Supraja Residency.",
    icon: Sparkles,
    message: "Hi, I would like to enquire about Saket Banquet Hall with guest room requirements.",
    badge: "Saket + Residency",
  },
];

const directSteps = [
  "Share your stay dates, preferred hotel and number of guests or rooms.",
  "Our hotel team checks current availability and the applicable direct stay option.",
  "Confirm the booking directly with the property after reviewing the final rate and inclusions.",
];

export default function OffersPage() {
  return (
    <main className="bg-white pb-20 text-slate-900 md:pb-0">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <SmartImage
          src={hotels[0].images.hero}
          alt="Supraja Direct Advantage offers at Supraja Hotels Hyderabad"
          fill
          isHero
          className="object-cover opacity-65"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/72 to-slate-950/35" />
        <div className="container-custom relative z-10 px-5 py-20 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">
              Supraja Direct Advantage
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              More Ways to Stay and Book Directly
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              Explore direct booking, corporate, long-stay, group, day-use and event stay options across our Madhapur and Chandanagar hotels. Share your requirement and we will help you identify the most suitable current option.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">
              {[
                "Direct hotel contact",
                "Corporate enquiries",
                "Extended stays",
                "Group bookings",
                "Day-use enquiries",
              ].map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-amber-300" />
                  {x}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20Supraja%20Direct%20Advantage%20offers%20and%20room%20availability."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-700 px-7 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <MessageCircle size={18} />
                Check Direct Options
              </a>
              <a
                href="tel:+919550776161"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                <Phone size={18} />
                Call Supraja Hotels
              </a>
            </div>
            <p className="mt-5 max-w-3xl text-xs leading-6 text-slate-300">
              Rates, inclusions, eligibility and availability can vary by property and stay dates. Final booking details are confirmed directly by the hotel.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f1] px-4 py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-800">
              Direct Stay Options
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Choose the Advantage That Fits Your Stay
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-700">
              Instead of one generic discount, Supraja Hotels offers different direct enquiry routes for different guest needs. This helps us match the stay type, property and current availability more accurately.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {directAdvantages.map((item, i) => {
              const Icon = item.icon;
              const hotel = hotels[i % hotels.length];
              const whatsapp = `https://wa.me/919550776161?text=${encodeURIComponent(item.message)}`;

              return (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative h-52">
                    <SmartImage
                      src={hotel.images.hero}
                      alt={`${item.title} at Supraja Hotels Hyderabad`}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                      {item.badge}
                    </span>
                    <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-800">
                      <Icon size={22} />
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 min-h-[84px] leading-7 text-slate-700">{item.text}</p>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 text-sm font-bold text-white transition hover:bg-green-800"
                    >
                      <MessageCircle size={17} />
                      Enquire on WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:py-24">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-800">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              A Simpler Way to Book Direct
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-700">
              Direct booking should be easy. Tell us what you need, and the hotel team can respond with the current room option, rate and applicable stay benefit.
            </p>
          </div>

          <div className="space-y-4">
            {directSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-[1.5rem] border border-slate-200 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="pt-1 leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
              Corporate & Extended Stay Desk
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Regular Company Requirement or Longer Stay?
            </h2>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">
              For recurring company bookings, project teams, consultants or longer stays, share the expected stay pattern with us. We can route the enquiry to the property that best matches the required location.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20discuss%20a%20corporate%20or%20extended%20stay%20requirement%20with%20Supraja%20Hotels."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-700 px-7 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <BriefcaseBusiness size={18} />
                Discuss Requirement
              </a>
              <Link
                href="/hotels"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950"
              >
                Compare Our Hotels
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f1] px-4 py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-800">
              Choose a Property
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Pick the Hotel Closest to Your Work, Event or Family Visit
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-slate-700">
              Choose Madhapur for HITEC City and nearby IT destinations, or Chandanagar for Lingampally, BHEL, Serilingampally, Nallagandla and Miyapur.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {hotels.map((h) => (
              <article key={h.slug} className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
                <div className="relative h-60">
                  <SmartImage
                    src={h.images.hero}
                    alt={h.seo.featuredImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw,33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{h.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{h.location}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:+91${h.phone}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm font-bold text-slate-900 transition hover:border-blue-800 hover:text-blue-800"
                    >
                      <Phone size={16} />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/91${h.whatsapp}?text=${encodeURIComponent(
                        `Hi, I would like to check the current direct booking options at ${h.name}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-700 text-sm font-bold text-white transition hover:bg-green-800"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  </div>
                  <Link
                    href={`/hotels/${h.slug}`}
                    className="mt-4 inline-block text-sm font-bold text-blue-800 hover:underline"
                  >
                    View hotel details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="container-custom">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
                  Ready to Check?
                </p>
                <h2 className="mt-2 text-3xl font-bold">Share Your Dates and Stay Requirement</h2>
                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  We will help you identify the relevant hotel and current direct booking option.
                </p>
              </div>
              <a
                href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20Supraja%20Direct%20Advantage%20options."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-700 px-7 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <MessageCircle size={17} />
                WhatsApp Supraja Hotels
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-slate-200 bg-white p-2 shadow-[0_-8px_30px_rgba(15,23,42,.14)] md:hidden">
        <a
          href="tel:+919550776161"
          className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-bold text-slate-950"
        >
          <Phone size={18} />
          Call
        </a>
        <a
          href="https://wa.me/919550776161?text=Hi%20I%20would%20like%20to%20check%20Supraja%20Direct%20Advantage%20offers."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-700 text-sm font-bold text-white"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </main>
  );
}
