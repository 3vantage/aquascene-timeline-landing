'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Settings, 
  Mountain, 
  Droplets, 
  Leaf, 
  Fish, 
  Sparkles,
  Clock,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

interface TimelineStep {
  id: string
  title: string
  description: string
  detailedDescription: string
  icon: React.ReactNode
  duration: string
  difficulty: string
  color: string
  bgColor: string
  imageUrl: string
}

const timelineSteps: TimelineStep[] = [
  {
    id: 'setup',
    title: 'Tank Setup',
    description: 'Prepare the empty tank and essential equipment for your aquascaping journey.',
    detailedDescription: 'Start with a clean, empty tank and gather all necessary equipment. This foundational step sets the stage for your entire aquascaping project.',
    icon: <Settings className="w-8 h-8" />,
    duration: '1-2 hours',
    difficulty: 'Easy',
    color: 'text-slate-400',
    bgColor: 'from-slate-500/20 to-gray-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'hardscape',
    title: 'Hardscape Design',
    description: 'Create the foundation with stones and driftwood to establish your aquascape structure.',
    detailedDescription: 'Position stones and driftwood to create depth, focal points, and natural pathways. This is where artistic vision meets technical planning.',
    icon: <Mountain className="w-8 h-8" />,
    duration: '2-4 hours',
    difficulty: 'Medium',
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-orange-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'substrate',
    title: 'Substrate Addition',
    description: 'Layer nutrient-rich aqua soil to create the foundation for healthy plant growth.',
    detailedDescription: 'Add aqua soil and create gentle slopes to enhance the visual depth and provide nutrients for plants.',
    icon: <div className="w-8 h-8 bg-amber-600 rounded-full"></div>,
    duration: '30-45 minutes',
    difficulty: 'Easy',
    color: 'text-amber-500',
    bgColor: 'from-amber-600/20 to-yellow-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'planting',
    title: 'Plant Installation',
    description: 'Carefully plant according to zones: foreground carpets, midground features, background stems.',
    detailedDescription: 'Strategic placement of aquatic plants creates natural beauty and provides oxygen for the ecosystem.',
    icon: <Leaf className="w-8 h-8" />,
    duration: '1-3 hours',
    difficulty: 'Medium',
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'flooding',
    title: 'Initial Flooding',
    description: 'Slowly add water using gentle techniques to avoid disturbing the substrate and plants.',
    detailedDescription: 'The critical moment when your dry landscape becomes an aquatic environment. Proper flooding technique preserves your careful work.',
    icon: <Droplets className="w-8 h-8" />,
    duration: '45-60 minutes',
    difficulty: 'Medium',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cycling',
    title: 'Nitrogen Cycling',
    description: 'Allow beneficial bacteria to establish over 4-6 weeks. Monitor parameters and add nutrients.',
    detailedDescription: 'The invisible but crucial process where beneficial bacteria colonize your tank, creating a stable ecosystem.',
    icon: <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-dashed animate-spin"></div>,
    duration: '4-6 weeks',
    difficulty: 'Hard',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-teal-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1605649640529-2fdc5c4d1056?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'inhabitants',
    title: 'First Inhabitants',
    description: 'Introduce fish and invertebrates gradually to complete your thriving ecosystem.',
    detailedDescription: 'The rewarding moment when you add life to your aquascape. Careful selection and gradual introduction ensure success.',
    icon: <Fish className="w-8 h-8" />,
    duration: '1-2 weeks',
    difficulty: 'Medium',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-red-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'mature',
    title: 'Mature Aquascape',
    description: 'Enjoy your completed ecosystem as it develops natural balance and stunning beauty.',
    detailedDescription: 'Your aquascape reaches maturity with established plant growth, stable parameters, and a thriving ecosystem.',
    icon: <Sparkles className="w-8 h-8" />,
    duration: 'Ongoing',
    difficulty: 'Easy',
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    imageUrl: 'https://images.unsplash.com/photo-1517002491449-7b02e2b8c9e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
]

export function SimpleTimelineContainer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({})

  const currentStepData = timelineSteps[currentStep]

  // Preload next images for smoother transitions
  useEffect(() => {
    const preloadImages = () => {
      for (let i = currentStep; i < Math.min(currentStep + 3, timelineSteps.length); i++) {
        const img = new globalThis.Image()
        img.src = timelineSteps[i].imageUrl
      }
    }
    preloadImages()
  }, [currentStep])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < timelineSteps.length - 1) {
            setCompletedSteps(completed => [...completed, prev])
            return prev + 1
          } else {
            setIsAutoPlaying(false)
            return prev
          }
        })
      }, 4000) // 4 second intervals for better viewing
    }
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const startAutoPlay = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsAutoPlaying(true)
  }

  const pausePlay = () => {
    setIsAutoPlaying(false)
  }

  const resetTimeline = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsAutoPlaying(false)
  }

  const goToStep = (step: number) => {
    if (!isAutoPlaying) {
      setCurrentStep(step)
      setCompletedSteps(Array.from({ length: step }, (_, i) => i))
    }
  }

  const nextStep = () => {
    if (currentStep < timelineSteps.length - 1 && !isAutoPlaying) {
      const next = currentStep + 1
      setCurrentStep(next)
      setCompletedSteps(Array.from({ length: next }, (_, i) => i))
    }
  }

  const previousStep = () => {
    if (currentStep > 0 && !isAutoPlaying) {
      setCurrentStep(currentStep - 1)
      setCompletedSteps(completedSteps.filter(step => step < currentStep - 1))
    }
  }

  const handleImageError = (stepId: string) => {
    setImageErrors(prev => ({ ...prev, [stepId]: true }))
    setImageLoading(prev => ({ ...prev, [stepId]: false }))
  }

  const handleImageLoadStart = (stepId: string) => {
    setImageLoading(prev => ({ ...prev, [stepId]: true }))
  }

  const handleImageLoad = (stepId: string) => {
    setImageLoading(prev => ({ ...prev, [stepId]: false }))
  }

  const createFallbackGradient = (step: TimelineStep) => {
    // Extract colors from bgColor string like "from-slate-500/20 to-gray-500/20"
    const colors = step.bgColor.match(/(\w+-\d+)/g) || ['slate-500', 'gray-500']
    return `linear-gradient(135deg, rgb(var(--${colors[0]})) / 0.4, rgb(var(--${colors[1] || colors[0]})) / 0.2)`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/20">
      {/* Hero Section */}
      <motion.section 
        className="pt-20 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Aquascaping
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Timeline
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Follow the complete journey from empty tank to thriving aquatic ecosystem. 
            Experience each stage with interactive animations and expert guidance.
          </motion.p>
          
          {/* Controls */}
          <motion.div 
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={isAutoPlaying ? pausePlay : startAutoPlay}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-6 h-6" />
                  Pause Timeline
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Play Timeline
                </>
              )}
            </button>
            <button
              onClick={resetTimeline}
              className="glass-panel text-white px-6 py-4 rounded-full font-semibold hover:bg-white/20 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Progress */}
      <motion.section 
        className="py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${(currentStep / (timelineSteps.length - 1)) * 100}%` }}
              ></div>
              
              {/* Timeline Steps */}
              <div className="relative flex justify-between">
                {timelineSteps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    data-stage={index}
                    onClick={() => goToStep(index)}
                    className={`relative group z-10 ${index === currentStep ? 'z-20' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      completedSteps.includes(index) 
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30' 
                        : index === currentStep
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-white text-white scale-110 shadow-2xl shadow-cyan-500/50'
                        : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-600'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <div className={step.color}>
                          {step.icon}
                        </div>
                      )}
                    </div>
                    
                    {/* Step Label */}
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
                      <div className={`font-semibold text-sm ${
                        index === currentStep ? 'text-white' : 'text-slate-400'
                      }`}>
                        Step {index + 1}
                      </div>
                      <div className={`text-xs mt-1 whitespace-nowrap ${
                        index === currentStep ? 'text-cyan-300' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Step Information */}
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentStepData.bgColor} flex items-center justify-center`}>
                      <div className={currentStepData.color}>
                        {currentStepData.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-4xl text-white">
                        {currentStepData.title}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{currentStepData.duration}</span>
                        <span>•</span>
                        <span className={
                          currentStepData.difficulty === 'Easy' ? 'text-green-400' :
                          currentStepData.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                        }>{currentStepData.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    {currentStepData.description}
                  </p>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {currentStepData.detailedDescription}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={previousStep}
                    disabled={currentStep === 0 || isAutoPlaying}
                    className="px-6 py-3 bg-slate-700 text-white rounded-full font-semibold hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep === timelineSteps.length - 1 || isAutoPlaying}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Visual Representation */}
              <motion.div 
                key={`visual-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Tank Frame */}
                  <div className="absolute inset-0 border-8 border-slate-600 rounded-lg overflow-hidden shadow-2xl">
                    
                    {/* Stage Image Background */}
                    {!imageErrors[currentStepData.id] ? (
                      <motion.div
                        key={currentStepData.imageUrl}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Image
                          src={currentStepData.imageUrl}
                          alt={currentStepData.title}
                          fill
                          className="object-cover"
                          priority={currentStep <= 2}
                          onError={() => handleImageError(currentStepData.id)}
                          onLoadStart={() => handleImageLoadStart(currentStepData.id)}
                          onLoad={() => handleImageLoad(currentStepData.id)}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {imageLoading[currentStepData.id] && (
                          <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        className={`absolute inset-0 w-full h-full bg-gradient-to-br ${currentStepData.bgColor}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`text-6xl ${currentStepData.color}`}>
                            {currentStepData.icon}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-blue-800/40"></div>
                    
                    {/* Bubbles during cycling */}
                    {currentStep >= 5 && (
                      <div className="absolute inset-0">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-cyan-300/40 rounded-full"
                            style={{
                              left: `${20 + (i * 10)}%`,
                              bottom: '20%'
                            }}
                            animate={{
                              y: [0, -200],
                              opacity: [0, 0.8, 0],
                              scale: [0.5, 1, 0.8]
                            }}
                            transition={{
                              duration: 4,
                              delay: i * 0.5,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Step Progress Indicator */}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-semibold text-white">
                      Step {currentStep + 1} of {timelineSteps.length}
                    </div>
                  </div>
                </div>
                
                {/* Current Step Highlight */}
                <div className="mt-6 text-center">
                  <h3 className="font-bold text-2xl text-white mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-slate-300">
                    {currentStepData.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center glass-panel rounded-2xl p-8">
            <h2 className="font-display font-bold text-4xl text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Transform your vision into a living aquatic masterpiece. 
              Get personalized guidance and premium supplies.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Aquascape
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}