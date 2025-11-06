import { Poppins, Oswald } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
// import { Analytics } from "@vercel/analytics/react"; // ✅ correct import path
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"


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

export const metadata = {
  title: "PDFClub – Free PDF to Word, Merge & Compress Tools",
  description: "Convert, merge, compress, and edit PDFs instantly. PDFClub offers 100% free, secure online PDF tools with no signup required.",
  keywords: "pdf, pdf to word, compress pdf, merge pdf, pdf tools online, free pdf converter, split pdf, pdf editor, document converter",
  authors: [{ name: "PDFClub" }],
  creator: "PDFClub",
  publisher: "PDFClub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
          <Navigation />
          <main className="flex-1 p-4 md:p-3 lg:p-0">{children}</main>

          <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-12">
            <div className="max-w-6xl mx-auto text-center">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    OnClick PDF
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Professional PDF to DOCX conversion made simple and secure.
                  </p>
                </div>
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    Features
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• Instant Conversion</li>
                    <li>• Secure Processing</li>
                    <li>• High Quality Output</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-oswald font-semibold text-lg mb-4">
                    Support
                  </h3>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>• 24/7 Available</li>
                    <li>• No Registration</li>
                    <li>• Free to Use</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-8">
                <p className="text-slate-400 text-sm">
                  © 2024 OnClick PDF. Powered by ConvertAPI • Secure and Fast
                  Conversion
                </p>
              </div>
            </div>
          </footer>
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
        <SpeedInsights/>
      </body>
    </html>
  );
}