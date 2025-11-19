import Script from "next/script";
import PDFToJPGComponent from "./PDFToJPGComponent";

export default function PDFToJPGPage() {
  const faqs = [
    { id: 1, question: "Is PDF to JPG conversion safe?", answer: "Yes. Processing happens locally in your browser and files are not uploaded." },
    { id: 2, question: "Can I convert multiple pages?", answer: "Yes. Each page is rendered and saved as a separate JPG image." },
    { id: 3, question: "Can I control image quality?", answer: "Yes. Use the quality and resolution sliders to adjust output size and clarity." },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Convert Club</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF to JPG Online Free - PDFClub</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Convert PDF pages to high-quality JPG images in your browser. Fast, secure, and free.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ PDF to JPG Online</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Adjustable Quality</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Download as ZIP</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Secure Local Processing</span>
          </div>
        </header>

        <PDFToJPGComponent />

        <section className="mt-16 max-w-4xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.id} className="border border-gray-200 rounded-lg p-4">
                <summary className="font-medium text-gray-900 cursor-pointer">{faq.question}</summary>
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
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
              })),
            })}
          </Script>
        </section>
      </div>
    </div>
  );
}