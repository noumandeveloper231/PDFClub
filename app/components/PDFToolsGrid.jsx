'use client';

import Link from 'next/link';
import { 
  FileText, 
  Scissors, 
  Archive, 
  FileImage, 
  Image, 
  RotateCw, 
  Droplets, 
  Lock, 
  Unlock, 
  Settings, 
  Hash, 
  Crop,
  FileSpreadsheet,
  Presentation,
  Edit,
  PenTool,
  Shield,
  Eye,
  Layers,
  Download
} from 'lucide-react';

const PDFToolsGrid = () => {
  const tools = [
    // Core Tools - Row 1
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
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality.',
      icon: Archive,
      color: 'bg-green-500',
      href: '/tools/compress'
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
      icon: FileText,
      color: 'bg-blue-600',
      href: '/tools/pdf-to-word'
    },

    // Conversion Tools - Row 2
    {
      id: 'pdf-to-excel',
      title: 'PDF to Excel',
      description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
      icon: FileSpreadsheet,
      color: 'bg-green-600',
      href: '/tools/pdf-to-excel'
    },
    {
      id: 'pdf-to-powerpoint',
      title: 'PDF to PowerPoint',
      description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
      icon: Presentation,
      color: 'bg-orange-500',
      href: '/tools/pdf-to-powerpoint'
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      icon: FileText,
      color: 'bg-indigo-500',
      href: '/tools/word-to-pdf'
    },
    {
      id: 'excel-to-pdf',
      title: 'Excel to PDF',
      description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
      icon: FileSpreadsheet,
      color: 'bg-teal-500',
      href: '/tools/excel-to-pdf'
    },
    {
      id: 'powerpoint-to-pdf',
      title: 'PowerPoint to PDF',
      description: 'Make PPT and PPTX presentations easy to read by converting them to PDF.',
      icon: Presentation,
      color: 'bg-red-500',
      href: '/tools/powerpoint-to-pdf'
    },

    // Image Tools - Row 3
    {
      id: 'pdf-to-jpg',
      title: 'PDF to JPG',
      description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
      icon: FileImage,
      color: 'bg-purple-500',
      href: '/tools/pdf-to-jpg'
    },
    {
      id: 'jpg-to-pdf',
      title: 'JPG to PDF',
      description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
      icon: Image,
      color: 'bg-pink-500',
      href: '/tools/jpg-to-pdf'
    },
    {
      id: 'edit-pdf',
      title: 'Edit PDF',
      description: 'Add text, images, shapes or freehand annotations to a PDF document.',
      icon: Edit,
      color: 'bg-yellow-500',
      href: '/tools/edit-pdf'
    },
    {
      id: 'sign-pdf',
      title: 'Sign PDF',
      description: 'Sign yourself or request electronic signatures from others.',
      icon: PenTool,
      color: 'bg-red-600',
      href: '/tools/sign'
    },

    // Utility Tools - Row 4
    {
      id: 'watermark',
      title: 'Watermark PDF',
      description: 'Stamp an image or text over your PDF in seconds. Choose typography and position.',
      icon: Droplets,
      color: 'bg-cyan-500',
      href: '/tools/watermark'
    },
    {
      id: 'rotate',
      title: 'Rotate PDF',
      description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
      icon: RotateCw,
      color: 'bg-lime-500',
      href: '/tools/rotate'
    },
    {
      id: 'unlock',
      title: 'Unlock PDF',
      description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
      icon: Unlock,
      color: 'bg-emerald-500',
      href: '/tools/unlock'
    },
    {
      id: 'protect',
      title: 'Protect PDF',
      description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
      icon: Lock,
      color: 'bg-slate-600',
      href: '/tools/protect'
    },

    // Advanced Tools - Row 5
    {
      id: 'organize',
      title: 'Organize PDF',
      description: 'Sort pages of your PDF file however you like. Delete or add PDF pages at your convenience.',
      icon: Settings,
      color: 'bg-violet-500',
      href: '/tools/organize'
    },
    {
      id: 'page-numbers',
      title: 'Page Numbers',
      description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
      icon: Hash,
      color: 'bg-rose-500',
      href: '/tools/page-numbers'
    },
    {
      id: 'crop',
      title: 'Crop PDF',
      description: 'Crop margins of PDF documents or select specific areas for the whole document.',
      icon: Crop,
      color: 'bg-amber-500',
      href: '/tools/crop'
    },
    {
      id: 'validate',
      title: 'Validate PDF',
      description: 'Check PDF file integrity and validate document structure and compliance.',
      icon: Shield,
      color: 'bg-gray-600',
      href: '/tools/validate'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
