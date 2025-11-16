import Link from "next/link";
import Head from "next/head";

export const metadata = {
  title: "Privacy Policy | PDFClub",
  description:
    "Understand how PDFClub collects, uses, and protects your files and personal data. Learn about retention practices, cookies, and your privacy rights.",
  alternates: {
    canonical: "https://pdfclub.online/privacy-policy",
  },
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    description:
      "PDFClub our offers browser-based PDF utilities designed to work securely without needing an account. This Privacy Policy explains what data we collect, how we use it, and the controls you have.",
  },
  {
    id: "data-we-collect",
    title: "2. Data We Collect",
    description: "We only gather the minimum information required to provide and improve our tools:",
    items: [
      "Uploaded files and conversion parameters are processed temporarily to complete the requested task.",
      "Usage data, device type, browser details, and anonymized analytics are recorded to monitor reliability and performance.",
      "Support communications, such as emails you send to support@pdfclub.online, so we can respond to your requests.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "3. How We Use Data",
    description: "All information is used solely to deliver and enhance PDFClub services:",
    items: [
      "Provide core features such as compression, merging, splitting, and conversion.",
      "Maintain security, detect abuse, and troubleshoot platform issues.",
      "Improve product performance, UX, and launch new tools based on aggregated insights.",
      "Respond to user inquiries and fulfill legal or regulatory obligations.",
    ],
  },
  {
    id: "file-handling",
    title: "4. File Handling & Retention",
    description: "We treat uploaded documents with strict confidentiality:",
    items: [
      "Files are encrypted in transit and at rest during processing.",
      "Documents and generated outputs are automatically purged within 24 hours, often sooner, unless the user explicitly deletes them earlier.",
      "We never review file contents manually, sell data, or use documents for model training.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    description:
      "PDFClub uses lightweight cookies and similar technologies to remember preferences (such as language or theme) and to gather anonymous analytics. You can manage cookie behavior through your browser settings; disabling cookies may impact UX but core conversions will continue to function.",
  },
  {
    id: "security",
    title: "6. Security Measures",
    description: "Security is built into every layer of our stack:",
    items: [
      "HTTPS enforced across the platform with modern TLS encryption.",
      "Isolated processing workers that sandbox user jobs and prevent cross-file access.",
      "Continuous monitoring, rate limiting, and automatic patch management.",
    ],
  },
  {
    id: "data-sharing",
    title: "7. Data Sharing",
    description: "We do not sell or rent your personal data. Limited third-party access occurs only when:",
    items: [
      "Cloud infrastructure or analytics vendors act as processors under contract to help us deliver the service.",
      "We must comply with legal requests, enforce our Terms of Service, or investigate suspected abuse.",
    ],
  },
  {
    id: "your-rights",
    title: "8. Your Rights & Controls",
    description:
      "Depending on your region (GDPR, CCPA, etc.), you may have rights to access, correct, delete, or restrict processing of your personal data. Contact us at support@pdfclub.online with your request, and we will respond within 30 days. You can also opt-out of non-essential cookies via browser controls.",
  },
  {
    id: "children",
    title: "9. Children’s Privacy",
    description:
      "PDFClub is not intended for children under 13. We do not knowingly collect data from minors. If you believe a child has provided us information, please contact us so we can delete it promptly.",
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    description:
      "Our servers may operate in multiple regions. By using PDFClub, you consent to processing in the jurisdiction where our infrastructure is hosted. We rely on industry-standard contractual clauses when transferring data across borders.",
  },
  {
    id: "updates",
    title: "11. Updates to This Policy",
    description:
      'We may update this Privacy Policy to reflect technical, legal, or business changes. Material updates will be highlighted on this page with a new "Last Updated" date.',
  },
  {
    id: "contact",
    title: "12. Contact Us",
    description: (
      <>
        Email support@pdfclub.online or visit our{" "}
        <Link href="/contact-us" className="text-blue-600 hover:underline">
          Contact page
        </Link>{" "}
        for any privacy-related questions.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 py-12 max-w-5xl mx-auto text-slate-800">
      <Head>
        <link rel="canonical" href="https://pdfclub.online/privacy-policy" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://pdfclub.online/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PDFClub",
              "url": "https://pdfclub.online",
              "logo": "https://pdfclub.online/logo.png",
              "sameAs": ["https://twitter.com/pdfclub", "https://www.facebook.com/pdfclub"]
            }),
          }}
        />
      </Head>

      <header className="mb-10">
        <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Privacy Policy</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Your Privacy. Our Priority.</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          PDFClub is built to process your PDFs quickly without compromising privacy. This page outlines the safeguards we have in place so you can use our tools with confidence.
        </p>
      </header>

      <dl className="grid gap-6 md:grid-cols-3 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <dt className="text-sm text-slate-500">Effective Date</dt>
          <dd className="text-2xl font-semibold text-slate-900">16 Nov 2025</dd>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <dt className="text-sm text-slate-500">Scope</dt>
          <dd className="text-lg font-semibold text-slate-900">All PDFClub web tools & APIs</dd>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <dt className="text-sm text-slate-500">Questions?</dt>
          <dd className="text-lg font-semibold text-blue-600">support@pdfclub.online</dd>
        </div>
      </dl>

      <section className="mb-12" aria-label="Privacy policy table of contents">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Navigation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 text-slate-700 hover:text-blue-600"
                aria-current={typeof window !== "undefined" && window.location.hash === `#${section.id}` ? "true" : undefined}
              >
                <span className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-semibold">
                  {section.title.split(".")[0]}
                </span>
                <span className="font-medium">{section.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-10 scroll-mt-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          aria-labelledby={section.id + "-title"}
        >
          <h2 id={section.id + "-title"} className="text-2xl font-semibold text-slate-900 mb-3">{section.title}</h2>
          <p className="text-slate-600 mb-4">{section.description}</p>
          {section.items && (
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <footer className="text-sm text-slate-500 mt-12">
        <p>
          Need a copy for compliance reviews? Download or print this page directly from your browser. For contractual DPAs, contact us via the{" "}
          <Link href="/contact-us" className="text-blue-600 hover:underline">support team</Link>.
        </p>
      </footer>
    </div>
  );
}