import { motion, useInView } from "framer-motion";
import { useRef } from 'react';
import { Heart } from 'lucide-react';
import Andrea from './img/Andrea.jpeg';
import Shalini from './img/Shalini.jpeg';
import Krisha from './img/Krisha.jpeg';

const hosts = [
  {
    name: 'J Andrea',
    photo: Andrea, // Use the imported variable, not a string path
  },
  {
    name: 'Krisha G S',
    photo: Krisha, // Use the imported variable
  },
  {
    name: 'Shalini G',
    photo: Shalini, // Use the imported variable
  },
];

export function HostsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10">🎉</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-10">🌸</div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-14 h-14 text-blue-500 fill-current mx-auto" />
          </motion.div>
          <h2 className="text-blue-700">
            Hosted With Love By
          </h2>
          <p className="text-blue-600 mt-3 italic">
            The amazing friends who made this celebration possible
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-16 mt-16">
          {hosts.map((host, index) => (
            <motion.div
              key={host.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative ring */}
                <motion.div
                  className="absolute -inset-3 border-4 border-blue-300 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
                  <img
                    src={host.photo} // This will use the imported image
                    alt={host.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for ${host.name}:`, host.photo);
                      // Fallback to a colored background with initials
                      e.currentTarget.style.display = 'none';
                      const container = e.currentTarget.parentElement;
                      if (container) {
                        const initials = host.name.split(' ').map(n => n[0]).join('');
                        container.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold">
                            ${initials}
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Overlay glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                </div>
                
                {/* Decorative heart */}
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                >
                  <Heart className="w-6 h-6 text-blue-600 fill-current" />
                </motion.div>
              </motion.div>
              
              <motion.h3
                className="text-blue-900 text-xl"
                whileHover={{ scale: 1.1 }}
              >
                {host.name}
              </motion.h3>
              
              {/* Decorative stars */}
              <motion.div
                className="flex gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.15 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-blue-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    ✨
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-blue-700 italic text-lg">
            "Thank you for making this celebration so special and memorable!"
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="text-2xl">💙</span>
            <span className="text-2xl">🎉</span>
            <span className="text-2xl">💙</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}