import { useState, useEffect } from "react";

const navLinks = [
  { label: "Why Spain", href: "#why-spain" },
  { label: "The Opportunity", href: "#the-opportunity" },
  { label: "Our Vision", href: "#our-vision" },
  { label: "Contact", href: "#contact" },
];

export default function LanplotNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Info Bar */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "max-h-0 opacity-0 overflow-hidden"
            : "max-h-12 opacity-100"
        } bg-dark/80 backdrop-blur-sm border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center text-[11px] sm:text-xs text-white/70 py-2">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
         
            {/* Phone */}
            <a href="tel:+34635955137" className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-gold shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              +34 635 955 137
            </a>
            {/* Email */}
            <a href="mailto:ask@rinoproperties.com" className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-gold shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
              ask@rinoproperties.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? "lanplot-glass shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-50">
        {/* Logo */}
        <a href="/lanplot-spain" className="flex items-center gap-1 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo_rino.png" alt="Rino Invest Group Logo" className="!h-12" />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide transition-colors duration-300 hover:text-gold ${
                scrolled ? "text-dark/60" : "text-white/75"
              }`}
            >
              {link.label}
            </a>
          ))}
         
          <a
            href="#contact"
            className={`px-7 py-2.5 border-2 border-gold text-[13px] font-semibold tracking-wider hover:bg-gold hover:text-white transition-colors duration-300 rounded ${
              scrolled ? "text-dark" : "text-white"
            }`}
          >
             Invest Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-md active:bg-white/10 hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-6 h-[2px] rounded transition-all duration-300 ${
              mobileOpen ? "bg-black" : scrolled ? "bg-black" : "bg-white"
            } ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] rounded transition-all duration-300 ${
              mobileOpen ? "bg-black" : scrolled ? "bg-black" : "bg-white"
            } ${mobileOpen ? "opacity-0 scale-0" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] rounded transition-all duration-300 ${
              mobileOpen ? "bg-black" : scrolled ? "bg-black" : "bg-white"
            } ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-40 transition-all duration-400 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-white" />
        <div className="relative h-full overflow-y-auto pt-24 px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-dark/70 text-sm font-medium py-2.5 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="block text-center mt-4 px-6 py-3 bg-gold text-white text-sm font-semibold tracking-wider rounded"
            onClick={() => setMobileOpen(false)}
          >
            Invest Now
          </a>
          <a
            href="#contact"
            className="block text-center mt-2 px-6 py-3 border-2 border-gold text-gold text-sm font-semibold tracking-wider hover:bg-gold hover:text-white transition-colors duration-300 rounded"
            onClick={() => setMobileOpen(false)}
          >
            Schedule a Call
          </a>
        </div>
      </div>

      </nav>
    </div>
  );
}
