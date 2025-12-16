import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';

export function HeroSection() {
  const floatingDots = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  // Confetti elements
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 3,
    rotation: Math.random() * 360,
  }));

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Floating decorative dots */}
      {floatingDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
          }}
        />
      ))}

      {/* Confetti falling animation */}
      {confetti.map((item) => (
        <motion.div
          key={`confetti-${item.id}`}
          className="absolute text-2xl"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            rotate: [item.rotation, item.rotation + 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          {['💙', '💍', '✨', '💐', '🎀'][item.id % 5]}
        </motion.div>
      ))}

      {/* Abstract wave decoration */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#waveGradient)"
            animate={{ d: [
              "M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z",
              "M0,400 Q300,250 600,400 T1200,400 L1200,800 L0,800 Z",
              "M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z",
            ]}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Sparkles decoration */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-blue-500 fill-current" />
            <motion.div
              className="inline-block"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-7xl">👰</span>
            </motion.div>
            <Sparkles className="w-8 h-8 text-blue-500 fill-current" />
          </motion.div>

          <motion.h1
            className="mb-6 text-blue-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.span
              className="block"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Bridal Shower Celebration
            </motion.span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-3xl">💙</span>
            <p className="text-blue-800 text-xl">
              Celebrating our beautiful bride-to-be
            </p>
            <span className="text-3xl">💙</span>
          </motion.div>

          <motion.div
            className="mb-10 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* Glow effect behind name */}
            <motion.div
              className="absolute inset-0 blur-3xl bg-blue-400/30 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <h2 className="relative text-6xl md:text-8xl font-['Dancing_Script'] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 mb-3">
              Lamia Huda
            </h2>
            
            <motion.div
              className="flex justify-center gap-2 text-4xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>💍</span>
              <span>✨</span>
              <span>💐</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-3 text-blue-700 mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="flex items-center justify-center gap-2 flex-wrap text-lg">
              <span className="font-semibold text-blue-800">📅 19 December 2025</span>
              <span className="text-blue-400">•</span>
              <span className="font-semibold text-blue-800">⏰ 4:30 PM onwards</span>
              <span className="text-blue-400">•</span>
              <span className="font-semibold text-blue-800">📍 Bengaluru</span>
            </p>
            
            <motion.p
              className="text-blue-600 italic text-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Join us for a day filled with love, laughter, and joy!
            </motion.p>
          </motion.div>

          <motion.button
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transition-shadow text-lg relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative flex items-center gap-2">
              ✨ Celebrate With Us ✨
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToNext}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-blue-600 text-sm">Scroll Down</span>
          <ChevronDown className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>
    </section>
  );
}