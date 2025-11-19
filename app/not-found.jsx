import Link from "next/link";
import { AlertTriangle, Home, Layers, Scissors, Image as ImageIcon } from "lucide-react";
import PDFToolsGrid from "./components/PDFToolsGrid";

export default function NotFound() {

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">Not Found</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Hmm... Page Not Found</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            The page you are looking for doesn’t exist or has moved. Try one of the tools below or go back to the homepage.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-full transition-all">
            <Home size={20} />
            Go to Homepage
          </Link>
        </div>

        <PDFToolsGrid limit={3} />
      </div>
    </div>
  );
}