'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { getImagePath } from '@/lib/utils';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
    description?: string;
  }>;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious
}) => {
  const currentImage = images[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <div className="relative z-10 max-w-7xl max-h-screen w-full h-full flex flex-col items-center justify-center px-4 md:px-8">
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-20 p-2 text-white hover:text-cyan-400 transition-colors bg-black/50 rounded-full backdrop-blur-sm"
              onClick={onClose}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-cyan-400 transition-colors bg-black/50 rounded-full backdrop-blur-sm"
                  onClick={onPrevious}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </motion.button>

                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-cyan-400 transition-colors bg-black/50 rounded-full backdrop-blur-sm"
                  onClick={onNext}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </motion.button>
              </>
            )}

            {/* Image container */}
            <motion.div
              className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentImage.src.startsWith('http') ? currentImage.src : getImagePath(`images/aquascaping/${currentImage.src}.jpg`)}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"
                />
              </div>
            </motion.div>

            {/* Image info */}
            {(currentImage.caption || currentImage.description) && (
              <motion.div
                className="absolute bottom-8 left-8 right-8 max-w-2xl mx-auto text-white bg-black/50 backdrop-blur-sm rounded-lg p-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentImage.caption && (
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">
                    {currentImage.caption}
                  </h3>
                )}
                {currentImage.description && (
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {currentImage.description}
                  </p>
                )}
              </motion.div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {currentIndex + 1} / {images.length}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;