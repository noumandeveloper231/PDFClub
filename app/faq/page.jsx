import Script from 'next/script'

const FAQs = () => {
    const pdfFaqs = [
        {
            id: 1,
            question: "What is a PDF and why is it used?",
            answer: "PDF (Portable Document Format) is a file format developed by Adobe that preserves document formatting across different devices and platforms. It’s used because it’s reliable, consistent, and supports text, images, and interactive elements."
        },
        {
            id: 2,
            question: "How can I convert other files (Word, Excel, images) to PDF?",
            answer: "You can use PDF tools like Adobe Acrobat or free online converters to convert Word, Excel, JPG, and other file types into PDF format while keeping layout and formatting intact."
        },
        {
            id: 3,
            question: "How do I edit a PDF (add text, images, or delete pages)?",
            answer: "To edit a PDF, you can use PDF editor software (like Acrobat) or browser-based tools. These let you modify text, insert or remove images, delete pages, and more."
        },
        {
            id: 4,
            question: "Can I merge or split PDF files?",
            answer: "Yes. You can merge multiple PDFs into one document or split a PDF into smaller parts using a PDF merge/split tool. :contentReference[oaicite:0]{index=0}"
        },
        {
            id: 5,
            question: "Is it possible to compress a PDF to reduce file size?",
            answer: "Absolutely. You can compress PDFs to reduce file size by lowering image resolution, removing metadata, or optimizing the file. But too much compression may degrade quality. :contentReference[oaicite:1]{index=1}"
        },
        {
            id: 6,
            question: "How secure are PDFs? Can I password‑protect them?",
            answer: "PDFs can be made secure. You can encrypt them, set passwords, and restrict actions like printing or editing. This helps protect sensitive data."
        },
        {
            id: 7,
            question: "How do I extract text or images from a PDF?",
            answer: "You can extract text or images using PDF editor software or specialized tools. For scanned PDFs, OCR (Optical Character Recognition) is often used to convert images into selectable text."
        },
        {
            id: 8,
            question: "Can I make a PDF searchable or use OCR on a scanned PDF?",
            answer: "Yes — using OCR tools, you can make scanned PDFs searchable and select text inside them. Many PDF editors support OCR to convert images into text."
        },
        {
            id: 9,
            question: "Do PDFs work well on mobile devices?",
            answer: "Yes — PDFs are widely supported on mobile devices. You can view, annotate, and even fill forms using PDF readers on smartphones and tablets."
        },
        {
            id: 10,
            question: "Are there free tools available to work with PDFs?",
            answer: "Definitely. There are many free or open-source tools for viewing, editing, merging, compressing, and converting PDFs."
        }
    ];

    return (
        <div className='p-8 max-w-6xl mx-auto w-full'>
            <header className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">FAQs PDFClub</p>
                <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    PDFClub delivers a full stack of browser-based tools that cover compressing, merging, splitting, converting,
                    and protecting documents so teams can stay productive without juggling multiple apps.
                </p>
            </header>
            <div className="space-y-3 bg-white border border-gray-200 rounded-lg p-4">
                {pdfFaqs.map((faq) => (
                    <details key={faq.id} className="border bg-gray-50 border-gray-200 rounded-lg p-4">
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
                    "mainEntity": pdfFaqs.map((faq) => ({
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
    )
}

export default FAQs