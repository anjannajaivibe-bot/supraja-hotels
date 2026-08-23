import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const siteUrl = "https://www.suprajahotels.com";
const ogImageUrl = `${siteUrl}/images/social/supraja-hotels-og.jpg`;
const googleAnalyticsId = "G-GNW9L105PW";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hotels in Hyderabad | Supraja Hotels",
    template: "%s | Supraja Hotels",
  },
  description:
    "Supraja Hotels offers comfortable hotels in Hyderabad with stays in Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur. View rooms and contact the hotel directly by Call or WhatsApp.",
  keywords: [
    "Hotels in Hyderabad",
    "Supraja Hotels",
    "Hotel in Madhapur Hyderabad",
    "Hotels near HITEC City",
    "Hotel in Chandanagar Hyderabad",
    "Hotel near Lingampally Railway Station",
    "Hotel near BHEL Hyderabad",
    "Budget hotel in Chandanagar",
    "Hotel Supraja Cyber View",
    "Hotel Supraja Residency",
    "Hotel Supraja Lodge",
  ],
  authors: [{ name: "Supraja Hotels" }],
  creator: "Supraja Hotels",
  publisher: "Supraja Hotels",
  category: "Hotel",
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Supraja Hotels",
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Stay in Madhapur near HITEC City or Chandanagar near Lingampally, BHEL and Miyapur. Explore Supraja Hotels and contact your preferred property directly.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Supraja Hotels in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels in Hyderabad | Supraja Hotels",
    description:
      "Hotels in Madhapur and Chandanagar with direct Call and WhatsApp booking assistance.",
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Supraja Hotels",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description:
    "Supraja Hotels operates three hotel properties in Hyderabad, with accommodation in Madhapur near HITEC City and Chandanagar near Lingampally, BHEL and Miyapur.",
  areaServed: { "@type": "City", name: "Hyderabad" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9550776161",
      email: "suprajacyberviewhotel@gmail.com",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-9346316161",
      email: "residency.suprajahotels@gmail.com",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-9348446161",
      email: "lodge.suprajahotels@gmail.com",
      contactType: "reservations",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Supraja Hotels",
  description:
    "Official website of Supraja Hotels in Hyderabad, with properties in Madhapur and Chandanagar.",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-IN",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${geistSans.variable} min-h-screen antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
