import { motion } from 'motion/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const eventDetails = [
  {
    icon: Calendar,
    title: 'Date',
    info: '19 December 2025',
  },
  {
    icon: Clock,
    title: 'Time',
    info: '4:30 PM onwards',
  },
  {
    icon: MapPin,
    title: 'Location',
    info: 'Bengaluru',
  },
];

export function EventDetails() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-white via-blue-50/50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-10 right-10 text-8xl opacity-5">💍</div>
      <div className="absolute bottom-10 left-10 text-8xl opacity-5">💐</div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-5xl inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎀
          </motion.span>
          <h2 className="text-blue-700">
            Event Details
          </h2>
          <p className="text-blue-600 mt-2 italic">Mark your calendars for this special day!</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {eventDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group border-2 border-blue-100"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -12, scale: 1.05 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <detail.icon className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-center text-blue-900 mb-3">
                {detail.title}
              </h3>
              <p className="text-center text-blue-700 text-lg">
                {detail.info}
              </p>
              
              {/* Decorative dots */}
              <div className="flex justify-center gap-1 mt-4">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Celebration message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-blue-600 text-lg flex items-center justify-center gap-2">
            <span>💙</span>
            <span>We can't wait to celebrate with you!</span>
            <span>💙</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}