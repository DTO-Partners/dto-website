import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HeroContentProps {
  readonly isLoaded: boolean;
  readonly onScrollToNext: () => void;
}

export function HeroContent({ isLoaded, onScrollToNext }: HeroContentProps) {
  const { t } = useTranslation();

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 60 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center max-w-6xl mx-auto"
      >
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-block mb-8"
        >
          <div className="px-6 py-3 hero-backdrop-blur hero-glow border border-white/20 rounded-full">
            <span className="text-white/90 text-sm font-medium tracking-widest uppercase">
              {t("hero.badge")}
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-light text-white mb-8 tracking-tight leading-none hero-text-shadow"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {t("hero.title.first")}
          <motion.span 
            className="block font-bold hero-gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {t("hero.title.second")}
          </motion.span>
        </motion.h1>

        {/* Elegant Divider */}
        <motion.div 
          className="w-32 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-12 font-light leading-relaxed max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {t("hero.subtitle.main")}
          <br />
          <span className="text-white/70 text-lg">{t("hero.subtitle.tagline")}</span>
        </motion.p>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            onClick={onScrollToNext}
            className="group px-8 py-4 hero-backdrop-blur hero-glow border border-white/20 rounded-full text-white font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("hero.cta.button")}
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}