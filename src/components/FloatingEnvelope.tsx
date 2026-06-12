import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X } from 'lucide-react';
import { Message } from '../types';

interface FloatingEnvelopeProps {
  message: Message;
}

export const FloatingEnvelope: React.FC<FloatingEnvelopeProps> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Random starting position and animation parameters
  const [initialX] = useState(() => Math.random() * 80 + 10); // 10% to 90%
  const [initialY] = useState(() => Math.random() * 60 + 20); // 20% to 80%
  const [duration] = useState(() => Math.random() * 20 + 20); // 20s to 40s
  const [delay] = useState(() => Math.random() * 5);

  const isYusuf = message.sender === 'Yusuf';
  const themeColor = isYusuf ? '#A2D2FF' : '#FFC2D1'; // Baby Blue vs Soft Pink
  const glowColor = isYusuf ? 'rgba(162, 210, 255, 0.2)' : 'rgba(255, 194, 209, 0.2)';
  const glowHoverColor = isYusuf ? 'rgba(162, 210, 255, 0.4)' : 'rgba(255, 194, 209, 0.4)';

  // Random animation path
  const [floatPath] = useState(() => {
    const points = 5;
    return {
      x: Array.from({ length: points }, () => (Math.random() - 0.5) * 400),
      y: Array.from({ length: points }, () => (Math.random() - 0.5) * 400),
      rotate: Array.from({ length: points }, () => (Math.random() - 0.5) * 40)
    };
  });

  return (
    <>
      <motion.div
        initial={{ 
          left: `${initialX}%`, 
          top: `${initialY}%`, 
          opacity: 0, 
          scale: 0 
        }}
        animate={{ 
          x: [...floatPath.x, 0],
          y: [...floatPath.y, 0],
          rotate: [...floatPath.rotate, 0],
          opacity: 1,
          scale: 1,
        }}
        transition={{ 
          duration: duration,
          delay: delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        whileHover={{ 
          scale: 1.2, 
          zIndex: 100,
          transition: { duration: 0.2 }
        }}
        onClick={() => setIsOpen(true)}
        className="fixed z-50 cursor-pointer group"
      >
        <div className="relative">
          {/* Animated Glow Wrapper */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute -inset-8 rounded-full blur-2xl transition-colors duration-500`} 
            style={{ backgroundColor: themeColor }} 
          />
          
          <div className="relative bg-white p-5 rounded-2xl shadow-2xl border-2 transition-all duration-300"
               style={{ 
                 borderColor: `${themeColor}40`,
                 color: themeColor
               }}>
            <Mail size={32} className="stroke-[1.5px]" />
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isYusuf ? 'bg-blue-400' : 'bg-pink-400'}`} />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: themeColor }} />
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="text-gray-400" />
              </button>

              <div className="p-10 md:p-14 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                    <Mail size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                      {message.sender}'den Bir Mesaj
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">
                      {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString('tr-TR') : 'Şimdi'}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-10 -left-6 text-8xl font-serif italic select-none opacity-5"
                       style={{ color: themeColor }}>"</div>
                  <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-[#1e293b] relative z-10">
                    {message.content}
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-50 flex justify-end">
                   <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: themeColor }}>Sevgilerle,</p>
                      <p className="font-serif italic text-2xl text-[#1e293b] mt-1">{message.sender}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};
