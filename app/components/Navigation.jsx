'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Folder, ImageIcon, Layers, Menu, Scissors, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQs' },
  ];

  return (
    <nav className="bg-(--bg-color) backdrop-blur-md border-b border-(--border-color) px-4 py-4 lg:px-8 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 font-oswald font-bold text-2xl text-transparent bg-linear-to-r from-(--primary-color) to-(--secondary-color) bg-clip-text hover:scale-105 transition-transform duration-200">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
          <span>PDFClub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">

          {/* Tools Dropdown */}
          <div className="relative group">
            <button
              className={`font-medium transition-all duration-300 flex items-center gap-2 ${pathname.startsWith('/merge') || pathname.startsWith('/split') || pathname.startsWith('/compress') || pathname.startsWith('/pdf-to-jpg')
                ? 'text-(--secondary-color) underline underline-offset-4'
                : 'text-(--white-color) hover:text-(--primary-color) hover:scale-105 hover:-translate-y-0.5'
                }`}
            >
              Tools
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="grid grid-rows-3 gap-1 p-2">
                <Link
                  href="/merge"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/merge')
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Layers />
                  Merge PDFs
                </Link>

                <Link
                  href="/split"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/split')
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Scissors />
                  Split PDF
                </Link>

                <Link
                  href="/compress"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/compress')
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <Folder />
                  Compress PDF
                </Link>

                <Link
                  href="/pdf-to-jpg"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/pdf-to-jpg')
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <ImageIcon />
                  PDF to JPG
                </Link>
              </div>
            </div>
          </div>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-medium transition-all duration-300 ${isActive(href)
                ? 'text-(--secondary-color) underline underline-offset-4 '
                : 'text-(--white-color) hover:text-(--primary-color) hover:scale-105 hover:-translate-y-0.5'
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-soft animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(href)
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-slate-600 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{label}</span>
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
