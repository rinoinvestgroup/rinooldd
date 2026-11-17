import type { NextConfig } from "next";

// Generate a unique build ID on each build for cache busting
const buildId = `build-${Date.now()}`;

const nextConfig = {
  // Unique build ID for cache invalidation across all browsers
  generateBuildId: async () => buildId,
  
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  /* Performance and SEO optimizations */
  reactStrictMode: true,
  
  // Ensure no trailing slashes for consistent canonical URLs
  trailingSlash: false,
  
  // Note: i18n is handled by our custom LanguageContext for App Router compatibility
  
  // Enhanced image optimization for 416KB savings and Core Web Vitals
  images: {
    qualities: [75, 85], // Allow both quality settings
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rino.s3.me-central-1.amazonaws.com',
      },
     
    ],
    formats: ['image/webp', 'image/avif'], // WebP and AVIF for best balance
    minimumCacheTTL: 60, // Shorter cache for images that might 404
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Optimized device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Optimized image sizes
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // DISABLE optimization to avoid Vercel 402 payment errors
    unoptimized: true, // Bypass Next.js image optimization - serve images directly
    loader: 'default',
    contentDispositionType: 'inline',
    // Allow images to fail gracefully
    domains: [], // deprecated but keeping for backwards compatibility
  },
  
  // Mobile-specific optimizations
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Webpack optimization for reducing TBT
  webpack: (config: { optimization: { splitChunks: object } }, { buildId, dev, isServer, defaultLoaders, webpack }: { buildId: string; dev: boolean; isServer: boolean; defaultLoaders: object; webpack: object }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 200000,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            maxSize: 150000,
          },
          nextjs: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next',
            chunks: 'all',
            priority: 15,
            maxSize: 150000,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            maxSize: 100000,
          },
        },
      };
    }
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', 'react-i18next'],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: true, // Enable source maps for better debugging and Lighthouse insights

  // Turbopack configuration (new stable format)
  turbopack: {
    rules: {},
  },

  // Headers for security and performance
  async headers() {
    return [
      // HTML pages - allow short caching for search engine crawlers while keeping content fresh
      {
        source: '/:path((?!_next|static|images|api|favicon|sw).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, User-Agent',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://tagmanager.google.com https://formspree.io https://connect.facebook.net https://m4pmencesm.ap-south-1.awsapprunner.com https://assets.apollo.io *.tawk.to cdn.jsdelivr.net https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com *.tawk.to cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com *.tawk.to data:",
              "img-src 'self' data: https: blob: https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com https://rino.s3.me-central-1.amazonaws.com https://images.unsplash.com https://www.facebook.com *.tawk.to cdn.jsdelivr.net tawk.link s3.amazonaws.com",
              "media-src 'self' https:",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'https://mmgapuw326.ap-south-1.awsapprunner.com'} http://localhost:* https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://tagmanager.google.com https://stats.g.doubleclick.net https://formspree.io https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com https://rino.s3.me-central-1.amazonaws.com https://*.amazonaws.com https://*.awsapprunner.com https://m4pmencesm.ap-south-1.awsapprunner.com https://www.rinoproperties.com https://rinoproperties.com https://connect.facebook.net https://www.facebook.com *.tawk.to wss://*.tawk.to https://*.tawk.help https://aplo-evnt.com`,
              "frame-src 'self' https://www.googletagmanager.com https://tagmanager.google.com https://www.google.com https://*.google.com *.tawk.to",
              "worker-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://formspree.io *.tawk.to",
              "frame-ancestors 'self'"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      {
        source: '/squarex-residence',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Link',
            value: '</images/tasmeer/bg.webp>; rel=preload; as=image; type=image/webp; fetchpriority=high',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/favicon-:size.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/apple-touch-icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/android-chrome-:size.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      // Dynamic image caching - shorter TTL for admin panel updates
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/:path*.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/:path*.avif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept',
          },
        ],
      },
      // Font caching - longer TTL since fonts rarely change
      {
        source: '/:path*.woff',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable, stale-while-revalidate=604800',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable, stale-while-revalidate=604800',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/:path*.ttf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable, stale-while-revalidate=604800',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // CSS/JS caching - shorter TTL for immediate updates when styles/code change
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/:path*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, must-revalidate, stale-while-revalidate=300',
          },
        ],
      },
      // Service Worker - needs short cache for updates
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Redirects for SEO and HTTPS enforcement
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/property/:path*',
        destination: '/properties/:path*',
        permanent: true,
      },
      {
        source: '/about/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/sell/',
        destination: '/sell',
        permanent: true,
      },
      // Redirect lowercase gfs-development to uppercase folder
      {
        source: '/gfs-development',
        destination: '/GFS-development',
        permanent: true,
      },
      // Redirect youtube-channel to the static HTML file
      {
        source: '/youtube-channel',
        destination: '/youtube-channel.html',
        permanent: true,
      },
      {
        source: '/dubai-property-services',
        destination: '/dubai-real-estate-services',
        permanent: true,
      },
      // Handle locale-prefixed property routes - redirect to main properties pages
      // These are for users accessing localized URLs directly
      {
        source: '/ar/properties',
        destination: '/properties/dubai',
        permanent: true,
      },
      {
        source: '/ar/properties/dubai',
        destination: '/properties/dubai',
        permanent: true,
      },
      {
        source: '/es/properties',
        destination: '/properties/spain',
        permanent: true,
      },
      {
        source: '/es/properties/spain',
        destination: '/properties/spain',
        permanent: true,
      },
      // Generic locale redirects for properties
      {
        source: '/:locale(ar|es|zh|de|hi|ur|fa)/properties/:path*',
        destination: '/properties/:path*',
        permanent: true,
      },
      // Remove trailing slashes for canonical URL consistency
      {
        source: '/:path((?!.*\\.).*)+/',
        destination: '/:path',
        permanent: true,
      },
    ];
  },
};

export default nextConfig as NextConfig;
