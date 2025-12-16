import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import Masonry from 'react-responsive-masonry';

import team1 from './img/team1.jpeg';
import team2 from './img/team2.jpeg';
import team3 from './img/team3.jpeg';
import team4 from './img/team4.jpeg';
import team5 from './img/team5.jpeg';
import team6 from './img/team6.jpeg';

const galleryImages = [
  { id: 1, url: team1, alt: 'Friends laughing together' },
  { id: 2, url: team2, alt: 'Celebration party' },
  { id: 3, url: team3, alt: 'Friends together' },
  { id: 4, url: team4, alt: 'Women friendship' },
  { id: 5, url: team5, alt: 'Joyful celebration' },
  { id: 6, url: team6, alt: 'Happy moments' },
];

export function PhotoGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">📸</div>
      <div className="absolute top-40 right-20 text-6xl opacity-10 animate-pulse delay-1000">💕</div>
      <div className="absolute bottom-20 right-40 text-6xl opacity-10 animate-pulse delay-2000">🎉</div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-5xl inline-block mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📸
          </motion.span>
          <h2 className="text-blue-700">
            Our Memories Together
          </h2>
        </motion.div>

        <motion.p
          className="text-center text-blue-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Moments of love, laughter & friendship 💙
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Masonry columnsCount={3} gutter="1rem" className="masonry-grid">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group border-4 border-blue-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <motion.img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-auto object-cover"
                  animate={{
                    scale: hoveredImage === image.id ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-blue-600/60 via-blue-400/30 to-transparent flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredImage === image.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ y: 20 }}
                    animate={{ y: hoveredImage === image.id ? 0 : 20 }}
                  >
                    <span className="text-white text-4xl">💙</span>
                    <span className="text-white font-medium">Beautiful Memories</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
        
        {/* Celebration message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <p className="text-blue-600 italic text-lg">
            Every picture tells a story of friendship and love ✨
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .masonry-grid {
            column-count: 2 !important;
          }
        }
        @media (max-width: 480px) {
          .masonry-grid {
            column-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}