export const metadata = {
  title: 'PDF Compressor Online Free - Reduce PDF File Size Instantly | PDFClub',
  description:
    'Use our powerful PDF Compressor to reduce the file size online for free. Our free PDF compressor is designed to shrink pdf file without reducing quality. With PDFClub, you can minimize your PDF size in seconds and download the compressed file instantly.',
  keywords:
    'pdf compressor, compress pdf, reduce pdf size, decrease pdf size, pdf file compressor, shrink pdf size, pdfclub, minimize pdf size',
  openGraph: {
    title: 'Free PDF Compressor - Reduce PDF File Size Online | PDFClub',
    description:
      'Compress PDF files online instantly with PDFClub’s free PDF compressor. Fast, secure, and easy to use.',
    type: 'website',
    url: 'https://pdfclub.online/compress',
  },
  alternates: {
    canonical: 'https://pdfclub.online/compress',
  },
};

export default function CompressLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Compressor Online | PDFClub",
    "description": "Free online tool to compress PDF files and reduce their file size without losing quality.",
    "url": "https://pdfclub.online/compress",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Compress PDF files quickly",
      "Drag and drop interface",
      "Maintain PDF quality",
      "Secure processing",
      "No registration required",
    ],
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
