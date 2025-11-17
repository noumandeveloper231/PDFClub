import { Poppins, Oswald } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";


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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KBCWJBBTLW"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-KBCWJBBTLW');
    `}
        </Script>

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

          <footer className="w-full bg-gray-50 border-t border-gray-300">
            <div className="max-w-6xl w-full py-10 mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {/* About Section */}
              <div className="col-span-1 flex flex-col lg:col-span-1">
                <Image src="/logo.webp" alt="PDFClub Logo" width={100} height={100} className="self-center w-20 mb-4" />
                <p className="text-gray-600 text-sm mb-4">
                  PDFClub provides free online tools to compress, merge, split, and convert PDF files securely. Fast, easy, and no registration required.
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
                  <li><Link href="/terms-of-service" className="hover:text-blue-600">Terms of Service</Link></li>
                  <li><Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
                  <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
                </ul>
              </div>

              {/* Tools Section */}
              <div className="col-span-1 lg:col-span-1">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Tools</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/pdf-to-word" className="hover:text-blue-600">PDF to Word</Link></li>
                  <li><Link href="/compress-pdf" className="hover:text-blue-600">Compress PDF</Link></li>
                  <li><Link href="/merge-pdf" className="hover:text-blue-600">Merge PDF</Link></li>
                  <li><Link href="/split-pdf" className="hover:text-blue-600">Split PDF</Link></li>
                  <li><Link href="/pdf-to-image" className="hover:text-blue-600">PDF to Image</Link></li>
                  <li><Link href="/image-to-pdf" className="hover:text-blue-600">Image to PDF</Link></li>
                </ul>
              </div>

              {/* Resources Section */}
              <div className="col-span-1 lg:col-span-1">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
                  <li><Link href="/guides" className="hover:text-blue-600">Guides</Link></li>
                  <li><Link href="/tools-tutorials" className="hover:text-blue-600">Tutorials</Link></li>
                  <li><Link href="/support" className="hover:text-blue-600">Support</Link></li>
                </ul>
              </div>

              {/* Contact Section */}
              <div className="col-span-1 lg:col-span-1">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><Link href="/contact-us" className="hover:text-blue-600">Contact Us</Link></li>
                  <li><Link href="/about/team" className="hover:text-blue-600">Our Team</Link></li>
                  <li><a href="mailto:support@pdfclub.online" className="hover:text-blue-600">support@pdfclub.online</a></li>
                  <li><Link href="/careers" className="hover:text-blue-600">Careers</Link></li>
                </ul>
              </div>

              {/* Social Section */}
              <div className="col-span-1 lg:col-span-1">
                <h3 className="text-gray-800 text-xl font-bold mb-4">Follow Us</h3>
                <ul className="flex flex-col space-y-2 text-gray-600 text-sm">
                  <li><a href="https://twitter.com/pdfclub" target="_blank" className="hover:text-blue-600">Twitter</a></li>
                  <li><a href="https://facebook.com/pdfclub" target="_blank" className="hover:text-blue-600">Facebook</a></li>
                  <li><a href="https://linkedin.com/company/pdfclub" target="_blank" className="hover:text-blue-600">LinkedIn</a></li>
                  <li><a href="https://youtube.com/pdfclub" target="_blank" className="hover:text-blue-600">YouTube</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="py-5 border-t border-gray-300 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} PDFClub. All rights reserved.</p>
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
        <SpeedInsights />
      </body>
    </html>
  );
}