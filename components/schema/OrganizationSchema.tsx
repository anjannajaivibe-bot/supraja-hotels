const siteUrl = "https://www.suprajahotels.com";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: "Supraja Hotels",
    legalName: "Sri Supraja Residency",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/images/homepage/hero.webp`,
    email: "srisuprajahotels@gmail.com",
    telephone: "+91-9550776161",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Plot No. 4-91, Above Parampara Sweets, Chandanagar",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500050",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    foundingDate: "2007",
    knowsAbout: [
      "Hotels in Hyderabad",
      "Business Hotels",
      "Budget Hotels",
      "Family Accommodation",
      "Corporate Stays",
      "Hotel Booking",
    ],
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