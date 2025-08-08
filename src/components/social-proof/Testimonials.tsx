'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Davidson',
    role: 'Professional Aquascaper',
    location: 'Prague, Czech Republic',
    avatar: 'JD',
    content: 'This tool revolutionized my aquascaping workflow! The 3D visualization saved me countless hours and helped me avoid costly mistakes. My clients are amazed by the precision.',
    rating: 5,
    date: '2 weeks ago',
    verified: true
  },
  {
    id: '2',
    name: 'Maria Stoeva',
    role: 'Hobbyist & Enthusiast',
    location: 'Sofia, Bulgaria',
    avatar: 'MS',
    content: 'Finally, a modern solution for aquarium planning! As someone who\'s made expensive mistakes before, this is exactly what the aquascaping community needed.',
    rating: 5,
    date: '1 week ago',
    verified: true
  },
  {
    id: '3',
    name: 'Alex Kovač',
    role: 'Aquarium Store Owner',
    location: 'Budapest, Hungary',
    avatar: 'AK',
    content: 'The 3D visualization feature is incredible. My customers love seeing their aquascape designs before committing. Sales have increased by 40% since we started using this.',
    rating: 5,
    date: '3 days ago',
    verified: true
  },
  {
    id: '4',
    name: 'Elena Rodriguez',
    role: 'Aquascaping Consultant',
    location: 'Bucharest, Romania',
    avatar: 'ER',
    content: 'Professional-grade tools that are actually user-friendly. The plant database and compatibility checker alone are worth the wait. Can\'t recommend this enough!',
    rating: 5,
    date: '5 days ago',
    verified: true
  },
  {
    id: '5',
    name: 'Peter Hansen',
    role: 'Contest Aquascaper',
    location: 'Vienna, Austria',
    avatar: 'PH',
    content: 'Used this for my last IAPLC entry and placed in the top 100! The precision and detail possible with these tools are unmatched. Game-changer for serious aquascapers.',
    rating: 5,
    date: '1 month ago',
    verified: true
  },
  {
    id: '6',
    name: 'Diana Müller',
    role: 'Aquatic Plant Specialist',
    location: 'Zurich, Switzerland',
    avatar: 'DM',
    content: 'The plant growth simulation feature is phenomenal. I can now predict how my aquascapes will evolve over time. This is the future of aquascaping design.',
    rating: 5,
    date: '2 weeks ago',
    verified: true
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, isActive = false }: { testimonial: Testimonial; isActive?: boolean }) {
  return (
    <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-500 ${
      isActive ? 'border-primary/30 shadow-xl scale-105' : 'border-accent/20'
    }`}>
      {/* Verified Badge */}
      {testimonial.verified && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {testimonial.avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-neutral-800">{testimonial.name}</h4>
          <p className="text-sm text-primary font-medium">{testimonial.role}</p>
          <p className="text-xs text-neutral-500">{testimonial.location}</p>
        </div>
        <div className="text-right">
          <StarRating rating={testimonial.rating} />
          <p className="text-xs text-neutral-400 mt-1">{testimonial.date}</p>
        </div>
      </div>

      {/* Content */}
      <blockquote className="text-neutral-700 leading-relaxed italic">
        "{testimonial.content}"
      </blockquote>
    </div>
  );
}

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [inView, isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 p-4">
              <TestimonialCard 
                testimonial={testimonial} 
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:shadow-xl"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:shadow-xl"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary shadow-lg' 
                : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${
          isAutoPlaying ? 'bg-green-500' : 'bg-neutral-400'
        }`} />
        <span className="text-xs text-neutral-500">
          {isAutoPlaying ? 'Auto-playing' : 'Paused'}
        </span>
      </div>
    </div>
  );
}

function TestimonialsGrid() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {testimonials.slice(0, 3).map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <TestimonialCard testimonial={testimonial} />
        </div>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">
            Trusted by <span className="text-primary">2,500+</span> Aquascapers
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            From hobbyists to professionals, our tools are transforming how people design aquascapes across Europe
          </p>
        </div>

        {/* Main Carousel */}
        <TestimonialsCarousel />

        {/* Additional Testimonials Grid */}
        <TestimonialsGrid />

        {/* Overall Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-neutral-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-neutral-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-neutral-600">Reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TestimonialCard, TestimonialsCarousel, TestimonialsGrid };