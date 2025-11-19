import { Poppins, Oswald } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

// Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

// Viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Metadata
export const metadata = {
  title: "Free PDF Merge & Split Tools Online - Combine & Separate PDF Files",
  description:
    "Free online PDF tools to merge multiple PDFs into one file or split large PDFs into separate pages. Fast, secure, and no registration required.",
  keywords:
    "merge pdf, split pdf, combine pdf, pdf merger, pdf splitter, online pdf tools, free pdf tools",
  author: "PDF Tools Online",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/logo.webp", sizes: "192x192", type: "image/webp" },
    ],
    apple: [{ url: "/logo.webp", sizes: "180x180", type: "image/webp" }],
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL("https://pdfclub.online"),
  alternates: { canonical: "https://pdfclub.online" },
  openGraph: {
    title: "PDFClub – Free PDF Tools",
    description:
      "Fast, free, and private PDF tools online. Convert PDF to Word, compress, merge, and split documents instantly.",
    url: "https://pdfclub.online",
    siteName: "PDFClub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDFClub - Free PDF Tools Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFClub – Free PDF Tools",
    description: "Convert and manage PDFs instantly online. Fast, free, and secure.",
    images: ["/og-image.png"],
    creator: "@pdfclub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Qzn2y3b_QvyrBKdiQHgXxXYMSCAaKktNnhjl8JyHsa0",
    yandex: "a2b9c989ef8ce275",
    yahoo: "4381B1C5349384186D59C3DD02256449",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PDFClub",
    description:
      "Free online PDF tools for everyone. Convert PDF to Word, compress PDFs, merge & split documents.",
    url: "https://pdfclub.online",
    logo: "https://pdfclub.online/og-image.png",
    sameAs: [
      "https://twitter.com/pdfclub",
      "https://facebook.com/pdfclub",
      "https://linkedin.com/company/pdfclub",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "PDF Tools",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PDF Compression",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PDF Merge",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PDF Split",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "PDF to JPG",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      {/* ✔ No <head> tag — Next.js inserts its own */}
      <body className={`${poppins.variable} ${oswald.variable} antialiased font-poppins`}>
        {/* --------------------------------------------- */}
        {/* SEO Scripts + JSON-LD                        */}
        {/* --------------------------------------------- */}

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Preload font for speed */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
          <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
          </noscript>


          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-KBCWJBBTLW"
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KBCWJBBTLW');
        `}
          </Script>

          {/* Organization Schema */}
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* WebSite Schema */}
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "PDFClub",
                url: "https://pdfclub.online",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://pdfclub.online/search?q={search}",
                  "query-input": "required name=search",
                },
              }),
            }}
          />

          {/* --------------------------------------------- */}
          {/* Main Layout                                   */}
          {/* --------------------------------------------- */}

          <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-blue-50">
            <Navigation />
            <main className="flex-1 p-4 md:p-3 lg:p-0">{children}</main>

            {/* Footer */}
            <footer className="w-full bg-gray-50 border-t border-gray-300">
              <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">

                <div>
                  <Image src="/logo.webp" alt="PDFClub Logo" width={100} height={100} className="w-20 mb-4" />
                  <p className="text-gray-600 text-sm mb-4">
                    PDFClub provides free online tools to compress, merge, split, and convert PDF files securely.
                  </p>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/terms-of-service">Terms of Service</Link></li>
                    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link href="/faq">FAQ</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-800 text-xl font-bold mb-4">Tools</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li><Link href="/compress">Compress PDF</Link></li>
                    <li><Link href="/merge">Merge PDF</Link></li>
                    <li><Link href="/split">Split PDF</Link></li>
                    <li><Link href="/pdf-to-jpg">PDF to JPG</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-800 text-xl font-bold mb-4">Contact</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li><Link href="/contact-us">Contact Us</Link></li>
                    <li><Link href="/about/team">Our Team</Link></li>
                    <li><a href="mailto:support@pdfclub.online">support@pdfclub.online</a></li>
                    <li><Link href="/careers">Careers</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-800 text-xl font-bold mb-4">Follow Us</h3>
                  <ul className="flex flex-col space-y-2 text-gray-600 text-sm">
                    <li><a href="https://twitter.com/pdfclub">Twitter</a></li>
                    <li><a href="https://facebook.com/pdfclub">Facebook</a></li>
                    <li><a href="https://linkedin.com/company/pdfclub">LinkedIn</a></li>
                    <li><a href="https://youtube.com/pdfclub">YouTube</a></li>
                  </ul>
                </div>
              </div>

              <div className="py-5 border-t border-gray-300 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} PDFClub. All rights reserved.</p>
              </div>
            </footer>
          </div>

          <Toaster position="top-right" />

          {/* Vercel Analytics */}
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
  );
}
