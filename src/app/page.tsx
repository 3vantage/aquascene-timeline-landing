import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import AquariumLayout from '@/components/layout/AquariumLayout';

// Lazy load components that are below the fold to improve initial load time
const FeaturesSection = dynamic(() => import('@/components/sections/FeaturesSection'), {
  ssr: true, // Enable SSR for SEO
});

const WaitlistSection = dynamic(() => import('@/components/sections/WaitlistSection'), {
  ssr: true, // Enable SSR for SEO since this is the main CTA
});

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  loading: () => <div className="h-64 animate-pulse bg-gradient-to-r from-accent/10 to-transparent" />,
});

// Force static generation for export
export const dynamicParams = false;

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Design Your Dream Aquascape - 3D Aquascaping Platform',
  description: 'Plan before you plant. Save money, avoid mistakes. Join 2,500+ Bulgarian & Hungarian aquascapers using our 3D design tools.',
  keywords: 'aquascaping, aquarium design, 3D aquascape, underwater landscape, aquatic plants, fish tank design, professional aquascaping',
  authors: [{ name: '3vantage' }],
  creator: '3vantage',
  publisher: '3vantage',
  robots: 'index, follow',
  openGraph: {
    title: 'Design Your Dream Aquascape - 3D Aquascaping Platform',
    description: 'Plan before you plant. Save money, avoid mistakes. Join 2,500+ Bulgarian & Hungarian aquascapers using our 3D design tools.',
    type: 'website',
    siteName: '3vantage Aquascaping',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Design Your Dream Aquascape - 3D Aquascaping Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Design Your Dream Aquascape - 3D Aquascaping Platform',
    description: 'Plan before you plant. Save money, avoid mistakes. Join 2,500+ Bulgarian & Hungarian aquascapers using our 3D design tools.',
    images: ['/twitter-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function HomePage() {
  return (
    <main className="relative">
      <AquariumLayout>
        {/* Hero Section - Surface level */}
        <HeroSection />
        
        {/* Features Section - Shallow water */}
        <FeaturesSection />
        
        {/* Waitlist Section - Mid-water */}
        <WaitlistSection />
        
        {/* Testimonials Section - Deep water */}
        <TestimonialsSection />
      </AquariumLayout>
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '3vantage Aquascaping',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Web',
            description: 'Professional aquascaping design and calculation tools for creating stunning underwater landscapes.',
            url: 'https://3vantage.com/',
            author: {
              '@type': 'Organization',
              name: '3vantage',
              url: 'https://3vantage.com'
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/PreOrder'
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              reviewCount: '3'
            }
          })
        }}
      />
    </main>
  );
}