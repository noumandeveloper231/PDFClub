import { LucideMessageCircleQuestion } from "lucide-react";
import CompressionComponent from "./CompressionComponent";
import Script from "next/script";

export default function CompressPDFPage() {
  const faqs = [
    {
      id: 1,
      question: "Will compressing a PDF reduce its quality?",
      answer: "Yes, compression can reduce quality — especially for images — depending on the compression level you choose."
    },
    {
      id: 2,
      question: "How much can I compress a PDF without losing too much quality?",
      answer: "It depends on content: text‑heavy PDFs compress less aggressively, but image‑heavy ones can be reduced significantly while preserving readability."
    },
    {
      id: 3,
      question: "What are the different compression settings (high, medium, low) used for?",
      answer: "High compression gives the smallest file size with more quality loss; medium balances size and quality; low preserves quality but reduces size less."
    },
    {
      id: 4,
      question: "Can I compress a PDF to a specific file size, like 100 KB or 1 MB?",
      answer: "Many tools allow target size compression, but how small you can go depends on the original content, resolution, and embedded elements."
    },
    {
      id: 5,
      question: "Is PDF compression safe for confidential or important documents?",
      answer: "Yes — compression doesn’t inherently make a PDF less secure — but be careful with tools and ensure they don’t store your files."
    },
    {
      id: 6,
      question: "What is the difference between lossless and lossy PDF compression?",
      answer: "Lossless compression preserves image/text quality but gives smaller reduction; lossy compression reduces size more but sacrifices some quality. :contentReference[oaicite:0]{index=0}"
    },
    {
      id: 7,
      question: "Why is my PDF still large even after compression?",
      answer: "If your PDF has very high-res images, embedded fonts, or already optimized content, further compression may not greatly reduce size. :contentReference[oaicite:1]{index=1}"
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-rose-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Compress Club</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compress PDF Online Free - PDFClub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Use our powerful PDF Compressor to reduce your PDF file size online for free. Our PDF file compressor is designed to shrink your PDFs without compromising quality. With PDFClub, you can minimize your PDF size in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Compress PDF Online Free</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Decrease PDF File Size</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Reduce PDF Size with PDFClub</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Minimize PDF Size with our PDF Compresser</span>
          </div>
        </header>

        <CompressionComponent />
        <section className="mt-20">

          <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            <LucideMessageCircleQuestion size={32} className="text-red-600" /> Frequently Asked Questions (FAQs)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="border border-gray-200 rounded-lg p-4">
                <summary className="font-medium text-gray-900 cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <Script id="faq-schema" type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            })}
          </Script>
        </section>
      </div>
    </div>
  );
}
