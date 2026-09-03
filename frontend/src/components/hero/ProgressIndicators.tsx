import { motion } from 'framer-motion';

interface ProgressIndicatorsProps {
  slides: unknown[];
  current: number;
  setCurrent: (index: number) => void;
  intervalDuration?: number;
}

export function ProgressIndicators({ 
  slides, 
  current, 
  setCurrent, 
  intervalDuration = 4000 
}: ProgressIndicatorsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-12 h-1 rounded-full transition-all duration-300 progress-bar ${
              current === index ? 'bg-white' : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 + index * 0.1 }}
          >
            <motion.div
              className="w-full h-full bg-white rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: current === index ? 1 : 0 }}
              transition={{ duration: intervalDuration / 1000, ease: "linear" }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
