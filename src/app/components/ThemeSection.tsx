import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const blueShades = [
  { name: 'Light Blue', color: '#DBEAFE', hex: '#DBEAFE' },
  { name: 'Sky Blue', color: '#93C5FD', hex: '#93C5FD' },
  { name: 'Blue', color: '#3B82F6', hex: '#3B82F6' },
  { name: 'Royal Blue', color: '#2563EB', hex: '#2563EB' },
  { name: 'Dark Blue', color: '#1E40AF', hex: '#1E40AF' },
];

export function ThemeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-10 left-20 text-7xl opacity-10">🎨</div>
      <div className="absolute bottom-20 right-20 text-7xl opacity-10">💎</div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-5xl inline-block mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            🎨
          </motion.span>
          <h2 className="text-blue-700">
            Theme
          </h2>
        </motion.div>

        <motion.p
          className="text-center text-blue-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-semibold">Bride's choice</span> — light or dark blue 💙
        </motion.p>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-blue-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {blueShades.map((shade, index) => (
              <motion.div
                key={shade.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full shadow-xl mb-3 border-4 border-white cursor-pointer relative"
                  style={{ backgroundColor: shade.color }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-2 rounded-full bg-white/30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <p className="text-sm text-blue-900 font-medium">{shade.name}</p>
              </motion.div>
            ))}
          </div>

          {/* Abstract flowing shapes */}
          <motion.div
            className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,100 Q200,50 400,100 T800,100"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M0,120 Q200,80 400,120 T800,120"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, delay: 1.2 }}
              />
              <motion.path
                d="M0,140 Q200,110 400,140 T800,140"
                fill="none"
                stroke="#DBEAFE"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, delay: 1.4 }}
              />
            </svg>
          </motion.div>
          
          <motion.p
            className="text-center mt-6 text-blue-700 italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            "Blue represents peace, harmony, and eternal love" 💙✨
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}