export const metadata = {
  title: 'Merge PDF Online Free - Combine Multiple PDF Files into One Document',
  description:
    'Free online PDF merger tool to combine multiple PDF files into one document. Fast, secure, and easy to use. Merge pdf documents online no registration required. Merge PDFs in seconds.',
  keywords:
    'merge pdf, combine pdf, pdf merger, pdf to pdf merge, merge pdf files, merge pdf documents, free pdf merger, pdfclub, pdf merge online, pdf to pdf merge',
  openGraph: {
    title: 'Free PDF Merger - Combine Multiple PDFs Online',
    description: 'Merge multiple PDF files into one document instantly. 100% free and secure.',
    type: 'website',
    url: 'https://pdfclub.online/merge',
  },
  alternates: {
    canonical: 'https://pdfclub.online/merge',
  },
};

export default function MergeLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Merger Online | PDFClub",
    "description": "Free online tool to merge multiple PDF files into one document",
    "url": "https://pdfclub.online/merge",
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Merge multiple PDFs",
      "Drag and drop interface",
      "No file size limits",
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
