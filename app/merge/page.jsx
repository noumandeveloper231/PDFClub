import MergerComponent from "./MergerComponent";
import Script from "next/script";

export default function MergePDF() {

  const faqs = [
    { id: 1, question: "Is it safe to merge PDF files online?", answer: "Yes, our PDF merger is completely secure. All processing happens locally in your browser, and your files are never uploaded to our servers. Your documents remain private and secure." },
    { id: 2, question: "Can I merge password-protected PDFs?", answer: "Currently, our tool works best with unprotected PDF files. If you have password-protected PDFs, you may need to unlock them first before merging." },
    { id: 3, question: "What's the maximum file size for merging PDFs?", answer: "There's no strict file size limit. However, very large files may take longer to process depending on your device's capabilities and internet connection." },
    { id: 4, question: "Can I change the order of PDFs before merging?", answer: "Absolutely! Use the up and down arrow buttons next to each file to rearrange them in your preferred order before clicking 'Merge PDFs'." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Merger Club</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Merge PDF Online Free - Combine Multiple PDF Files</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Merge PDF online for free with our powerful PDF merger tool. Combine multiple PDF documents into one file instantly. Convert pdf to pdf merge. No registration required, completely secure, and works in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Merge PDF Online</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Combine PDF Files</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Free PDF Merger</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">✓ No File Size Limit</span>
          </div>
        </header>
        <main>
          <MergerComponent />
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Merge PDF Files Online</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                      <span>Upload multiple PDF files by clicking "Select PDF Files" or drag and drop them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                      <span>Arrange the PDFs in your desired order using the up/down arrows</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                      <span>Click "Merge PDFs" to combine all files into one document</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-500 text-white rounded-full w-12 h-7 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                      <span>Download your merged PDF file instantly</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our PDF Merger?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>100% Free:</strong> No hidden costs or subscriptions</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>Secure:</strong> Files processed locally in your browser</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>No Registration:</strong> Start merging PDFs immediately</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>Fast Processing:</strong> Merge multiple PDFs in seconds</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span><strong>No File Limits:</strong> Combine as many PDFs as needed</span>
                    </li>
                  </ul>
                </div>
              </div>

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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
