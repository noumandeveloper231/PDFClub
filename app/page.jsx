import { Download, Eye, Shield } from 'lucide-react';
import PDFToolsGrid from './components/PDFToolsGrid';

export default function Home() {
  return (
    <section className="min-h-screen bg-linear-to-br from-(--bg-color) to-(--bg-color)/90">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            PDFClub
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto mb-6">
            Essential PDF tools for merging and splitting documents. 100% FREE and easy to use! Merge pdf documents online No Registration required. Merge Multiple PDFs or split them into separate files with just a few clicks.
          </p>
        </div>

        <PDFToolsGrid />

        {/* Feature Highlights */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose <span className='text-red-500 italic'>PDFClub?</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional-grade PDF processing with complete privacy and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600 text-sm">
                All processing happens locally in your browser. Your files never leave your device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Installation</h3>
              <p className="text-gray-600 text-sm">
                Works directly in your web browser. No software downloads or installations required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600 text-sm">
                All tools are completely free to use with no hidden costs or subscription fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
