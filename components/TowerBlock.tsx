import React from 'react';
import { motion } from 'framer-motion';

interface TowerBlockProps {
  index: number;
  builderName: string;
  builderPhoto: string;
  isNew: boolean;
}

const TowerBlock: React.FC<TowerBlockProps> = ({ index, builderName, builderPhoto, isNew }) => {
  // Generate a distinct color based on index or name hash for visual variety
  const hue = (index * 137.5) % 360; 
  const backgroundColor = `hsl(${hue}, 70%, 60%)`;
  const borderColor = `hsl(${hue}, 70%, 40%)`;

  return (
    <motion.div
      layout
      initial={isNew ? { y: -100, opacity: 0, scale: 0.8 } : false}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ 
        x: Math.random() * 500 - 250, 
        y: Math.random() * 200 + 100, 
        rotate: Math.random() * 180 - 90, 
        opacity: 0 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-full h-16 md:h-20 flex items-center justify-center mb-1"
      style={{ zIndex: 1000 - index }} // Stack visually correct
    >
        {/* Block Design */}
        <div 
            className="w-3/4 h-full rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center px-4 relative overflow-hidden border-2"
            style={{ backgroundColor, borderColor }}
        >
            {/* Highlight Shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 pointer-events-none" />

            {/* Content */}
            <div className="flex items-center gap-3 w-full z-10">
                <div className="relative">
                     <img 
                        src={builderPhoto} 
                        alt={builderName} 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md bg-slate-800"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName)}&background=random`;
                        }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] px-1 rounded font-bold">
                        {index + 1}
                    </div>
                </div>
                <span className="font-bold text-white drop-shadow-md truncate font-pixel text-xs md:text-sm">
                    {builderName}
                </span>
            </div>
        </div>
    </motion.div>
  );
};

export default React.memo(TowerBlock);