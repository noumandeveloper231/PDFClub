import PDFToolsGrid from './components/PDFToolsGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            PDFClub
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            Essential PDF tools for merging and splitting documents. 100% FREE and easy to use! 
            Combine multiple PDFs or split them into separate files with just a few clicks.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            ✨ All tools work offline - No external APIs required!
          </div>
        </div>
        
        <PDFToolsGrid />
        
        <div className="text-center mt-16 text-gray-600">
          <p className="text-sm">
            Built with ❤️ using open-source libraries: pdf-lib, sharp, mammoth, xlsx
          </p>
        </div>
      </div>
    </div>
  );
}
