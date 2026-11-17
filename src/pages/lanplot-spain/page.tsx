/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Navbar from "../../components/lanplot-spain/LanplotNavbar";
import Footer from "../../components/Footer";

/* ───────────── HOOKS ───────────── */

/** Fires once when element enters viewport */
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Animated counter from 0 → target */
function useCounter(target: number, inView: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return val;
}

/** Animated counter component */
function AnimatedStat({ value, label, inView }: { value: string; label: string; inView: boolean }) {
  const numMatch = value.match(/([\d,]+)/);
  const num = numMatch ? parseInt(numMatch[1].replace(/,/g, "")) : 0;
  const prefix = value.match(/^([^\d]*)/);
  const suffix = value.match(/[\d,]+(.*)$/);
  const animated = useCounter(num, inView);
  
  const formatted = num >= 1000
    ? animated.toLocaleString()
    : animated.toString();

  return (
    <div className="text-center">
      <p className="font-serif text-3xl md:text-[2.5rem] font-bold text-gold leading-none">
        {prefix?.[1]}{formatted}{suffix?.[1]}
      </p>
      <p className="text-white/40 text-xs mt-3 tracking-[0.2em] uppercase">
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────── DATA ─────────────────────────── */

const features = [
  {
    title: "Strong Tourism Market",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2c2.5 2.8 4 6.2 4 10s-1.5 7.2-4 10c-2.5-2.8-4-6.2-4-10s1.5-7.2 4-10z" />
      </svg>
    ),
  },
  {
    title: "High Return Potential",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: "Growing Development Opportunities",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <rect x="3" y="8" width="7" height="13" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
        <path d="M6 12h1M6 15h1M17 7h1M17 10h1M17 13h1M17 16h1" />
      </svg>
    ),
  },
  {
    title: "Competitive Entry Price",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: "Booming Hospitality Sector",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        <path d="M9 10h.01M15 10h.01" />
      </svg>
    ),
  },
  {
    title: "Secure Investment Environment",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const highlights = [
  { label: "Plot Size", value: "2,400 m²" },
  { label: "Buildable Area", value: "16,250 m²" },
  { label: "Maximum Height", value: "Ground Floor + 11" },
  { label: "Hotel Capacity", value: "Approx. 200 rooms" },
  { label: "Commercial Area", value: "4,700 m²" },
  { label: "Price", value: "€16,000,000" },
];

const stats = [
  { value: "2,400 m²", label: "Plot Size" },
  { value: "200", label: "Hotel Rooms" },
  { value: "16,250 m²", label: "Buildable Area" },
  { value: "€16M", label: "Investment" },
];

const pillars = [
  "Nature-Based Architecture",
  "Green Infrastructures",
  "Next-Gen Construction",
  "AI Operating Systems",
  "Off-Grid Energy Systems",
  "Regenerative Tourism",
];

const projectCosts = [
  { label: "Total Land Cost", value: "€16 432 000" },
  { label: "Total Construction Cost", value: "€48 200 000" },
  { label: "AI, Sustainability, Autonomous systems etc", value: "€2 900 000" },
  { label: "FF&E (Furniture, Fixtures, and Equipment)", value: "€5 800 000" },
  { label: "Architectural, engineering and interior design fees", value: "€5 254 275" },
  { label: "Management Fees", value: "€3 500 000" },
  { label: "Other Expenses", value: "€4 227 413" },
  { label: "Financial Costs", value: "€0" },
  { label: "Contingency", value: "€6 176 433" },
];

const companyStats = [
  { value: "€500M+", label: "Assets Under Advisory" },
  { value: "12+", label: "Countries" },
  { value: "200+", label: "Investors Served" },
  { value: "15+", label: "Years Experience" },
];

const processSteps = [
  {
    step: "01",
    title: "Initial Consultation",
    desc: "Private briefing with our investment team to understand your objectives and present the opportunity in depth.",
  },
  {
    step: "02",
    title: "Due Diligence",
    desc: "Full access to legal, financial, and technical documentation for thorough independent evaluation.",
  },
  {
    step: "03",
    title: "Investment Structuring",
    desc: "Tailored deal structure — land-only, turnkey, or operational — aligned with your strategy.",
  },
  {
    step: "04",
    title: "Acquisition & Development",
    desc: "Seamless transaction support and optional end-to-end project management through delivery.",
  },
];

const faqs = [
  {
    q: "What is the minimum investment?",
    a: "The land acquisition is priced at €16M. We offer flexible structures including partial investment through joint ventures and co-investment arrangements.",
  },
  {
    q: "What is the expected timeline?",
    a: "Land acquisition can complete within 3–6 months. Full project development, from design through delivery, is projected at 24–36 months.",
  },
  {
    q: "What returns can I expect?",
    a: "Based on our projections, the base case NOI is €9.09M annually, with potential for higher returns in favorable market conditions. Detailed financial models are available during due diligence.",
  },
  {
    q: "Is the land fully permitted?",
    a: "Yes. The plot has approved building rights for Ground Floor + 11 stories with 16,250 m² of buildable area, including hotel and commercial use.",
  },
  {
    q: "Can I choose my own hotel operator?",
    a: "Absolutely. Our flexible structure allows you to operate under your own brand, partner with a third-party operator, or engage Rino to manage the selection process.",
  },
];

const operations = [
  {
    label: "Revenue From Hotel Rooms",
    base: "€16 195 050",
    low: "€15 335 298",
    high: "€17 814 555",
  },
  {
    label: "Revenues From Commercial Space",
    base: "€1 680 000",
    low: "€1 596 000",
    high: "€1 848 000",
  },
  {
    label: "Non-room Revenues",
    base: "€4 858 515",
    low: "€4 615 589",
    high: "€5 344 367",
  },
  {
    label: "Total Annual Revenues",
    base: "€22 733 565",
    low: "€21 596 887",
    high: "€25 006 922",
    bold: true,
  },
  {
    label: "Operational Expenses",
    base: "-€13 640 139",
    low: "-€12 958 132",
    high: "-€15 004 153",
  },
  {
    label: "NOI",
    base: "€9 093 426",
    low: "€8 638 755",
    high: "€10 002 769",
    bold: true,
  },
];

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function Home() {
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  // Section refs for animated reveals
  const statsRef = useInView(0.3);
  const processRef = useInView(0.2);
  const conclusionRef = useInView(0.2);
  const companyRef = useInView(0.2);

  useEffect(() => {
    const handleScroll = () => setShowStickyCta(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger hero entrance after paint
    requestAnimationFrame(() => setHeroLoaded(true));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setFormError('');

    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#contact-name') as HTMLInputElement).value;
    const email = (form.querySelector('#contact-email') as HTMLInputElement).value;
    const phone = (form.querySelector('#contact-phone') as HTMLInputElement).value;
    const budget = (form.querySelector('#contact-budget') as HTMLSelectElement).value;
    const message = (form.querySelector('#contact-message') as HTMLTextAreaElement).value;

    try {
      const res = await fetch('/api/lanplot-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, budget, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setFormState('success');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit. Please try again or contact us directly.');
      setFormState('error');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Land Plot Investment Spain | 165,000m² Hotel & Residential Development | Rino Properties</title>
        <meta name="description" content="Premium 165,000m² land plot in Spain for hotel & residential development. Projected €9M+ NOI, 12% IRR. Exclusive investment opportunity by Rino Properties." />
        <meta name="keywords" content="land plot Spain, Spain property investment, hotel development Spain, residential land Spain, 165000 sqm land, high ROI Spain, commercial land Spain, Rino Properties Spain, real estate development opportunity, land for sale Spain" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rinoproperties.com/lanplot-spain" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/lanplot-spain" />
        <meta property="og:title" content="Land Plot Investment Spain | 165,000m² Development Opportunity" />
        <meta property="og:description" content="Premium 165,000m² land plot in Spain for hotel & residential development. Projected €9M+ NOI, 12% IRR. By Rino Properties." />
        <meta property="og:image" content="https://rinoproperties.com/images/spain.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Land Plot Investment Spain | 165,000m² Development" />
        <meta name="twitter:description" content="Premium land plot in Spain for hotel & residential development. High ROI investment by Rino Properties." />
        <meta name="twitter:image" content="https://rinoproperties.com/images/spain.webp" />
      </Head>
      {/* Skip navigation for accessibility */}
      <a
        href="#the-opportunity"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-gold focus:text-white focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>

      <Navbar />

      {/* ═══════════════ STICKY CTA ═══════════════ */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          showStickyCta
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#contact"
          className="group flex items-center bg-black gap-2 text-white px-6 py-3.5 shadow-2xl hover:opacity-90 transition-all duration-300 hover:shadow-gold/25 hover:shadow-xl"
          aria-label="Schedule a consultation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          <span className="text-sm font-semibold tracking-wider uppercase">
            Schedule a Call
          </span>
        </a>
      </div>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* BG image */}
        <img
          src="/images/hero1.jpeg"
          srcSet="/images/hero1.jpeg"
          sizes="100vw"
          alt="Lush Mediterranean forest representing the natural beauty of the Spanish coastline"
          className="absolute inset-0 w-full !h-[100vh] object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Content */}
        <div className={`relative z-10 text-center px-6 max-w-7xl mx-auto transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className={`decorative-line w-full max-w-2xl mx-auto mb-4 transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
          <h1 className="font-serif text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[4.25rem] font-bold text-white tracking-wide leading-[1.15] uppercase">
            The Magic of Nature in Málaga 
          </h1>
          <div className={`decorative-line w-full max-w-2xl mx-auto mt-4 transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />

          <p className={`mt-4 text-white text-xl md:text-3xl font-light tracking-wide transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            A Place the World Will Turn to for Hope
          </p>

          <div className={`mt-12 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a
              href="#contact"
              className="group flex text-align items-center bg-black gap-2 text-white px-6 py-3.5 shadow-2xl hover:opacity-90 transition-all duration-300 hover:shadow-gold/25 hover:shadow-xl"
            >
              Schedule a Call
            </a>
            <a
              href="#the-opportunity"
              className="px-10 py-4 border border-white/25 text-white font-semibold text-sm tracking-[0.15em] uppercase hover:bg-white/10 transition-colors duration-300"
            >
              Discover More
            </a>
          </div>

        
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[11px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse-slow" />
        </div>
      </section>

      {/* ════════════════════ WHY SPAIN ════════════════════ */}
      <section id="why-spain" className="relative reveal">
        <div className="grid lg:grid-cols-2 min-h-[720px]">
          {/* Left — Text */}
          <div className="bg-cream px-8 md:px-16 lg:px-20 xl:px-28 py-20 lg:py-28 flex flex-col justify-center">
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Investment Destination
            </span>
            <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight">
              Why Invest
              <br />
              In <span className="gradient-text">Spain</span>
            </h2>
            <p className="mt-6 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              Spain offers a dynamic investment environment driven by strong
              tourism, a growing hospitality sector and long-term value
              potential, making it an ideal destination for high-return real
              estate investments.
            </p>

            {/* Feature grid */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feature-card bg-white rounded-xl p-5 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 text-gold flex justify-center">
                    {f.icon}
                  </div>
                  <p className="text-[13px] font-semibold text-dark/75 leading-snug">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative min-h-[420px] lg:min-h-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80"
              alt="Aerial view of a Spanish coastal city"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
         
          </div>
        </div>
      </section>

      {/* ════════════════════ THE OPPORTUNITY ════════════════════ */}
      <section id="the-opportunity" className="relative reveal">
        <div className="grid lg:grid-cols-2 min-h-[720px]">
          {/* Left — Text */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200/80 px-8 md:px-16 lg:px-20 xl:px-28 py-20 lg:py-28 flex flex-col justify-center">
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              The Investment
            </span>
            <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight">
              A Luxury Hotel
              <br />
              Concept
            </h2>
            <p className="text-dark/40 text-lg font-serif italic mt-2">
              A Rare Investment Opportunity
            </p>

            <p className="mt-6 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              An exceptional opportunity to acquire a prime beachfront
              development plot, designed for a landmark hospitality project with
              strong international appeal.
            </p>
            <p className="mt-4 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              This opportunity is tailored for investors seeking high-value
              assets, combining luxury positioning, scalability and long-term
              capital growth.
            </p>

            {/* Highlights */}
            <h3 className="mt-10 text-lg font-bold text-dark tracking-wide">
              Key Investment Highlights
            </h3>
            <div className="mt-5 space-y-3.5">
              {highlights.map((h, i) => (
                <div key={i} className="highlight-item text-[15px]">
                  <span className="font-semibold text-dark">{h.label}:</span>
                  <span className="text-dark/60 ml-2">{h.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative min-h-[420px] lg:min-h-0 overflow-hidden bg-gray-300">
            <img
              src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80"
              alt="Aerial view of beachfront development area"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Info overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/45 backdrop-blur-sm px-8 py-5 text-center rounded-lg">
                <p className="text-white font-serif font-bold text-xl">
                  Plot Size: 2,400 m²
                </p>
                <p className="text-white/75 text-sm mt-1.5">
                  Hotel Capacity: 200 rooms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ STATS BAR ════════════════════ */}
      <section ref={statsRef.ref} className="bg-dark py-16 md:py-20 border-t border-white/5">
        <div className={`max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 transition-all duration-700 ${statsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {stats.map((s, i) => (
            <AnimatedStat key={i} value={s.value} label={s.label} inView={statsRef.inView} />
          ))}
        </div>
      </section>

      {/* ════════════════════ VISION ════════════════════ */}
      <section id="our-vision" className="relative reveal">
        <div className="grid lg:grid-cols-2 min-h-[720px]">
          {/* Left — Text */}
          <div className="bg-white px-8 md:px-16 lg:px-20 xl:px-28 py-20 lg:py-28 flex flex-col justify-center order-2 lg:order-1">
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Our Vision
            </span>
            <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight">
              The Beginning
              <br />
              of a New Era
            </h2>

            <p className="mt-6 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              We are proposing a new blueprint for tourism — one that leaves
              behind the logic of extraction and enters a regenerative era, where
              hotels function as off-grid, self-sufficient ecosystems that
              restore life.
            </p>
            <p className="mt-4 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              This is hospitality where every building harvests water, generates
              its own energy, and purifies the air. Where waste becomes resource,
              and every guest experience gives back more than it takes.
            </p>
            <p className="mt-4 text-dark/55 text-[1.05rem] leading-relaxed max-w-lg">
              Rooted in Nature-Based Architecture, powered by Green
              Infrastructures, built through next-generation construction, and
              orchestrated by intelligent AI Operating Systems — this is not a
              concept. It is a real, scalable demonstration of how luxury can be
              fully self-sufficient and live in balance with nature.
            </p>

            {/* Pillars */}
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {pillars.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                  <span className="text-sm font-medium text-dark/60">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative min-h-[420px] lg:min-h-0 overflow-hidden order-1 lg:order-2">
            <img
              src="/images/spain-hotel/pic2.jpeg"
              alt="Mediterranean coastal panorama"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
           
          </div>
        </div>
      </section>

      {/* ════════════════════ LANDMARK GREEN HOTEL ════════════════════ */}
      <section className="bg-[#e8e4e0] py-20 md:py-28 relative reveal">
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight">
            A Vision for a Landmark
            <br />
            5-Star Green Hotel
          </h2>

          <p className="mt-6 text-dark/60 text-[1.05rem] leading-relaxed max-w-4xl mx-auto">
            This project is envisioned as a luxury sustainable hotel, inspired
            by cutting-edge &ldquo;green architecture&rdquo; concepts seen in
            global destinations such as Singapore.{" "}
            <strong className="text-dark font-bold">
              Designed to blend innovation, sustainability, and high-end
              hospitality
            </strong>
            , the development is positioned to become:
          </p>

          {/* Bullet points */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6 sm:gap-16">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 bg-dark rounded-full flex-shrink-0 mt-1.5" />
              <span className="text-[15px] font-bold text-dark">
                One of the first eco-luxury hotels in Spain
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 bg-dark rounded-full flex-shrink-0 mt-1.5" />
              <span className="text-[15px] font-bold text-dark">
                A benchmark for future hospitality developments in Europe
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=80"
              alt="Aerial render of a luxury 5-star green hotel with terraced gardens along the coast"
              className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════ FLEXIBLE INVESTMENT ════════════════════ */}
      <section className="relative reveal">
        <div className="grid lg:grid-cols-2 lg:min-h-[720px]">
          {/* Left — Satellite Map Image */}
          <div className="relative min-h-[420px] lg:min-h-0 overflow-hidden bg-gray-800">
            <img
              src="/images/spain-hotel/map.jpeg"
              alt="Satellite aerial view of the beachfront plot location"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay labels */}
            <div className="absolute inset-0 flex items-end justify-center pb-10 lg:items-center lg:pb-0">
              <div className="relative -rotate-[20deg] lg:-rotate-[35deg]">
                <p className="text-white font-serif text-xl sm:text-2xl md:text-3xl font-bold italic drop-shadow-lg">
                  Plot Size: 2,400 m²
                </p>
                <p className="text-white/80 font-serif text-base sm:text-lg md:text-xl italic mt-1 drop-shadow-lg">
                  Hotel Capacity: 200 rooms
                </p>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="bg-gradient-to-br from-gray-200 to-gray-300/90 px-8 md:px-16 lg:px-20 xl:px-24 py-20 lg:py-24 flex flex-col justify-center relative">
           
            {/* Flexible Investment Structures */}
            <h2 className="font-serif text-4xl font-bold text-dark leading-tight">
              Flexible Investment
              <br />
              Structures
            </h2>

            <p className="mt-6 text-dark/70 text-[1.05rem] leading-relaxed max-w-lg">
              Investors are offered full flexibility to align with their
              strategy:
            </p>

            <ul className="mt-5 space-y-3">
              {[
                "Land Acquisition for independent development",
                "Turnkey Project Delivery",
                "Hotel Operation under own brand or third-party operator",
              ]?.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-dark rounded-full flex-shrink-0 mt-1.5" />
                  <span className="text-[15px] font-semibold text-dark/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Why This Investment Stands Out */}
            <h2 className="mt-16 font-serif text-4xl font-bold text-dark leading-tight">
              Why This Investment
              <br />
              Stands Out?
            </h2>

            <ul className="mt-6 space-y-3">
              {[
                "Prime beachfront location",
                "Strong tourism growth & international demand",
                "Proximity to future luxury marina",
                "High potential for capital appreciation",
                "Unique sustainable concept (market differentiation)",
              ]?.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-dark rounded-full flex-shrink-0 mt-1.5" />
                  <span className="text-[15px] font-semibold text-dark/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* ════════════════════ WE ARE RINO ════════════════════ */}
      <section ref={companyRef.ref} className="relative">
        <div className="grid lg:grid-cols-2 min-h-[640px]">
          {/* Left — Text on white */}
          <div className="bg-white px-8 md:px-16 lg:px-20 xl:px-28 py-20 lg:py-28 flex flex-col justify-center">
            <p className="font-serif text-3xl md:text-[2.5rem] font-light text-dark/40 leading-tight tracking-wide">
              WE ARE
            </p>
            <h2 className="font-serif text-3xl md:text-[2.5rem] font-bold text-dark leading-tight mt-1">
              Rino Invest Group
              <span className="text-red-600">.</span>
            </h2>

            <div className="mt-8 space-y-5 text-dark/60 text-[1.05rem] leading-relaxed max-w-xl">
              <p>
                A global investment and asset management company specializing in
                premium real estate opportunities and high-value development
                projects.
              </p>
              <p>
                With a strong international network and deep market expertise,
                Rino Invest Group connects investors with exclusive, off-market
                opportunities designed to deliver long-term growth and strong
                returns.
              </p>
              <p>
                Our approach is built on trust, discretion, and performance,
                ensuring that every opportunity is carefully selected and aligned
                with the expectations of sophisticated investors in balance with
                nature.
              </p>
            </div>

            {/* Company stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {companyStats.map((s, i) => (
                <div key={i} className={`text-center lg:text-left transition-all duration-600 ${companyRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: companyRef.inView ? `${400 + i * 100}ms` : '0ms' }}>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-gold leading-none">
                    {s.value}
                  </p>
                  <p className="text-dark/40 text-[11px] mt-2 tracking-[0.1em] uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative   overflow-hidden">
            <img
              src="/images/spain-hotel/pic1.jpeg"
              alt="Rino Invest Group corporate headquarters"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════ INVESTMENT PROCESS ════════════════════ */}
      <section ref={processRef.ref} className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${processRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight mt-4">
              Investment Process
            </h2>
            <p className="mt-4 text-dark/50 text-[1.05rem] max-w-xl mx-auto">
              A clear, structured path from first contact to asset ownership.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className={`relative group transition-all duration-700 ${processRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: processRef.inView ? `${i * 150}ms` : '0ms' }}>
                {/* Connector line (hidden on last item) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-30px)] h-px bg-gold/20" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                    <span className="font-serif text-2xl font-bold text-gold">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-bold text-dark text-[15px]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-dark/50 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CONCLUSION ════════════════════ */}
      <section ref={conclusionRef.ref} className="bg-[#d6d2cd] relative">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
          <div className={`bg-[#e2dedb] rounded-2xl px-8 md:px-16 lg:px-20 py-16 md:py-20 transition-all duration-800 ${conclusionRef.inView ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-0 translate-y-10 shadow-none'}`}>
            {/* Summary card header */}
            <div className="text-center">
              <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
                Investment Summary
              </span>
              <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight mt-4">
                Why This Opportunity
              </h2>
            </div>

            {/* Key metrics grid */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-y border-dark/10 py-8">
              <div className="text-center">
                <p className="font-serif text-2xl md:text-3xl font-bold text-gold">€16M</p>
                <p className="text-dark/45 text-xs mt-1 uppercase tracking-wider">Land Acquisition</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl md:text-3xl font-bold text-gold">€9.09M</p>
                <p className="text-dark/45 text-xs mt-1 uppercase tracking-wider">Projected NOI</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl md:text-3xl font-bold text-gold">200</p>
                <p className="text-dark/45 text-xs mt-1 uppercase tracking-wider">Hotel Rooms</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl md:text-3xl font-bold text-gold">5-Star</p>
                <p className="text-dark/45 text-xs mt-1 uppercase tracking-wider">Green Hotel</p>
              </div>
            </div>

            {/* Concise value propositions */}
            <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-3xl mx-auto">
              {[
                "Prime beachfront location with approved building rights",
                "Flexible investment structures — land, turnkey, or operated",
                "Strong tourism fundamentals and international demand",
                "Unique sustainable concept for market differentiation",
                "High projected returns with base NOI of €9.09M",
                "Full support from acquisition through development",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gold flex-shrink-0 mt-0.5">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-dark/70 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <a
                href="#contact"
                className="cta-shimmer inline-block px-12 py-4 bg-black text-white font-semibold text-sm tracking-[0.15em] uppercase hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Request Private Briefing
              </a>
            </div>

            {/* Contact info */}
            <div className="mt-12 pt-8 border-t border-dark/10 space-y-3">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-dark/50 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  ask@rinoinvest.com
                </span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2c2.5 2.8 4 6.2 4 10s-1.5 7.2-4 10c-2.5-2.8-4-6.2-4-10s1.5-7.2 4-10z" />
                  </svg>
                  www.rinoinvest.ch
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ FAQ ════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              Common Questions
            </span>
            <h2 className="font-serif text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-dark leading-tight mt-4">
              Investor FAQ
            </h2>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-dark/8">
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                >
                  <span className="text-[15px] font-semibold text-dark/80 group-hover:text-gold transition-colors pr-4">
                    {faq.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-5 h-5 text-dark/30 flex-shrink-0 transition-transform duration-300 ${
                      activeFaq === i ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-400 ease-in-out ${
                    activeFaq === i ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-dark/55 text-sm leading-relaxed pr-10">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CONTACT / CTA ════════════════════ */}
      <section id="contact" className="bg-cream py-4">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            Get Started
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark mt-4 leading-tight">
            Schedule a<br className="sm:hidden" /> Consultation
          </h2>
          <p className="mt-4 text-dark/60 text-lg max-w-xl mx-auto">
            Interested in this exclusive investment opportunity? Connect with our
            team for a private briefing and detailed investment prospectus.
          </p>

          {/* What to expect */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-dark/50 text-xs tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-gold">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              Response within 24h
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-gold">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
              </svg>
              100% Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-gold">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Dedicated Advisor
            </span>
          </div>

          <form
            className="mt-12 space-y-5 text-left"
            action="#"
            onSubmit={handleFormSubmit}
          >
            {/* Error banner */}
            {formState === 'error' && formError && (
              <div className="bg-red-50 border border-red-200 rounded-md px-5 py-4 flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <div>
                  <p className="text-red-700 text-sm font-medium">{formError}</p>
                  <button
                    type="button"
                    onClick={() => { setFormState('idle'); setFormError(''); }}
                    className="text-red-500 text-xs mt-1 underline hover:text-red-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {formState === 'success' ? (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-dark">Thank You</h3>
                <p className="mt-3 text-dark/50 text-[1.05rem] max-w-md mx-auto">
                  Your request has been received. A dedicated advisor will contact you within 24 hours for a private briefing.
                </p>
              </div>
            ) : (
            <>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-[11px] font-semibold text-dark/50 uppercase tracking-[0.15em] mb-2">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-dark text-sm placeholder:text-dark/25 rounded-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[11px] font-semibold text-dark/50 uppercase tracking-[0.15em] mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-dark text-sm placeholder:text-dark/25 rounded-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-phone" className="block text-[11px] font-semibold text-dark/50 uppercase tracking-[0.15em] mb-2">
                  Phone
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-dark text-sm placeholder:text-dark/25 rounded-sm"
                  placeholder="+34 000 000 000"
                />
              </div>
              <div>
                <label htmlFor="contact-budget" className="block text-[11px] font-semibold text-dark/50 uppercase tracking-[0.15em] mb-2">
                  Investment Budget
                </label>
                <select id="contact-budget" className="w-full px-4 py-3.5 bg-white border border-gray-200 text-dark text-sm rounded-sm">
                  <option value="">Select range</option>
                  <option value="1-5m">€1M – €5M</option>
                  <option value="5-10m">€5M – €10M</option>
                  <option value="10-16m">€10M – €16M</option>
                  <option value="16m+">€16M+</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-[11px] font-semibold text-dark/50 uppercase tracking-[0.15em] mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 text-dark text-sm placeholder:text-dark/25 rounded-sm resize-none"
                placeholder="Tell us about your investment interests…"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className={`px-14 py-4 bg-black text-white font-semibold text-sm tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${formState === 'submitting' ? 'opacity-60 cursor-wait' : 'hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5'}`}
              >
                {formState === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Request Private Briefing'}
              </button>
            </div>
            </>
            )}
          </form>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <Footer />
    </>
  );
}
