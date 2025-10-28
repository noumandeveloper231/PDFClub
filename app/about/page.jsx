import { FileText, Zap, Shield, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">About PDF to DOCX Converter</h1>
        <p className="text-lg text-slate-600">Learn more about our secure and efficient conversion service</p>
      </header>

      <div className="max-w-4xl mx-auto">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Why Choose Our Converter?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <Zap className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Fast Conversion</h3>
              <p className="text-slate-600">Convert your PDF files to DOCX format in seconds using our optimized API</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <Shield className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Secure & Private</h3>
              <p className="text-slate-600">Your files are processed securely and automatically deleted after 24 hours</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <FileText className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">High Quality</h3>
              <p className="text-slate-600">Maintains formatting and layout as much as possible during conversion</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <Clock className="text-blue-600 mb-4 mx-auto" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 mb-4">24/7 Available</h3>
              <p className="text-slate-600">Convert your files anytime, anywhere with our reliable service</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your PDF</h3>
              <p className="text-slate-600">Drag and drop or click to select your PDF file (up to 50MB)</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Automatic Conversion</h3>
              <p className="text-slate-600">Our Convert API processes your file using advanced algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xl mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Download DOCX</h3>
              <p className="text-slate-600">Download your converted DOCX file ready for editing</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Technical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Supported Input</h4>
              <p className="text-slate-600 text-sm">PDF files up to 50MB in size</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Output Format</h4>
              <p className="text-slate-600 text-sm">Microsoft Word DOCX format</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">Processing Time</h4>
              <p className="text-slate-600 text-sm">Typically 10-30 seconds depending on file size</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">File Retention</h4>
              <p className="text-slate-600 text-sm">Files are automatically deleted after 24 hours</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
