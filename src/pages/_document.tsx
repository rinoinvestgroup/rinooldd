import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (

    <Html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <Head>
        {/* Critical Resource Hints - Only 3 preconnects for resources used on initial page load */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* DNS prefetch for other external domains */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://rino.s3.me-central-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://formspree.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* <link rel="dns-prefetch" href="https://invitejs.trustpilot.com" /> */}
        
        {/* Analytics scripts moved to _app.tsx using next/script */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2326254387772475&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Microsoft Clarity - Deferred for better LCP */}
        {/* <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "u1s074jlqk");
                }, 2500);
              });
            `
          }}
        /> */}
        {/* End Microsoft Clarity */}

        {/* Apollo.io Tracking - deferred for mobile performance */}
        {/* <script
          defer
          fetchPriority="low"
          dangerouslySetInnerHTML={{
            __html: `
              // Defer Apollo.io to reduce TBT
              window.addEventListener('load', function() {
                setTimeout(function() {
                  function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
                  o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
                  o.onload=function(){window.trackingFunctions.onLoad({appId:"690a080d5f682d00118602b6"})},
                  document.head.appendChild(o)}initApollo();
                }, 2000);
              });
            `
          }}
        /> */}
        {/* End Apollo.io Tracking */}

        {/* Trustpilot Invitation Script - Deferred for better LCP */}
        {/* <script
          defer
          fetchPriority="low"
          dangerouslySetInnerHTML={{
            __html: `
              // Defer Trustpilot to reduce TBT and improve Core Web Vitals
              window.addEventListener('load', function() {
                setTimeout(function() {
                  (function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};
                  var a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;var f=d.getElementsByTagName(s)[0];
                  f.parentNode.insertBefore(a,f)})(window,document,'script', 'https://invitejs.trustpilot.com/tp.min.js', 'tp');
                  tp('register', 'QVrvpVSq4Jg5JnlC');
                  
                  // Trustpilot invitation trigger
                  // This function can be called when you want to send a review invitation
                  window.sendTrustpilotInvitation = function(recipientEmail, recipientName, referenceId) {
                    if (typeof tp !== 'undefined') {
                      const trustpilot_invitation = {
                        recipientEmail: recipientEmail,
                        recipientName: recipientName,
                        referenceId: referenceId,
                        source: 'InvitationScript',
                      };
                      tp('createInvitation', trustpilot_invitation);
                    }
                  };
                }, 2500);
              });
            `
          }}
        /> */}
        {/* End Trustpilot Script */}

        {/* Preload ONLY critical hero font weight - Poppins 700 for h1 */}
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="" 
        />
        
        {/* Load font CSS asynchronously to prevent render blocking */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;500;600&display=swap" 
          rel="stylesheet" 
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link 
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;500;600&display=swap" 
            rel="stylesheet" 
          />
        </noscript>
        
        {/* Preload LCP background image - responsive for mobile */}
        <link
          rel="preload"
          as="image"
          href="/images/fall_hero_desk.webp"
          fetchPriority="high"
          imageSrcSet="/images/fall_hero_desk.webp 1920w"
          imageSizes="100vw"
        />
        
        {/* Critical CSS for LCP optimization - inline to prevent render blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift and optimize LCP */
            .hero-section {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            /* Mobile-specific optimizations for Core Web Vitals */
            @media (max-width: 768px) {
              /* Optimize button interactions for mobile INP */
              button, a {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
              }
              
              /* Optimize scrolling performance */
              * {
                -webkit-overflow-scrolling: touch;
              }
            }
            
            /* Critical font loading */
            @font-face {
              font-family: 'Poppins';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2) format('woff2');
            }
            
            /* Optimize h1 rendering */
            h1 {
              font-family: 'Poppins', system-ui, -apple-system, sans-serif;
              contain: layout style paint;
              content-visibility: auto;
            }
          `
        }} />
        
        {/* Additional DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//wa.me" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Rino Properties Blog" href="https://rinoproperties.com/feed.xml" />
        
        {/* Performance and security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Structured Data for Organization - proper RealEstateAgent schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Rino Properties",
              "alternateName": "RINO Properties Real Estate Agency",
              "description": "Award-winning luxury real estate agency specializing in premium properties in Spain and Dubai. Offering expert property investment guidance, off-plan developments, and exclusive villa & apartment sales.",
              "url": "https://rinoproperties.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
                "width": 250,
                "height": 60
              },
              "image": {
                "@type": "ImageObject",
                "url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630",
                "width": 1200,
                "height": 630
              },
              "telephone": "+971-43-21-2433",
              "email": "ask@rinoproperties.com",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Business Village Building – B, Office 330",
                  "addressLocality": "Dubai",
                  "addressRegion": "Dubai",
                  "postalCode": "00000",
                  "addressCountry": "AE"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Madrid City Center",
                  "addressLocality": "Madrid",
                  "addressRegion": "Madrid",
                  "postalCode": "28001",
                  "addressCountry": "ES"
                }
              ],
              "areaServed": [
                {"@type": "City", "name": "Dubai"},
                {"@type": "City", "name": "Madrid"},
                {"@type": "City", "name": "Barcelona"},
                {"@type": "City", "name": "Marbella"},
                {"@type": "Country", "name": "Spain"},
                {"@type": "Country", "name": "United Arab Emirates"}
              ],
              "priceRange": "$$$",
              "knowsAbout": ["Luxury Real Estate", "Property Investment", "Off-Plan Properties", "Villa Sales", "Apartment Rentals", "Dubai Real Estate Market", "Spanish Property Market"],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "sameAs": [
                "https://www.instagram.com/rinoproperties",
                "https://www.facebook.com/rinoproperties",
                "https://www.linkedin.com/company/rinoproperties",
                "https://twitter.com/rinoproperties"
              ],
              "founder": {
                "@type": "Person",
                "name": "Ferdinand Jordan"
              },
              "foundingDate": "2020",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": 50
              }
            })
          }}
        />
      </Head>
      <body className="antialiased bg-white text-gray-900 min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8X4TM6V"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#D69F3F]-600 text-white px-4 py-2 rounded-md z-50"
          aria-label="Skip to main content - jump to the main section of the page"
        >
          Skip to main content
        </a>
        
        <Main />
        <NextScript />
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Basic performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 0) {
                    }
                  }, 0);
                });
              }
            `
          }}
        />
      </body>
    </Html>
  );
}
