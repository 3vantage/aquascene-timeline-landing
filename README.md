# Aquascene Timeline Landing Page

An immersive, animated landing page showcasing the evolution of aquatic ecosystems through advanced animations and interactive elements.

## Features

### 🌊 Advanced Animations
- **Liquid Morphing Effects**: Dynamic SVG path animations that simulate water movement
- **Particle Systems**: Water bubbles, floating debris, and organic particles
- **Plant Growth**: Animated SVG paths showing plant development with swaying effects
- **Fish Swimming**: Complex fish animations with schooling behavior and bubble trails
- **Ecosystem Maturation**: Complete aquarium simulation with all elements combined

### 🎯 Interactive Elements
- **Draggable Timeline Scrubber**: Navigate through different stages by dragging
- **Hover Effects**: Rich hover animations that reveal additional information
- **Click to Expand**: Detailed views with smooth transitions
- **Smooth Scroll Snapping**: Automatic snapping between timeline sections

### ✨ Micro-Interactions
- **Magnetic Cursor**: Custom cursor with particle trails and magnetic attraction
- **Ripple Effects**: Click animations with particle bursts
- **Glow Effects**: Dynamic lighting on active sections
- **Scroll-Triggered Animations**: GSAP-powered entrance animations

### 📱 Performance Optimized
- **Mobile-First**: Responsive design optimized for all devices
- **Performant Animations**: Hardware-accelerated animations using Framer Motion and GSAP
- **Lazy Loading**: Components load progressively for optimal performance

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Framer Motion** for smooth React animations
- **GSAP** for complex timeline animations
- **Tailwind CSS** for styling with custom animations
- **Three.js** ready for 3D elements (optional)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd aquascene-timeline-landing
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── animations/          # Animation components
│   │   ├── LiquidMorph.tsx     # Liquid morphing effects
│   │   ├── BubbleAnimation.tsx  # Water bubble system
│   │   ├── PlantGrowth.tsx     # Plant growing animations
│   │   ├── FishAnimation.tsx   # Fish swimming behavior
│   │   └── EcosystemAnimation.tsx # Complete ecosystem
│   ├── effects/             # Micro-interaction effects
│   │   └── RippleEffect.tsx    # Click ripple animations
│   ├── MagneticCursor.tsx   # Custom magnetic cursor
│   ├── ParticleSystem.tsx   # Background particle system
│   ├── ProgressIndicator.tsx # Timeline progress display
│   ├── TimelineSection.tsx  # Main timeline component
│   ├── TimelineStage.tsx    # Individual stage component
│   └── TimelineScrubber.tsx # Interactive timeline scrubber
├── hooks/
│   └── useScrollProgress.ts # Scroll position tracking
├── utils/
│   └── gsapConfig.ts       # GSAP configuration and helpers
├── types/
│   └── index.ts           # TypeScript type definitions
├── styles/
│   └── globals.css        # Global styles and Tailwind config
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## Timeline Stages

The application showcases 5 distinct stages of aquarium development:

1. **Tank Setup** 🏗️ - Foundation preparation with substrate and hardscape
2. **Flooding** 💧 - Water introduction with bubble animations
3. **Plant Growth** 🌱 - Vegetation establishment with growing animations
4. **Fish Introduction** 🐟 - Adding aquatic life with swimming behaviors
5. **Ecosystem Maturation** 🌿 - Fully balanced, thriving aquatic environment

## Customization

### Adding New Animations
1. Create a new component in `src/components/animations/`
2. Implement the animation logic using Framer Motion or GSAP
3. Add the component to `TimelineStage.tsx`

### Modifying Timeline Data
Update the `timelineData` array in `TimelineSection.tsx` to customize stages, descriptions, and animation types.

### Styling
- Global styles: `src/styles/globals.css`
- Tailwind config: `tailwind.config.js`
- Custom animations are defined in the Tailwind config

## Performance Tips

1. **Mobile Optimization**: The app automatically reduces particle count on mobile devices
2. **Animation Performance**: All animations use `transform` and `opacity` for optimal performance
3. **Memory Management**: Animations are cleaned up when components unmount
4. **Scroll Performance**: Uses `requestAnimationFrame` for smooth scroll tracking

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-animation`)
3. Commit your changes (`git commit -m 'Add amazing animation'`)
4. Push to the branch (`git push origin feature/amazing-animation`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own creations!

## Acknowledgments

- Inspired by the beauty of aquascaping and aquatic ecosystems
- Animation techniques influenced by modern web design trends
- Built with love for the aquarium hobby community

---

Made with 💙 for aquarium enthusiasts everywhere