/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Remove static export for API routes to work
  // output: 'export',
  basePath: isProd ? '/aquascene-waitlist' : '',
  assetPrefix: isProd ? '/aquascene-waitlist/' : '',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Allow inline scripts for Next.js
              "style-src 'self' 'unsafe-inline'", // Allow inline styles for Tailwind
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: isProd,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Build optimizations (swcMinify is enabled by default in Next.js 15)
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking optimization
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
      
      // Bundle splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    // Analyze bundle size in development
    if (!dev && process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      );
    }
    
    return config
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-checkbox',
      '@radix-ui/react-select', 
      '@radix-ui/react-toast',
      '@heroicons/react',
      'lucide-react',
      'framer-motion'
    ],
  },
}

module.exports = nextConfig