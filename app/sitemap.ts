import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.suprajahotels.com";
  // Public pages were revalidated after the canonical host/redirect audit.
  // Keep the sitemap on the canonical www host only so Google does not
  // discover the redirecting apex-domain variants from our own sitemap.
  const publicPagesUpdatedAt = new Date("2026-10-10");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: publicPagesUpdatedAt, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hotels`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/hotels/supraja-cyber-view`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/hotels/supraja-residency`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/hotels/supraja-lodge`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/saket-banquet-hall`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/gallery`, lastModified: publicPagesUpdatedAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/offers`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: publicPagesUpdatedAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: publicPagesUpdatedAt, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: publicPagesUpdatedAt, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: publicPagesUpdatedAt, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: publicPagesUpdatedAt, changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticPages, ...blogPages];
}
