import { Poppins, Oswald } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
// import { Analytics } from "@vercel/analytics/react"; // ✅ correct import path
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./components/Footer";


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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  title: 'Free PDF Merge & Split Tools Online - Combine & Separate PDF Files',
  description: 'Free online PDF tools to merge multiple PDFs into one file or split large PDFs into separate pages. Fast, secure, and no registration required. Works in your browser.',
  keywords: 'merge pdf, split pdf, combine pdf, pdf merger, pdf splitter, online pdf tools, free pdf tools',
  author: 'PDF Tools Online',
  robots: 'index, follow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/logo.webp', sizes: '192x192', type: 'image/webp' },
    ],
    apple: [
      { url: '/logo.webp', sizes: '180x180', type: 'image/webp' },
    ],
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://pdfclub.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PDFClub – Free PDF Tools",
    description: "Fast, free, and private PDF tools online. Convert PDF to Word, compress, merge, and split documents instantly.",
    url: 'https://pdfclub.online',
    siteName: 'PDFClub',
    images: [
      {
        url: 'https://pdfclub.online/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PDFClub - Free PDF Tools Online',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PDFClub – Free PDF Tools",
    description: "Convert and manage PDFs instantly online. Fast, free, and secure.",
    images: ['https://pdfclub.online/og-image.png'],
    creator: '@pdfclub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Qzn2y3b_QvyrBKdiQHgXxXYMSCAaKktNnhjl8JyHsa0',
    yandex: 'a2b9c989ef8ce275',
    yahoo: '4381B1C5349384186D59C3DD02256449',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PDFClub",
    "description": "Free online PDF tools for everyone. Convert PDF to Word, compress PDFs, merge & split documents.",
    "url": "https://pdfclub.online",
    "logo": "https://pdfclub.online/og-image.png",
    "sameAs": [
      "https://twitter.com/pdfclub",
      "https://facebook.com/pdfclub",
      "https://linkedin.com/company/pdfclub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "serviceType": "PDF Tools",
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free PDF conversion and editing tools",
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "PDF Tools",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PDF to Word Conversion",
            "description": "Convert PDF documents to editable Word format"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PDF Compression",
            "description": "Reduce PDF file size while maintaining quality"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PDF Merge",
            "description": "Combine multiple PDF files into one document"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PDF Split",
            "description": "Split PDF documents into separate pages or sections"
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${oswald.variable} antialiased font-poppins`}
      >
        <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-blue-50">
          <Navigation />
          <main className="flex-1 p-4 md:p-3 lg:p-0">{children}</main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              fontFamily: "var(--font-poppins)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f8fafc",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f8fafc",
              },
            },
          }}
        />

        {/* ✅ Place Analytics here */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}