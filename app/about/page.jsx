import { FileText, Zap, Shield, Clock } from 'lucide-react';

const pillars = [
  {
    icon: Zap,
    title: 'Fast & Effortless',
    copy: 'Compress, merge, split, and convert PDFs in just a few clicks with our browser-first experience.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    copy: 'Processing happens inside isolated workers, files are encrypted in transit, and everything auto-deletes within 24 hours.',
  },
  {
    icon: FileText,
    title: 'Pixel-Perfect Quality',
    copy: 'Our toolkit preserves layouts and typography so exports look just as polished as the originals.',
  },
  {
    icon: Clock,
    title: 'Available 24/7',
    copy: 'No installs, no queues—PDFClub runs in the cloud and is always ready when your workflow needs it.',
  },
];

const stats = [
  { label: 'Tools & Workflows', value: '12+' },
  { label: 'Avg. Processing Time', value: '8s' },
  { label: 'Global Users', value: '180K+' },
  { label: 'Files Processed Monthly', value: '2.4M' },
];

const timeline = [
  {
    year: '2022',
    title: 'Launch of PDFClub',
    detail: 'Started with core compression and merge utilities built for freelancers and students.',
  },
  {
    year: '2023',
    title: 'Toolkit Expansion',
    detail: 'Released split, PDF ↔ image conversions, and automated workflows for power users.',
  },
  {
    year: '2024',
    title: 'Privacy-First Infrastructure',
    detail: 'Migrated to isolated container processing, added regional data centers, and tightened retention policies.',
  },
  {
    year: '2025',
    title: 'Intelligent Automations',
    detail: 'Introducing AI-assisted document clean-up, OCR boosting, and batch actions across the entire suite.',
  },
];

export default function About() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold">About PDFClub</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Built for every PDF workflow—not just conversions
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          PDFClub delivers a full stack of browser-based tools that cover compressing, merging, splitting, converting,
          and protecting documents so teams can stay productive without juggling multiple apps.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Why creators trust PDFClub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
              <Icon className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">One toolkit. Dozens of use cases.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">
              🗜️
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Optimize & Organize</h3>
            <p className="text-slate-600">
              Compress PDFs for email, merge multiple contracts, or split bulky decks into shareable sections.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">
              🔁
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Convert Anywhere</h3>
            <p className="text-slate-600">
              Switch between PDF, DOCX, JPG, PNG, and more without leaving the browser—no desktop software required.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">
              🔐
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure & Compliant</h3>
            <p className="text-slate-600">
              Watermark sensitive files, password-protect PDFs, and meet privacy requirements with auditable workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Platform snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm">
              <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
              <p className="text-slate-500 text-sm uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Roadmap highlights</h2>
        <div className="space-y-4">
          {timeline.map(({ year, title, detail }) => (
            <div key={year} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 shadow-sm">
              <div className="md:w-32">
                <p className="text-sm uppercase tracking-wide text-blue-600">{year}</p>
                <p className="text-xl font-semibold text-slate-900">{title}</p>
              </div>
              <p className="text-slate-600 flex-1">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Technical foundations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Edge Processing</h4>
            <p className="text-slate-600 text-sm">Jobs run on regional servers to keep latency low wherever you work.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Format Coverage</h4>
            <p className="text-slate-600 text-sm">DOCX, PPTX, XLSX, JPG/PNG, and even HEIC are supported with smart fallbacks.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Processing Time</h4>
            <p className="text-slate-600 text-sm">Most uploads finish in under 10 seconds, even for multi-hundred page files.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">File Retention</h4>
            <p className="text-slate-600 text-sm">Auto-delete after 24 hours, with instant purge options directly inside the UI.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
