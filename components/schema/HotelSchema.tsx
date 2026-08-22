type HotelSchemaProps = {
  hotel: {
    slug: string;
    name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    priceRange: string;
    checkInTime: string;
    checkOutTime: string;
    mapEmbed?: string;
    googleBusinessUrl?: string;
    geo: {
      latitude: number;
      longitude: number;
    };
    images: {
      hero: string;
      gallery: string[];
    };
    amenities?: string[];
  };
};

const siteUrl = "https://suprajahotels.com";

export default function HotelSchema({ hotel }: HotelSchemaProps) {
  const hotelUrl = `${siteUrl}/hotels/${hotel.slug}`;
  const heroImage = `${siteUrl}${hotel.images.hero}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${hotelUrl}#hotel`,
    name: hotel.name,
    url: hotelUrl,
    sameAs: hotel.googleBusinessUrl ? [hotel.googleBusinessUrl] : undefined,
    description: hotel.description,
    image: [
      heroImage,
      ...hotel.images.gallery.map((image) => `${siteUrl}${image}`),
    ],
    telephone: `+91-${hotel.phone}`,
    email: hotel.email,
    priceRange: hotel.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address,
      addressLocality: hotel.city,
      addressRegion: hotel.state,
      postalCode: hotel.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.geo.latitude,
      longitude: hotel.geo.longitude,
    },
    checkinTime: hotel.checkInTime,
    checkoutTime: hotel.checkOutTime,
    amenityFeature:
      hotel.amenities?.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })) ?? [],
    petsAllowed: false,
    smokingAllowed: false,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    hasMap: hotel.googleBusinessUrl || hotel.mapEmbed,
    parentOrganization: {
      "@id": `${siteUrl}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
