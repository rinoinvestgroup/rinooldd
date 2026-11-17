// components/Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import AutoTranslate from './AutoTranslate';

interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);

  const dropdownMenus = [
    {
      key: 'offPlan',
      label: 'Off-Plan',
      children: [
        { href: '/properties/spain/off-plan', label: 'Spain Properties' },
        { href: '/properties/dubai/off-plan', label: 'Dubai Properties' },
        { href: '/properties/international/off-plan', label: 'International Properties' },
      ]
    },
    {
      key: 'buy',
      label: 'Buy',
      children: [
        { href: '/properties/spain/ready-to-move', label: 'Spain Properties' },
        { href: '/properties/dubai/buy', label: 'Dubai Properties' },
        { href: '/properties/international/buy', label: 'International Properties' },
      ]
    },
    {
      key: 'commercial',
      label: 'Commercial',
      children: [
        { href: '/properties/spain/commercial', label: 'Spain Properties' },
        { href: '/properties/dubai/commercial', label: 'Dubai Properties' },
        { href: '/properties/international/commercial', label: 'International Properties' },
      ]
    },
  ];

  const navItems: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/dubai-real-estate-services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ];

  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path);

  return (
    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className={`flex space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
          <li>
            <Link href="/" className={`px-2 xs:px-3 py-2 text-xs xs:text-sm font-medium ${
              isActive('/') ? 'bg-[#D69F3F]-100 text-[#D69F3F]-600' : 'text-gray-600 hover:text-[#D69F3F]-500'
            }`}>
              <AutoTranslate>Home</AutoTranslate>
            </Link>
          </li>
          {dropdownMenus.map((menu) => (
            <li key={menu.key} className="relative">
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`px-2 xs:px-3 py-2 text-xs xs:text-sm font-medium flex items-center ${
                    menu.children.some(c => isActive(c.href))
                      ? 'bg-[#D69F3F]/10 text-[#D69F3F]' 
                      : 'text-gray-600 hover:text-[#D69F3F]'
                  }`}
                >
                  <AutoTranslate>{menu.label}</AutoTranslate>
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === menu.key ? 'rotate-180' : ''
                    } ${isRTL ? 'mr-1 ml-0' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {activeDropdown === menu.key && (
                  <div className={`absolute top-full mt-1 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50 ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}>
                    {menu.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#D69F3F]/10 hover:text-[#D69F3F] transition-colors duration-200"
                      >
                        <AutoTranslate>{child.label}</AutoTranslate>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
          {navItems.filter(item => item.href !== '/').map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-2 xs:px-3 py-2 text-xs xs:text-sm font-medium ${
                  isActive(item.href) 
                    ? 'bg-[#D69F3F]-100 text-[#D69F3F]-600' 
                    : 'text-gray-600 hover:text-[#D69F3F]-500'
                }`}
              >
                <AutoTranslate>{item.label}</AutoTranslate>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Language Switcher */}
      <div className="hidden md:block">
        <LanguageSwitcher />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-2">
        <LanguageSwitcher />
        <button 
          className="focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{ touchAction: 'manipulation' }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <path 
              stroke="currentColor" 
              strokeWidth="2" 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border border-gray-200/50 py-2 z-50 backdrop-blur-xl">
          <ul className="flex flex-col space-y-2 px-4">
            <li>
              <Link
                href="/"
                className={`block px-3 py-2 text-sm xs:text-base font-medium rounded-lg transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-[#D69F3F]/10 text-[#D69F3F]' 
                    : 'text-gray-800 hover:bg-gray-50 hover:text-[#D69F3F]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <AutoTranslate>Home</AutoTranslate>
              </Link>
            </li>
            {dropdownMenus.map((menu) => (
              <li key={menu.key}>
                <div>
                  <button
                    onClick={() => setMobileActiveDropdown(mobileActiveDropdown === menu.key ? null : menu.key)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm xs:text-base font-medium rounded-lg transition-all duration-300 ${
                      menu.children.some(c => isActive(c.href))
                        ? 'bg-[#D69F3F]/10 text-[#D69F3F]' 
                        : 'text-gray-800 hover:bg-gray-50 hover:text-[#D69F3F]'
                    }`}
                  >
                    <AutoTranslate>{menu.label}</AutoTranslate>
                    <svg 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileActiveDropdown === menu.key ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileActiveDropdown === menu.key && (
                    <div className="ml-4 mt-2 space-y-1">
                      {menu.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#D69F3F]/10 hover:text-[#D69F3F] transition-all duration-300 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <AutoTranslate>{child.label}</AutoTranslate>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
            {navItems.filter(item => item.href !== '/').map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 text-sm xs:text-base font-medium rounded-lg transition-all duration-300 ${
                    isActive(item.href) 
                      ? 'bg-[#D69F3F]/10 text-[#D69F3F]' 
                      : 'text-gray-800 hover:bg-gray-50 hover:text-[#D69F3F]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AutoTranslate>{item.label}</AutoTranslate>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
