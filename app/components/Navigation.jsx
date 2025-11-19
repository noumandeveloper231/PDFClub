'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
          <Link href="/privacy-policy" className={`font-medium transition-all duration-300 ${isActive('/privacy-policy')
            ? 'text-(--secondary-color) underline underline-offset-4 '
            : 'text-gray-700 hover:text-(--primary-color) hover:scale-105 hover:-translate-y-0.5'
            }`} >
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className={`font-medium transition-all duration-300 ${isActive('/terms-of-service')
            ? 'text-(--secondary-color) underline underline-offset-4 '
            : 'text-gray-700 hover:text-(--primary-color) hover:scale-105 hover:-translate-y-0.5'
            }`}>
            Terms of Service
          </Link>
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
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(href)
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-slate-600 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
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
