import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/FloatingCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://suprajahotels.com"),

  title: {
    default: "Supraja Hotels Hyderabad",
    template: "%s | Supraja Hotels",
  },

  description:
    "Supraja Hotels offers comfortable stays in Hyderabad with Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge. Direct booking available.",

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
    canonical: "/",
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
    url: "https://suprajahotels.com",
    siteName: "Supraja Hotels",
    title: "Supraja Hotels Hyderabad",
    description:
      "Comfortable stays in Hyderabad with Hotel Supraja Cyber View, Hotel Supraja Residency and Hotel Supraja Lodge.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Supraja Hotels Hyderabad comfortable hotel rooms",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Supraja Hotels Hyderabad",
    description: "Comfortable stays in Hyderabad with direct booking support.",
    images: ["/og-image.jpg"],
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
  department: [
    {
      "@type": "Hotel",
      name: "Hotel Supraja Cyber View",
      telephone: "+91-9550776161",
      email: "suprajacyberviewhotel@gmail.com",
      image: "https://suprajahotels.com/images/cyber-view/hero.webp",
      sameAs: [
        "https://www.google.com/search?q=Supraja+Cyber+View+Hotel&stick=H4sIAAAAAAAA_-NgU1I1qDBOSk6yNDY0sjAyNDGxtEyxMqhINDczNbQwNjAwMLU0SbUwXcQqEVxaUJSYlajgXJmUWqQQlplaruCRX5KaAwBd4sOkRAAAAA&hl=en&mat=CdhO8Zxu0Ei_ElcBTVDHnrfVIK4FF2yEgwfvPn7PucGF2gzCQClNVPZPQPFqCyeS2pAiIg0Aj9eL8qsqsC8GtdLKwYz7KSHEVc4ZJFVMmMf_iPzqav-cgDMNomdf_iOspWA&authuser=0",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Plot No. 8, Rohini Layout, Opp. Shilpa Kalavedika, Madhapur, Hitech City, Serilingampally Mandal",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500081",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Hotel",
      name: "Hotel Supraja Residency",
      telephone: "+91-9346316161",
      email: "residency.suprajahotels@gmail.com",
      image: "https://suprajahotels.com/images/residency/hero.webp",
      sameAs: [
        "https://www.google.com/search?q=Supraja+Residency&stick=H4sIAAAAAAAA_-NgU1I1qDBOSk6yNLI0TDM3MUwzMTe3MqgwTDY1NjIxMktJs7AwSUtNXcQqGFxaUJSYlagQlFqcmZKal1wJAGUC_hM9AAAA&hl=en&mat=CcC4AqNkK0hYElMBa0lj_8QP6DVj6BCTrs5ubCw2IIr7SyKBedPEoVR0sicpfG_ndMhrTXOq6T7HdDRob2PtwEnqKageL0vDpKrMA-X1GFQkK5_CVCHxAbRssyvS0g&authuser=0",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot No. 4-91, Above Parampara Sweets, Chandanagar",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500050",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Hotel",
      name: "Hotel Supraja Lodge",
      telephone: "+91-9348446161",
      email: "lodge.suprajahotels@gmail.com",
      image: "https://suprajahotels.com/images/lodge/hero.webp",
      sameAs: [
        "https://www.google.com/search?q=SRI+SUPRAJA+LODGE&stick=H4sIAAAAAAAA_-NgU1I1qDBOSk6yNLI0NDdONrUwMTK0MqhINU82sTC0MDe2tDQ2S0xMWsQqGBzkqRAcGhDk6OWo4OPv4u4KAOLST2Q9AAAA&hl=en&mat=CcxgzRAS0EZUElYBTVDHnlOMKVAAUkkKccmTvrU441uJLbpEUMRVXjyln_ZikLJM1778VKnioLAMAiR8spmKl9X9RNeo3dBIKhZxdS4TzVvTrAZpITd1uSdV1_CyCA04Uw&authuser=0",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "D.No. 2-57/1, Tudi Towers, Beside Bajaj Electronics, Chandanagar",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500050",
        addressCountry: "IN",
      },
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

        <Header />

        <main>{children}</main>

        <Footer />

        <FloatingCTA />
      </body>
    </html>
  );
}
