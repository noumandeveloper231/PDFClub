'use client';

import Link from 'next/link';
import { 
  Scissors, 
  Layers,
  Folder
} from 'lucide-react';

const PDFToolsGrid = () => {
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
      icon: Layers,
      color: 'bg-red-500',
      href: '/merge'
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      icon: Scissors,
      color: 'bg-blue-500',
      href: '/split'
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Compress PDF files to reduce their size without losing quality.',
      icon: Folder,
      color: 'bg-green-500',
      href: '/compress'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mx-auto">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link 
              key={tool.id} 
              href={tool.href}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-400"
            >
              <div className="p-6">
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {tool.title}
                </h2>
                
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
    </div>
  );
};

export default PDFToolsGrid;
