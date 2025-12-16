import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Sparkles, Heart } from "lucide-react";
import Bride_Lamia from './img/Bride_Lamia.jpeg';

export function BrideSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Floating hearts animation
  const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 2,
  }));

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 bg-gradient-to-br from-blue-100 via-blue-50 to-white overflow-hidden"
    >
      {/* Floating hearts background */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-4xl opacity-20"
          style={{
            left: `${heart.x}%`,
            top: "10%",
          }}
          animate={{
            y: [0, -400],
            opacity: [0.2, 0.5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "easeInOut",
          }}
        >
          💙
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-blue-500 fill-current" />
            <span className="text-blue-600 uppercase tracking-widest text-sm">
              The Bride-To-Be
            </span>
            <Sparkles className="w-6 h-6 text-blue-500 fill-current" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-['Dancing_Script'] text-blue-700 mb-4">
            Lamia Huda
          </h2>

          <motion.p
            className="text-blue-600 text-lg max-w-2xl mx-auto italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            "The most beautiful bride, the kindest heart, and
            the brightest smile. Today we celebrate you!"
          </motion.p>
        </motion.div>

        {/* Bride Photo Container */}
        <motion.div
          className="relative max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Decorative rings */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.div
            className="absolute -inset-8 border-4 border-blue-300/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute -inset-12 border-4 border-blue-400/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Photo Frame */}
          <div className="relative rounded-full overflow-hidden border-8 border-white shadow-2xl aspect-square">
            <motion.img
              src={Bride_Lamia}
              alt="Lamia Huda - The Beautiful Bride"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />

            {/* Overlay glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
          </div>

          {/* Floating decorative elements around photo */}
          <motion.div
            className="absolute -top-6 -right-6 text-5xl"
            animate={{
              rotate: [0, 15, -15, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          ></motion.div>

          <motion.div
            className="absolute -bottom-6 -left-6 text-5xl"
            animate={{
              rotate: [0, -15, 15, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.5,
            }}
          >
            💐
          </motion.div>

          <motion.div
            className="absolute top-1/4 -left-12 text-4xl"
            animate={{
              x: [-5, 5, -5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>

          <motion.div
            className="absolute top-1/3 -right-12 text-4xl"
            animate={{
              x: [5, -5, 5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          >
            🎀
          </motion.div>
        </motion.div>

        {/* Decorative text below */}
        <motion.div
          className="text-center mt-12 space-y-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-5 h-5 text-blue-500 fill-current" />
            <p className="text-blue-700">
              Radiating love and happiness
            </p>
            <Heart className="w-5 h-5 text-blue-500 fill-current" />
          </div>

          <motion.div
            className="flex justify-center gap-2 text-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span>💙</span>
            <span>💍</span>
            <span>💙</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}