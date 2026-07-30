import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  Phone,
} from "lucide-react";

import { blogPosts, getBlogPost } from "@/data/blog-posts";

const siteUrl = "https://suprajahotels.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Hotel Guide Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = `${siteUrl}${post.image}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [post.focusKeyword, ...post.synonyms, ...post.tags],
    authors: [{ name: post.author }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: "Supraja Hotels",
      title: post.ogTitle,
      description: post.ogDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle,
      description: post.ogDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: [`${siteUrl}${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Supraja Hotels",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/social/supraja-hotels-og.jpg`,
      },
    },
    mainEntityOfPage: canonicalUrl,
    inLanguage: "en-IN",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="bg-white text-slate-900">
      {[articleSchema, breadcrumbSchema, faqSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}

      <article>
        <header className="bg-slate-950 px-4 py-16 text-white md:py-20">
          <div className="container-custom max-w-5xl">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              All hotel guides
            </Link>

            <p className="mt-8 font-semibold uppercase tracking-[0.2em] text-amber-400">
              {post.category}
            </p>
            <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              {post.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={17} aria-hidden="true" />
                Published{" "}
                {new Intl.DateTimeFormat("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(`${post.publishedAt}T00:00:00`))}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen size={17} aria-hidden="true" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        <div className="container-custom max-w-5xl px-4 py-12 md:py-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-slate-100 shadow-xl">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(max-width: 1100px) 100vw, 1000px"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <div className="space-y-6 text-lg leading-9 text-slate-700">
              {post.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <aside className="my-10 rounded-3xl border border-blue-100 bg-blue-50 p-7">
              <h2 className="text-xl font-bold text-slate-950">
                Quick recommendation
              </h2>
              <p className="mt-3 leading-8 text-slate-700">
                {post.recommendation.text}{" "}
                <Link
                  href={post.recommendation.href}
                  className="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4"
                >
                  {post.recommendation.anchor}
                </Link>
                .
              </p>
            </aside>

            {post.sections.map((section, sectionIndex) => {
              const Heading = section.level === 2 ? "h2" : "h3";
              return (
                <section key={section.heading} className="mt-12">
                  <Heading
                    className={
                      section.level === 2
                        ? "text-3xl font-bold leading-tight text-slate-950"
                        : "text-2xl font-bold leading-tight text-slate-950"
                    }
                  >
                    {section.heading}
                  </Heading>

                  <div className="mt-5 space-y-5 text-lg leading-9 text-slate-700">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets ? (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 leading-7 text-slate-700"
                        >
                          <CheckCircle2
                            className="mt-1 h-5 w-5 shrink-0 text-green-600"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {sectionIndex === 1 || sectionIndex === 5 ? (
                    <figure className="mt-9">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100">
                        <Image
                          src={
                            post.supportingImages[sectionIndex === 1 ? 0 : 1]
                              .src
                          }
                          alt={
                            post.supportingImages[sectionIndex === 1 ? 0 : 1]
                              .alt
                          }
                          fill
                          sizes="(max-width: 800px) 100vw, 760px"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                        {
                          post.supportingImages[sectionIndex === 1 ? 0 : 1]
                            .caption
                        }
                      </figcaption>
                    </figure>
                  ) : null}
                </section>
              );
            })}

            <div className="mt-12 space-y-3 text-lg leading-9 text-slate-700">
              {post.externalLinks.map((link) => (
                <p key={link.href}>
                  {link.context}{" "}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4"
                  >
                    {link.anchor}
                  </a>
                  .
                </p>
              ))}
            </div>

            <section className="mt-14">
              <h2 className="text-3xl font-bold text-slate-950">
                Frequently Asked Questions
              </h2>
              <div className="mt-6 space-y-4">
                {post.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <summary className="cursor-pointer list-none font-bold text-slate-950">
                      {faq.question}
                    </summary>
                    <p className="mt-3 leading-7 text-slate-700">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <p className="mt-12 text-lg font-medium leading-9 text-slate-800">
              {post.conclusion}
            </p>
          </div>
        </div>

        <section className="bg-slate-950 px-4 py-16 text-white">
          <div className="container-custom max-w-4xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              {post.cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
              {post.cta.text}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`tel:+91${post.cta.phone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3 font-bold text-white hover:bg-blue-600"
              >
                <Phone size={18} aria-hidden="true" />
                Call {post.cta.phone}
              </a>
              <a
                href={`https://wa.me/91${post.cta.phone}?text=${encodeURIComponent(post.cta.whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-500"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp Booking
              </a>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
