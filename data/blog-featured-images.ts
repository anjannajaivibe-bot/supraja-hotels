export const blogFeaturedImages: Record<string, string> = {
  "hotels-near-shilpakala-vedika-hyderabad": "/images/blog/shilpakala-vedika-guide.svg",
  "budget-hotels-in-madhapur-hyderabad": "/images/blog/budget-madhapur-guide.svg",
  "hotels-near-hitex-hyderabad": "/images/blog/hitex-business-guide.svg",
  "hotels-near-lingampally-railway-station": "/images/blog/lingampally-rail-guide.svg",
  "hotels-near-bhel-hyderabad": "/images/blog/bhel-stay-guide.svg",
  "hotels-near-hitech-city-hyderabad": "/images/blog/hitech-city-guide.svg",
  "where-to-stay-in-madhapur": "/images/blog/madhapur-area-guide.svg",
  "hotels-near-chandanagar-and-miyapur": "/images/blog/chandanagar-miyapur-guide.svg",
  "corporate-stay-hotels-hyderabad": "/images/blog/corporate-stay-guide.svg",
};

export function getBlogFeaturedImage(slug: string, fallback: string) {
  return blogFeaturedImages[slug] ?? fallback;
}
