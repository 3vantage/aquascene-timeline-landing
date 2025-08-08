/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/aquascene-waitlist' : '',
  assetPrefix: isProd ? '/aquascene-waitlist/' : '',
  
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