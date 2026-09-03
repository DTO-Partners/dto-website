// src/components/ui/accordion.tsx
import React, { useState, ReactNode, ReactElement, cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";

interface AccordionProps {
  type?: "single" | "multiple";
  children: ReactNode;
  className?: string;
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  openItems?: string[];
  handleToggle?: (value: string) => void;
}

interface AccordionTriggerProps {
  value: string;
  openItems?: string[];
  handleToggle?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface AccordionContentProps {
  value: string;
  openItems?: string[];
  children: ReactNode;
}

export function Accordion({ type = "single", children, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    console.log("Toggling accordion item:", value, "Current open items:", openItems);
    if (type === "multiple") {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setOpenItems((prev) => (prev[0] === value ? [] : [value]));
    }
  };

  // Pass state and handlers to children
  return (
    <motion.div 
      className={`w-full space-y-4 ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {React.Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<Partial<AccordionItemProps>>, { 
              openItems, 
              handleToggle,
              key: `accordion-item-${index}`
            })
          : child
      )}
    </motion.div>
  );
}

export function AccordionItem({ value, children, openItems, handleToggle }: AccordionItemProps) {
  const isOpen = openItems?.includes(value);
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-white to-[#fdf6e3] border-2 border-[#e5e5e5] hover:border-[#daa520]/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgba(218, 165, 32, 0.1)"
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-[#daa520]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-3 left-3 w-6 h-6 bg-gradient-to-tl from-[#daa520]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{
          opacity: isOpen ? 1 : 0,
          background: isOpen 
            ? "linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.1), transparent)"
            : "transparent"
        }}
        transition={{ duration: 0.3 }}
      />
      
      {React.Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<Partial<AccordionTriggerProps & AccordionContentProps>>, { value, openItems, handleToggle })
          : child
      )}
    </motion.div>
  );
}

export function AccordionTrigger({ value, openItems, handleToggle, children, className }: AccordionTriggerProps) {
  const isOpen = openItems?.includes(value);
  
  return (
    <motion.button
      className={`w-full text-left flex items-center justify-between gap-2 p-6 font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#daa520]/20 focus:ring-offset-2 rounded-t-2xl group/trigger relative overflow-hidden ${className ?? ""}`}
      aria-expanded={isOpen}
      type="button"
      onClick={() => {
        console.log("AccordionTrigger clicked:", value, handleToggle);
        handleToggle?.(value);
      }}
      whileHover={{
        backgroundColor: "rgba(255, 247, 212, 0.3)"
      }}
      animate={{
        backgroundColor: isOpen 
          ? "rgba(255, 247, 212, 0.4)" 
          : "transparent"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background highlight */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#fff7d4]/0 via-[#daa520]/5 to-[#fff7d4]/0"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 flex items-center justify-between w-full">
        {children}
      </div>
    </motion.button>
  );
}

export function AccordionContent({ value, openItems, children }: AccordionContentProps) {
  const isOpen = openItems?.includes(value);
  
  return (
    <motion.div
      initial={false}
      animate={{ 
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.04, 0.62, 0.23, 0.98],
        opacity: { duration: 0.25, delay: isOpen ? 0.1 : 0 }
      }}
      className="overflow-hidden"
    >
      <motion.div 
        className="relative"
        initial={false}
        animate={{
          y: isOpen ? 0 : -20
        }}
        transition={{ 
          duration: 0.3, 
          delay: isOpen ? 0.2 : 0,
          ease: "easeOut"
        }}
      >
        {/* Decorative top border */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#daa520]/30 to-transparent mx-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isOpen ? 0.1 : 0 }}
        />
        
        <div className="px-6 pb-6 pt-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#fff7d4]/10 to-transparent opacity-50 rounded-b-2xl" />
          
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.95
            }}
            transition={{ 
              duration: 0.3, 
              delay: isOpen ? 0.25 : 0,
              ease: "easeOut"
            }}
          >
            {isOpen && children}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
