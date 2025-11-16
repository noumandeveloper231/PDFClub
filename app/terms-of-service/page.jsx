import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | PDFClub",
  description:
    "Read PDFClub's Terms of Service covering acceptable use, user responsibilities, warranties, limitations of liability, and governing law.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

const sections = [
  {
    id: "agreement",
    title: "1. Acceptance of Terms",
    description:
      "By accessing or using PDFClub (the \"Service\"), you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, do not use the Service.",
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    description:
      "You must be at least 13 years old and have the legal capacity to enter into these Terms. Using the Service on behalf of an organization means you have authority to bind that organization.",
  },
  {
    id: "license",
    title: "3. License & Acceptable Use",
    description:
      "We grant you a limited, non-exclusive, revocable license to use PDFClub for lawful document processing. You agree not to:",
    items: [
      "Reverse engineer or attempt to access source code.",
      "Upload malicious, infringing, or illegal content.",
      "Automate requests in a manner that degrades platform stability.",
      "Use the Service to violate privacy, intellectual property, or contractual obligations.",
    ],
  },
  {
    id: "accounts",
    title: "4. Accounts & Security",
    description:
      "Most PDFClub tools are available without registration. If we introduce optional accounts, you are responsible for safeguarding credentials and promptly notifying us of unauthorized use.",
  },
  {
    id: "file-processing",
    title: "5. File Processing & Retention",
    description:
      "Files are processed automatically and deleted within 24 hours as outlined in the Privacy Policy. You are responsible for maintaining backups before uploading documents.",
  },
  {
    id: "third-party",
    title: "6. Third-Party Services",
    description:
      "PDFClub may integrate or rely on third-party infrastructure, APIs, or analytics. We are not responsible for third-party content or actions, but we vet partners for reliability and security.",
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    description:
      "All trademarks, code, and brand assets are owned by PDFClub or its licensors. You retain ownership of your documents and grant us a limited license to process them for the sole purpose of delivering the Service.",
  },
  {
    id: "fees",
    title: "8. Fees & Changes",
    description:
      "Core tools are currently free. We may introduce premium plans or usage limits with prior notice. Continued use after pricing updates constitutes acceptance of the new terms.",
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    description:
      "PDFCLUB IS PROVIDED \"AS IS\" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    description:
      "To the maximum extent permitted by law, PDFClub and its affiliates shall not be liable for indirect, incidental, consequential, or punitive damages, or for loss of data, profits, or goodwill.",
  },
  {
    id: "indemnity",
    title: "11. Indemnification",
    description:
      "You agree to defend and indemnify PDFClub against any claims arising from your use of the Service, uploaded files, or violation of these Terms.",
  },
  {
    id: "termination",
    title: "12. Suspension & Termination",
    description:
      "We may suspend or terminate access if you breach these Terms or misuse the Service. You may stop using PDFClub at any time. Certain clauses (such as liability limitations) survive termination.",
  },
  {
    id: "governing-law",
    title: "13. Governing Law",
    description:
      "These Terms are governed by the laws of the jurisdiction where PDFClub operates (currently the United Arab Emirates), regardless of conflict-of-law principles.",
  },
  {
    id: "changes",
    title: "14. Changes to Terms",
    description:
      "We may update these Terms to reflect new features or legal requirements. Material changes will be posted with a revised \"Last Updated\" date. Continued use signifies acceptance.",
  },
  {
    id: "contact",
    title: "15. Contact",
    description:
      "For questions about these Terms, email support@pdfclub.online or visit the <Link href=\"/contact-us\" className=\"text-blue-600 hover:underline\">contact page</Link>.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="px-4 py-12 max-w-5xl mx-auto text-slate-800">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Terms & Conditions</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">PDFClub Terms of Service</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          These Terms outline the rules for using PDFClub's online PDF utilities. Please read them carefully before uploading files or integrating our tools into your workflows.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Effective Date</p>
          <p className="text-2xl font-semibold text-slate-900">16 Nov 2025</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Applies To</p>
          <p className="text-lg font-semibold text-slate-900">All PDFClub products & APIs</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Support</p>
          <p className="text-lg font-semibold text-blue-600">support@pdfclub.online</p>
        </div>
      </div>

      <section className="mb-12" aria-label="Terms table of contents">
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Navigation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 text-slate-700 hover:text-purple-700"
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
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">{section.title}</h2>
          <p className="text-slate-600 mb-4">{section.description}</p>
          {section.items && (
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="text-sm text-slate-500 mt-12">
        <p>
          By continuing to use PDFClub after updates, you accept the revised Terms. For partnership or enterprise agreements, please <Link href="/contact-us" className="text-blue-600 hover:underline">contact our team</Link>.
        </p>
      </div>
    </div>
  );
}
