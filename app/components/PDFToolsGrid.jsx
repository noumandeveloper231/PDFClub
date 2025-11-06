'use client';

import Link from 'next/link';
import { 
  Scissors, 
  Shield,
  Eye,
  Layers,
  Download
} from 'lucide-react';

const PDFToolsGrid = () => {
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
      icon: Layers,
      color: 'bg-red-500',
      href: '/tools/merge'
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      icon: Scissors,
      color: 'bg-blue-500',
      href: '/tools/split'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link 
              key={tool.id} 
              href={tool.href}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-200"
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
                
                <div className="mt-4 flex items-center text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Select tool
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Feature Highlights */}
      <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our PDF Tools?</h2>
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
  );
};

export default PDFToolsGrid;
