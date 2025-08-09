'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckIcon, PhoneIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import WaitlistForm from '@/components/forms/WaitlistForm';

export default function HomePage() {
  const [currentYear] = useState(2025);

  // Professional services offered by Aquascene
  const services = [
    {
      title: 'Custom Aquascape Design',
      description: 'Professional aquarium design tailored to your space and preferences',
      icon: '🎨'
    },
    {
      title: 'Complete Installation',
      description: 'Full setup including hardscape, planting, and equipment configuration',
      icon: '🔧'
    },
    {
      title: 'Maintenance Services',
      description: 'Regular maintenance to keep your aquascape healthy and beautiful',
      icon: '🌱'
    },
    {
      title: 'Consultation & Support',
      description: 'Expert advice and ongoing support for your aquascaping journey',
      icon: '💡'
    }
  ];

  return (
    <main style={{ backgroundColor: '#FAFAFA' }} className="relative">
      
      {/* Professional Hero Section */}
      <section className="relative min-h-screen flex items-center" 
               style={{ background: 'linear-gradient(135deg, #2D5A3D 0%, #1e3a28 50%, #0f1f14 100%)' }}>
        
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/aquascaping/hero-aquascaped-tank-kazuend.jpg"
            alt="Professional Aquascaping Services by Aquascene"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Main Content */}
            <div>
              {/* Green Aqua Partnership Badge */}
              <div className="flex items-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white text-sm font-medium">
                    🤝 Official Green Aqua Hungary Partner
                  </span>
                </div>
              </div>
              
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight" 
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="block">AQUASCENE</span>
                  <span className="block text-3xl lg:text-4xl font-normal mt-2" 
                        style={{ color: '#DE521D' }}>
                    Professional Aquascaping Services
                  </span>
                </h1>
              </motion.div>
              
              {/* Subheading */}
              <motion.p
                className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Bulgaria's premier professional aquascaping company. We design, install, and maintain 
                stunning aquariums for homes and businesses across Bulgaria.
              </motion.p>
              
              {/* Location & Contact */}
              <div className="flex items-center gap-6 mb-8 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" style={{ color: '#DE521D' }} />
                  <span>Sofia, Bulgaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5" style={{ color: '#DE521D' }} />
                  <span>Professional Services</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  className="px-8 py-4 text-white font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105"
                  style={{ 
                    backgroundColor: '#DE521D',
                    borderRadius: '8px'
                  }}
                  whileHover={{ 
                    backgroundColor: '#c44419',
                    boxShadow: '0 10px 30px rgba(222, 82, 29, 0.4)'
                  }}
                  onClick={() => {
                    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  GET PROFESSIONAL CONSULTATION
                </motion.button>
                
                <motion.button 
                  className="px-8 py-4 border-2 text-white font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105"
                  style={{ 
                    borderColor: '#2D5A3D',
                    borderRadius: '8px'
                  }}
                  whileHover={{ 
                    backgroundColor: '#2D5A3D',
                    boxShadow: '0 10px 30px rgba(45, 90, 61, 0.4)'
                  }}
                >
                  VIEW OUR WORK
                </motion.button>
              </div>
            </div>
            
            {/* Right Column - Trust Indicators */}
            <div className="space-y-6">
              {/* Green Aqua Partnership */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-3">
                  <StarIcon className="w-6 h-6 mr-3" style={{ color: '#DE521D' }} />
                  <h3 className="text-white font-semibold text-lg">Authorized Green Aqua Partner</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Official partnership with Europe's leading aquascaping retailer, 
                  ensuring premium materials and expertise.
                </p>
              </div>
              
              {/* Services Overview */}
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <h4 className="text-white font-medium text-sm mb-1">{service.title}</h4>
                    <p className="text-gray-400 text-xs">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="py-20" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" 
                style={{ color: '#2D5A3D', fontFamily: 'Inter, sans-serif' }}>
              Professional Aquascaping Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" 
               style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
              From concept to completion, we provide comprehensive aquascaping solutions 
              for residential and commercial clients across Bulgaria.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
                style={{ border: '2px solid transparent' }}
                whileHover={{ 
                  borderColor: '#2D5A3D',
                  transform: 'translateY(-5px)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4" 
                    style={{ color: '#2D5A3D', fontFamily: 'Inter, sans-serif' }}>
                  {service.title}
                </h3>
                <p className="text-gray-600" 
                   style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Green Aqua Partnership Section */}
      <section className="py-20" style={{ backgroundColor: '#2D5A3D' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Side */}
            <div className="relative h-96 lg:h-auto">
              <Image
                src="/images/aquascaping/person-working-on-aquarium.jpg"
                alt="Aquascene Professional at Work"
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-white rounded-lg px-4 py-2">
                  <span className="font-bold" style={{ color: '#DE521D' }}>
                    GREEN AQUA PARTNER
                  </span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-6" 
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Why Choose Aquascene?
              </h2>
              <p className="text-xl text-gray-200 mb-8" 
                 style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                As Bulgaria's authorized Green Aqua partner, we bring European-standard 
                expertise and premium materials to every project.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" 
                            style={{ color: '#DE521D' }} />
                  <div>
                    <strong className="text-white">Certified Professionals</strong>
                    <p className="text-gray-300">Trained aquascaping experts with years of experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" 
                            style={{ color: '#DE521D' }} />
                  <div>
                    <strong className="text-white">Premium Materials</strong>
                    <p className="text-gray-300">Green Aqua hardscape, plants, and equipment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" 
                            style={{ color: '#DE521D' }} />
                  <div>
                    <strong className="text-white">Ongoing Support</strong>
                    <p className="text-gray-300">Maintenance and consultation services available</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-0.5" 
                            style={{ color: '#DE521D' }} />
                  <div>
                    <strong className="text-white">Bulgarian Market Leader</strong>
                    <p className="text-gray-300">First professional aquascaping service in Bulgaria</p>
                  </div>
                </li>
              </ul>

              <motion.button 
                className="px-8 py-4 text-white font-semibold transition-all duration-300 hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: '#DE521D',
                  borderRadius: '8px'
                }}
                whileHover={{ 
                  backgroundColor: '#c44419',
                  boxShadow: '0 10px 30px rgba(222, 82, 29, 0.4)'
                }}
              >
                SCHEDULE CONSULTATION
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Waitlist Section */}
      <section id="waitlist-form" className="py-20" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" 
                style={{ color: '#2D5A3D', fontFamily: 'Inter, sans-serif' }}>
              Get Your Professional Aquascape
            </h2>
            <p className="text-xl text-gray-600 mb-12" 
               style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
              Join our exclusive waitlist for professional aquascaping services. 
              Be the first to transform your space with Bulgaria's premier aquascaping experts.
            </p>
            
            {/* Professional Waitlist Form */}
            <div className="bg-white rounded-lg shadow-xl p-8" 
                 style={{ border: '2px solid #2D5A3D' }}>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer style={{ backgroundColor: '#2D5A3D' }} className="text-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div>
              <h3 className="font-bold text-2xl mb-4" 
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                AQUASCENE
              </h3>
              <p className="text-gray-300 mb-4" 
                 style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                Bulgaria's premier professional aquascaping company. 
                Authorized Green Aqua partner bringing European excellence to Bulgaria.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="w-4 h-4" style={{ color: '#DE521D' }} />
                <span>Sofia, Bulgaria</span>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-white" 
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Professional Services
              </h4>
              <ul className="space-y-2 text-sm text-gray-300" 
                  style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                <li>Custom Aquascape Design</li>
                <li>Complete Installation</li>
                <li>Maintenance Services</li>
                <li>Professional Consultation</li>
                <li>Commercial Projects</li>
              </ul>
            </div>
            
            {/* Partnership */}
            <div>
              <h4 className="font-semibold mb-4 text-white" 
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Partnership
              </h4>
              <div className="mb-4">
                <div className="bg-white rounded-lg p-3 inline-block">
                  <span className="font-bold text-sm" style={{ color: '#DE521D' }}>
                    Official Green Aqua Partner
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Authorized retailer and service provider for Green Aqua Hungary products and materials.
              </p>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white" 
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                Get Started
              </h4>
              <ul className="space-y-2 text-sm text-gray-300" 
                  style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
                <li>Free Consultation</li>
                <li>Project Estimation</li>
                <li>Professional Assessment</li>
                <li>Maintenance Plans</li>
              </ul>
              
              <motion.button 
                className="mt-6 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: '#DE521D',
                  borderRadius: '6px'
                }}
                whileHover={{ 
                  backgroundColor: '#c44419',
                  boxShadow: '0 8px 20px rgba(222, 82, 29, 0.4)'
                }}
              >
                CONTACT US
              </motion.button>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-green-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400" 
               style={{ fontFamily: 'Source Sans Pro, sans-serif' }}>
              © {currentYear} Aquascene Professional Aquascaping Services. All rights reserved. | Sofia, Bulgaria
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Authorized Green Aqua Hungary Partner • Professional Aquascaping Services
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}