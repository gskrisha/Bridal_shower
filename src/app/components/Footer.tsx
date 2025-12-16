import { motion } from 'motion/react';
import Andrea from './img/Andrea.jpeg';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-16 px-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-5 left-10 text-4xl opacity-20">💙</div>
      <div className="absolute top-10 right-20 text-4xl opacity-20">✨</div>
      <div className="absolute bottom-5 left-20 text-4xl opacity-20">💍</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20">💐</div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-6xl mb-6"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💙
          </motion.div>
          
          <motion.p
            className="text-white text-2xl mb-3"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Made with love for{' '}
            <span className="font-['Dancing_Script'] text-3xl text-blue-200">
              Lamia Huda
            </span>{' '}
            💙
          </motion.p>
          
          <p className="text-blue-200 mb-6">
            The most beautiful bride-to-be
          </p>
          
          <div className="flex justify-center gap-3 mb-6">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👰
            </motion.span>
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              💍
            </motion.span>
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              💐
            </motion.span>
          </div>
          
          <p className="text-blue-300 text-sm">
            © 2025 · Bridal Shower Celebration · Bengaluru
          </p>
          
          <motion.div
            className="mt-8 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[...Array(7)].map((_, i) => (
              <motion.span
                key={i}
                className="text-blue-300 text-2xl"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ✨
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}