export const metadata = {
  title: 'Split PDF Online Free - Separate PDF Pages into Individual Files',
  description:
    'Free online PDF splitter to extract pages from PDF documents. Split PDF by range, single page, or reduce file size. Fast, secure, and no registration required.',
  keywords:
    'split pdf, pdf splitter, extract pdf pages, separate pdf, split pdf online, pdf page extractor, free pdf splitter, pdfclub',
  openGraph: {
    title: 'Free PDF Splitter - Split PDF Pages Online',
    description:
      'Split PDF documents into separate pages or extract specific page ranges. 100% free and secure.',
    type: 'website',
    url: 'https://pdfclub.online/split',
  },
  alternates: {
    canonical: 'https://pdfclub.online/split',
  },
};

export default function SplitLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Splitter Online Pdf Assist Tool | PDFClub",
    "description":
      "Free online tool to split PDF documents into separate pages or extract page ranges",
    "url": "https://pdfclub.online/split",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Split PDF by page ranges",
      "Extract individual pages",
      "Visual page preview",
      "Secure processing",
      "No registration required"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
