import { motion, AnimatePresence } from "motion/react";
import { Flower, Wind, Heart, Star, Bug, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import bgPattern from "./assets/images/floral_background_pattern_1780927265149.png";
import { AdminPanel } from "./components/AdminPanel";
import { FloatingEnvelope } from "./components/FloatingEnvelope";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Message } from "./types";

const Petal: React.FC<{ id: number }> = ({ id }) => {
  const [startPos] = useState({ 
    x: Math.random() * 100, 
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 18,
    size: 10 + Math.random() * 30,
    color: Math.random() > 0.5 ? '#A2D2FF' : '#E8A598'
  });

  return (
    <motion.div
      initial={{ y: -100, x: `${startPos.x}vw`, rotate: 0, opacity: 0 }}
      animate={{ 
        y: '110vh',
        x: [`${startPos.x}vw`, `${startPos.x + (Math.random() * 30 - 15)}vw`, `${startPos.x}vw`],
        rotate: [0, 360, 1080],
        opacity: [0, 0.8, 0.8, 0]
      }}
      transition={{ 
        duration: startPos.duration, 
        repeat: Infinity, 
        delay: startPos.delay,
        ease: "linear"
      }}
      className="fixed pointer-events-none z-10"
      style={{ top: 0, left: 0, color: startPos.color }}
    >
      <Flower size={startPos.size} className="fill-current opacity-40" />
    </motion.div>
  );
};

export default function App() {
  const [showLove, setShowLove] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const petals = Array.from({ length: 25 }, (_, i) => i);

  useEffect(() => {
    // Mesajlar için basit bir dinleyici kuruyoruz, sıralamayı JS tarafında yapacağız 
    // Bu sayede Firestore indeks hatalarından kaçınmış oluruz.
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as Message[];
      
      // Tarihe göre azalan sırada sırala (yeni mesajlar en üstte/önce)
      const sortedMsgs = msgs.sort((a, b) => {
        const timeA = b.createdAt?.toMillis?.() || Date.now();
        const timeB = a.createdAt?.toMillis?.() || Date.now();
        return timeA - timeB;
      });
      
      setMessages(sortedMsgs);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      handleFirestoreError(error, OperationType.GET, "messages");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7fbff] text-[#243342] font-sans selection:bg-[#A2D2FF] selection:text-white overflow-hidden relative">
      {/* Background Decorative Elements - Baby Blue Tones */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-50 rounded-full opacity-60 blur-3xl" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-sky-50 rounded-full opacity-40 blur-3xl" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-white rounded-full opacity-60 blur-[100px]" />
      
      {/* Background Pattern Layer */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0 bg-repeat bg-center"
        style={{ backgroundImage: `url(${bgPattern})`, backgroundSize: '400px' }}
      />

      {/* Falling Petals */}
      {petals.map((id) => (
        <Petal key={id} id={id} />
      ))}

      {/* Floating Envelopes */}
      {messages.map((msg) => (
        <FloatingEnvelope key={msg.id} message={msg} />
      ))}

      {/* Header - Clean/Minimal */}
      <header className="relative z-30 flex justify-between items-center p-8 md:p-12">
        <button 
          onClick={() => setShowAdmin(true)}
          className="p-3 opacity-10 hover:opacity-100 transition-opacity text-blue-900 cursor-pointer"
        >
          <Settings size={20} />
        </button>
        <div className="text-xs uppercase tracking-[0.3em] opacity-40 italic font-serif">
          Ömrümün En Güzel Mevsimi
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 min-h-[calc(100vh-160px)] flex flex-col lg:flex-row px-6 md:px-16 lg:px-24 gap-8 md:gap-16 pb-24 items-center lg:items-stretch justify-center lg:justify-start">
        
        {/* Left Column: Big Heading */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -top-12 -left-8 md:-top-16 md:-left-12 text-[100px] md:text-[180px] opacity-10 select-none font-serif italic text-blue-400">E</div>
            <h1 className="text-[100px] md:text-[220px] lg:text-[260px] leading-[0.7] tracking-tighter text-[#1e293b] drop-shadow-sm font-serif">
              Ece
            </h1>
            <div className="mt-8 md:mt-12 flex flex-col items-center lg:items-start gap-4">
               <div className="w-16 md:w-24 h-[2px] bg-[#A2D2FF]" />
               <p className="text-lg md:text-2xl italic font-light font-serif text-[#334155] leading-relaxed max-w-[280px] md:max-w-none">
                 Gönlümde açan en nadide <span className="text-[#8ebce6] font-bold">çiçek</span>, <br />
                 Hayatıma renk katan eşsiz bir <span className="text-[#8ebce6] font-bold">melodi</span>.
               </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 md:mt-20"
          >
            <button 
              onClick={() => setShowLove(!showLove)}
              className="group relative flex items-center gap-4 md:gap-8 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            >
              <div className="relative">
                <div className="absolute -inset-4 md:-inset-6 bg-[#A2D2FF]/30 rounded-full blur-xl md:blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative bg-[#243342] text-white p-5 md:p-8 rounded-full shadow-2xl transition-all duration-500 group-hover:rotate-[360deg]">
                   <Flower size={28} className="md:w-10 md:h-10 stroke-[1px]" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                 <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold opacity-30 text-[#243342]">Güzelliği Keşfet 🌸</span>
                 <span className="font-serif italic text-xl md:text-2xl text-[#1e293b] group-hover:translate-x-3 transition-transform duration-500">Kalbine Dokun ✨</span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="w-full lg:w-1/2 flex items-center pt-8 lg:pt-0">
          <AnimatePresence mode="wait">
            {!showLove ? (
               <motion.div
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-6"
               >
                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-blue-100 flex items-center justify-center text-blue-200">
                    <Star size={32} className="md:w-10 md:h-10 animate-pulse" />
                 </div>
                 <p className="font-serif italic text-2xl md:text-4xl text-[#243342]/10 leading-relaxed max-w-[260px] md:max-w-sm">
                   "Gözlerine her baktığımda, içimde yeniden çiçekler açıyor..."
                 </p>
               </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:space-y-8 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/60 backdrop-blur-xl border border-blue-50 p-6 md:p-10 rounded-[35px] md:rounded-[50px] shadow-sm"
                  >
                    <span className="text-3xl md:text-4xl block mb-4 md:mb-6">🦋</span>
                    <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-blue-400 mb-2 md:mb-3">Gülüşün</h3>
                    <p className="font-serif text-lg md:text-xl leading-relaxed text-[#1e293b]">Sabah güneşinin ilk ışıkları gibi içimi ısıtıyor, tüm dertleri unutturuyor.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-[#243342] text-white p-6 md:p-10 rounded-[35px] md:rounded-[50px] shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
                    <span className="text-3xl md:text-4xl block mb-4 md:mb-6">🌊</span>
                    <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-blue-300 opacity-60 mb-2 md:mb-3">Varlığın</h3>
                    <p className="font-serif italic text-xl md:text-2xl leading-snug">Fırtınalı bir denizde bulduğum en güvenli liman, en huzurlu sığınağım.</p>
                  </motion.div>
                </div>
                
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="bg-[#A2D2FF]/10 backdrop-blur-md border-l-4 md:border-l-8 border-[#A2D2FF] p-6 md:p-12 rounded-r-[30px] md:rounded-r-[40px] relative"
                >
                   <div className="absolute top-2 right-4 md:top-4 md:right-6 text-blue-200/50 italic font-serif text-4xl md:text-6xl select-none">"</div>
                   <p className="font-serif text-xl md:text-3xl italic leading-relaxed text-[#1e293b] pr-4 md:pr-8">
                     "Seninle geçen her saniye, kalbime yazılmış en güzel şiir. Varlığın, bu hayatta başıma gelen en eşsiz mucize."
                   </p>
                </motion.div>

                <div className="flex gap-8 md:gap-12 px-4 opacity-40 justify-center lg:justify-start">
                  <div className="flex flex-col text-center lg:text-left">
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Durum</span>
                    <span className="text-xs md:text-sm font-sans">Aşkla Dolu</span>
                  </div>
                  <div className="flex flex-col text-center lg:text-left">
                    <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold">Mod</span>
                    <span className="text-xs md:text-sm font-sans">Bahar Gibi Taze</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none z-30">
        <div className="opacity-10 flex gap-6 items-center">
           <div className="w-12 h-[1px] bg-blue-900" />
           <Flower size={40} className="rotate-12 text-blue-400" />
           <div className="w-6 h-6 border border-blue-400 rounded-full" />
        </div>
        <div className="text-[200px] lg:text-[280px] leading-none opacity-[0.04] select-none font-serif tracking-tighter pointer-events-none translate-y-1/3 text-blue-900">
          ECEM
        </div>
      </footer>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} messages={messages} />}
      </AnimatePresence>
    </div>
  );
}
