import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Hyderabad Hotel and Stay Guides",
  description:
    "Read practical Hyderabad hotel, location and travel guides from Supraja Hotels to plan a comfortable stay and book with confidence.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Hyderabad Hotel and Stay Guides | Supraja Hotels",
    description:
      "Practical local guidance for comfortable hotel stays across Hyderabad.",
    url: "/blog",
    type: "website",
    images: ["/images/social/supraja-hotels-og.jpg"],
  },
};

export default function BlogPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 px-4 py-20 text-white md:py-28">
        <div className="container-custom">
          <p className="font-semibold uppercase tracking-[0.22em] text-amber-400">
            Supraja Hotels
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Hyderabad Hotel and Stay Guides
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Practical local guidance to help business travellers, families and
            short-stay guests choose the right Hyderabad location and book with
            confidence.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-7">
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={15} aria-hidden="true" />
                        {new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(`${post.publishedAt}T00:00:00`))}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen size={15} aria-hidden="true" />
                        {post.readingTime}
                      </span>
                    </div>

                    <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-amber-700">
                      {post.category}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950">
                      {post.title}
                    </h2>
                    <p className="mt-4 leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-800">
                      Read guide
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
