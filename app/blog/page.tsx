import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import { blogPosts } from "@/data/blog-posts";
import { getBlogFeaturedImage } from "@/data/blog-featured-images";

export const metadata: Metadata = {
  title: "Hyderabad Hotel, Area & Stay Guides",
  description:
    "Read Hyderabad hotel and area guides covering Madhapur, HITEC City, Chandanagar, Lingampally, BHEL and nearby locations from Supraja Hotels.",
  alternates: { canonical: "https://www.suprajahotels.com/blog" },
  openGraph: {
    title: "Hyderabad Hotel & Stay Guides | Supraja Hotels",
    description: "Local guides to help travellers choose where to stay in Hyderabad.",
    url: "https://www.suprajahotels.com/blog",
    type: "website",
    images: ["https://www.suprajahotels.com/images/social/supraja-hotels-og.jpg"],
  },
};

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(`${b.publishedAt}T00:00:00`).getTime() - new Date(`${a.publishedAt}T00:00:00`).getTime(),
  );

  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="container-custom">
          <p className="font-semibold uppercase tracking-[0.22em] text-amber-400">Hyderabad Travel & Hotel Guides</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Where to Stay in Hyderabad: Hotel, Area and Local Guides</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Plan your stay with practical guides to Madhapur, HITEC City, Chandanagar, Lingampally, BHEL and nearby Hyderabad locations. Compare areas, understand nearby landmarks and choose a hotel closer to your destination.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Local Stay Planning</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Guides for Business Trips, Family Visits and Short Stays</h2>
            <p className="mt-4 leading-7 text-slate-600">Our guides focus on the questions travellers actually ask: which area is closer, what landmarks are nearby, what to check before booking and which Supraja Hotel fits the location best.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => {
              const featuredImage = getBlogFeaturedImage(post.slug, post.image);
              const isArtwork = featuredImage.endsWith(".svg");
              return (
                <article key={post.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <Image src={featuredImage} alt={post.imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={`${isArtwork ? "object-contain" : "object-cover"} transition duration-500 group-hover:scale-[1.02]`} />
                    </div>
                    <div className="p-7">
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} aria-hidden="true" />{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${post.publishedAt}T00:00:00`))}</span>
                        <span className="inline-flex items-center gap-1.5"><BookOpen size={15} aria-hidden="true" />{post.readingTime}</span>
                      </div>
                      <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-amber-700">{post.category}</p>
                      <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950">{post.title}</h2>
                      <p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-800">Read guide <ArrowRight size={17} aria-hidden="true" /></span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
