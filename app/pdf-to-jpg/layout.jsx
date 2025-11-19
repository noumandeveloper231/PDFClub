export const metadata = {
  title: 'PDF to JPG Online Free - Convert PDF Pages to Images',
  description:
    'Free online tool to convert PDF pages into JPG images. Fast, secure, and easy to use. Adjust quality and resolution. Download individually or as ZIP.',
  keywords:
    'pdf to jpg, convert pdf to image, pdf to jpeg, pdf image converter, pdfclub, pdf to jpg online',
  openGraph: {
    title: 'PDF to JPG Converter – Free Online Tool',
    description: 'Convert PDF pages into JPG images instantly. 100% free and secure.',
    type: 'website',
    url: 'https://pdfclub.online/pdf-to-jpg',
  },
  alternates: {
    canonical: 'https://pdfclub.online/pdf-to-jpg',
  },
};

export default function PDFToJPGLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to JPG Converter | PDFClub",
    "description": "Free online tool to convert PDF pages to JPG images",
    "url": "https://pdfclub.online/pdf-to-jpg",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Convert all pages",
      "Adjust quality and resolution",
      "Download images or ZIP",
      "Secure local processing",
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}