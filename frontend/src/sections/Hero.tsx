import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { VideoBackground } from '@/components/hero/VideoBackground';
import { HeroContent } from '@/components/hero/HeroContent';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.055]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 0.34]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], reduced ? [1, 1] : [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -54]);

  const scrollToNext = () => {
    const nextSection = document.getElementById("AboutUs");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      ref={heroRef}
      id="Hero" 
      className="relative min-h-svh w-full overflow-hidden bg-stone-950"
    >
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0 h-full w-full">
        <VideoBackground />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="pointer-events-none absolute inset-0 z-[1] bg-black" />
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative z-10">
        <HeroContent isLoaded={true} onScrollToNext={scrollToNext} />
      </motion.div>
    </section>
  );
}
