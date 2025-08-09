'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section - Full screen with real aquarium image */}
      <section className="relative h-screen">
        <Image
          src="/images/aquascaping/hero-aquascaped-tank-kazuend.jpg"
          alt="Professional Aquascape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              Master the Art of
              <span className="block text-cyan-400">Aquascaping</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
              Join Bulgaria's premier aquascaping platform. Design, learn, and create stunning underwater landscapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-none transition-colors text-lg">
                START YOUR JOURNEY
              </button>
              <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-semibold rounded-none transition-all text-lg">
                VIEW GALLERY
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Aquascaping Styles Grid - Like Ride Engine product categories */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Aquascaping Styles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From minimalist Iwagumi to lush Dutch styles, discover the perfect aesthetic for your aquarium
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Nature Style */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/aquascaping/green-aquatic-plants-gabor.jpg"
                  alt="Nature Style Aquascape"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Nature Style</h3>
                  <p className="text-gray-200">Recreate natural landscapes underwater</p>
                </div>
              </div>
            </div>

            {/* Iwagumi Style */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/aquascaping/iwagumi-style-aquascape.jpg"
                  alt="Iwagumi Style"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Iwagumi Style</h3>
                  <p className="text-gray-200">Minimalist stone arrangements</p>
                </div>
              </div>
            </div>

            {/* Dutch Style */}
            <div className="group cursor-pointer">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/aquascaping/dutch-style-planted-tank.jpg"
                  alt="Dutch Style"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Dutch Style</h3>
                  <p className="text-gray-200">Dense, colorful plant arrangements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Split Layout */}
      <section className="bg-gray-50">
        <div className="grid lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative h-96 lg:h-auto">
            <Image
              src="/images/aquascaping/person-working-on-aquarium.jpg"
              alt="Professional Aquascaper at Work"
              fill
              className="object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="py-16 px-8 md:px-16 lg:px-24 flex items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Professional Tools for Every Aquascaper
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From beginners to experts, our platform provides everything you need to create and maintain stunning aquascapes.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">3D Design Studio</strong>
                    <p className="text-gray-600">Visualize your aquascape before you build</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Plant Database</strong>
                    <p className="text-gray-600">600+ species with care guides</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Cost Calculator</strong>
                    <p className="text-gray-600">Budget your project accurately</p>
                  </div>
                </li>
              </ul>

              <button className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-semibold transition-colors inline-flex items-center gap-2">
                EXPLORE FEATURES
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Community Showcase
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get inspired by stunning aquascapes from our Bulgarian and Hungarian community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              '/images/aquascaping/colorful-fish-aquarium-delbert.jpg',
              '/images/aquascaping/underwater-view-karl.jpg',
              '/images/aquascaping/tropical-fish-collection-ahmed.jpg',
              '/images/aquascaping/modern-aquarium-setup.jpg',
              '/images/aquascaping/aquarium-plants-detail.jpg',
              '/images/aquascaping/underwater-plants-aquarium-pexels.jpg',
              '/images/aquascaping/goldfish-aquarium.jpg',
              '/images/aquascaping/aquatic-plants-closeup.jpg',
            ].map((src, index) => (
              <div key={index} className="relative h-64 group cursor-pointer overflow-hidden">
                <Image
                  src={src}
                  alt={`Community Aquascape ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-6 py-3 bg-white text-black font-semibold">
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold transition-all">
              VIEW ALL SUBMISSIONS
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">2,487+</div>
              <div className="text-gray-400">Active Aquascapers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">15</div>
              <div className="text-gray-400">Partner Stores</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">600+</div>
              <div className="text-gray-400">Plant Species</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">89%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Essential Equipment & Materials
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access curated equipment recommendations from professional aquascapers. We partner with trusted suppliers across Bulgaria and Hungary.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Hardscape</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Dragon Stone</li>
                    <li>• Seiryu Stone</li>
                    <li>• Manzanita Wood</li>
                    <li>• ADA Aqua Soil</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Equipment</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• CO2 Systems</li>
                    <li>• LED Lighting</li>
                    <li>• Filtration</li>
                    <li>• Maintenance Tools</li>
                  </ul>
                </div>
              </div>

              <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors">
                BROWSE EQUIPMENT GUIDE
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48">
                  <Image
                    src="/images/aquascaping/aquascaping-hardscape-stones.jpg"
                    alt="Hardscape Materials"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64">
                  <Image
                    src="/images/aquascaping/aquarium-tools-equipment.jpg"
                    alt="Aquascaping Tools"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64">
                  <Image
                    src="/images/aquascaping/aquatic-plants-closeup.jpg"
                    alt="Aquatic Plants"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48">
                  <Image
                    src="/images/aquascaping/aquarium-maintenance-setup.jpg"
                    alt="Maintenance Setup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-96 flex items-center justify-center">
        <Image
          src="/images/aquascaping/underwater-view-karl.jpg"
          alt="Join Aquascene"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Aquascaping Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join Bulgaria's fastest-growing aquascaping community and transform your vision into reality
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 text-lg border-2 border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:border-cyan-400"
            />
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold whitespace-nowrap transition-colors">
              GET STARTED
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Aquascene</h3>
            <p className="text-sm">
              Bulgaria's premier platform for aquascaping enthusiasts
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Getting Started</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plant Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Troubleshooting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contests</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© 2024 Aquascene. All rights reserved. | Sofia, Bulgaria</p>
        </div>
      </footer>
    </main>
  );
}