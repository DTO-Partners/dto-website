import { motion, AnimatePresence } from 'framer-motion';
import { NavbarMenu } from './NavbarMenu';
import { LanguageToggle } from './LanguageToggle';
import { NavItem } from '@/hooks/useNavbar';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  currentLang: string;
  onItemClick: () => void;
  onLanguageToggle: () => void;
}

export function MobileMenu({ 
  isOpen, 
  navItems, 
  currentLang, 
  onItemClick, 
  onLanguageToggle 
}: MobileMenuProps) {
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="md:hidden absolute top-full left-0 w-full bg-[#1a1a2e]/98 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/95 via-[#243046]/90 to-[#1a1a2e]/95" />
          
          <div className="relative z-10 px-6 py-6">
            {/* Navigation Items */}
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <NavbarMenu 
                navItems={navItems}
                isScrolled={true}
                className="flex-col space-y-2"
                onItemClick={onItemClick}
              />
            </motion.div>
            
            {/* Language Toggle Section */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between pt-4 border-t border-white/10"
            >
              <span className="text-white/70 text-sm">Language / Język</span>
              <LanguageToggle 
                currentLang={currentLang}
                onLanguageChange={onLanguageToggle}
                isScrolled={true}
              />
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div
              variants={itemVariants}
              className="mt-6 pt-4 border-t border-white/5"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#daa520] rounded-full" />
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <div className="w-2 h-2 bg-[#daa520] rounded-full" />
              </div>
            </motion.div>
          </div>
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
