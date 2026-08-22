import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://suprajahotels.com";
const ogImageUrl = `${siteUrl}/images/social/supraja-hotels-og.jpg`;
const googleAnalyticsId = "G-GNW9L105PW";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Supraja Hotels Hyderabad",
    template: "%s | Supraja Hotels",
  },

  description:
    "Supraja Hotels offers comfortable stays in Hyderabad with Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge. Call or WhatsApp for direct booking support.",

  keywords: [
    "Supraja Hotels",
    "Hotels in Hyderabad",
    "Hotel Supraja Cyber View",
    "Hotel Supraja Residency",
    "Hotel Supraja Lodge",
    "Hotels near Hitech City",
    "Hotels in Madhapur",
    "Hotels in Chandanagar",
    "Budget Hotels Hyderabad",
    "Direct Hotel Booking Hyderabad",
  ],

  authors: [{ name: "Supraja Hotels" }],
  creator: "Supraja Hotels",
  publisher: "Supraja Hotels",
  category: "Hotel",

  alternates: {
    canonical: siteUrl,
  },

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
    title: "Supraja Hotels Hyderabad",
    description:
      "Comfortable stays in Hyderabad with direct booking support by phone or WhatsApp.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Supraja Hotels Hyderabad comfortable hotel rooms",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Supraja Hotels Hyderabad",
    description:
      "Comfortable stays in Hyderabad with direct booking support by phone or WhatsApp.",
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
  "@id": "https://suprajahotels.com/#organization",
  name: "Supraja Hotels",
  url: "https://suprajahotels.com",
  logo: "https://suprajahotels.com/favicon.ico",
  description:
    "Supraja Hotels operates hotel properties in Madhapur, Hitech City and Chandanagar, Hyderabad.",
  areaServed: {
    "@type": "City",
    name: "Hyderabad",
  },
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
  "@id": "https://suprajahotels.com/#website",
  url: "https://suprajahotels.com",
  name: "Supraja Hotels",
  description:
    "Comfortable stays across Hyderabad including Madhapur, Hitech City and Chandanagar.",
  publisher: {
    "@id": "https://suprajahotels.com/#organization",
  },
  inLanguage: "en-IN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className={`${geistSans.variable} min-h-screen antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
