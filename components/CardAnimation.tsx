import React from 'react';

export const CardAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden perspective-1000">
      
      {/* --- BACKGROUND NEBULA EFFECTS --- */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
         <div className="w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse-slow"></div>
         <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[80px] animate-spin-slow-reverse"></div>
      </div>

      {/* --- CENTRAL MAGIC SYSTEM --- */}
      <div className="relative flex items-center justify-center transform-style-3d">
          
          {/* Layer 1: Expanding Signal Waves (Ripples) */}
          {[...Array(3)].map((_, i) => (
             <div 
                key={`ripple-${i}`}
                className="absolute border border-indigo-400/30 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                style={{
                    width: '100px',
                    height: '100px',
                    animation: `ripple-expand 4s linear infinite ${i * 1.3}s`
                }}
             />
          ))}

          {/* Layer 2: Outer Runic Circle (Dashed & Glowing) */}
          <div className="absolute w-[340px] h-[340px] rounded-full border border-white/10 animate-spin-slow flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-t border-b border-l border-purple-500/50 opacity-50 blur-[1px]"></div>
             <div className="absolute w-full h-full rounded-full border-[2px] border-dashed border-indigo-300/20"></div>
             {/* Glowing Orbs on Ring */}
             <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] blur-[1px] transform -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.8)] blur-[1px] transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Layer 3: Middle Energy Ring (Conic Gradient) */}
          <div className="absolute w-[260px] h-[260px] rounded-full animate-spin-reverse-medium opacity-70">
              <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,#a855f7_360deg)] opacity-30 blur-md"></div>
          </div>

          {/* Layer 4: Inner High-Speed Ring */}
          <div className="absolute w-[200px] h-[200px] rounded-full border-[1px] border-cyan-500/30 animate-spin-fast shadow-[0_0_20px_rgba(6,182,212,0.2)]">
               <div className="absolute top-1/2 right-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Layer 5: The "Eye" / Portal Core */}
          <div className="relative w-32 h-32 rounded-full flex items-center justify-center z-20">
             {/* Deep Black Hole */}
             <div className="absolute inset-0 bg-black rounded-full border border-purple-500/50 shadow-[inset_0_0_40px_rgba(147,51,234,0.8)]"></div>
             {/* Core Glow */}
             <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-pulse-fast"></div>
             {/* Mystic Symbol */}
             <span className="relative text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-float z-30">
                🔮
             </span>
             {/* Glitch Overlay */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-transparent animate-scan"></div>
          </div>

          {/* Layer 6: Orbiting Cards (The Vortex) */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`card-${i}`}
              className="absolute w-10 h-16 bg-gradient-to-b from-cyan-900/60 to-purple-900/60 border border-white/40 rounded shadow-[0_0_15px_rgba(139,92,246,0.6)] backdrop-blur-md"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: 'center center',
                animation: `orbit-mystic 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite -${i * 0.4}s`,
                zIndex: 10
              }}
            >
                {/* Back of card pattern detail */}
                <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            </div>
          ))}
      </div>
      
      {/* --- TEXT & STATUS --- */}
      <div className="absolute bottom-16 w-full text-center z-30">
        <div className="inline-block relative">
            <div className="absolute inset-0 bg-purple-600 blur-xl opacity-40 animate-pulse"></div>
            <div className="relative px-8 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
                </span>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 text-lg font-black tracking-[0.2em] uppercase animate-shimmer">
                  ĐANG KẾT NỐI VŨ TRỤ
                </p>
            </div>
        </div>
        
        <div className="mt-4 space-y-1">
            <p className="text-[10px] text-cyan-300/80 font-mono tracking-widest animate-pulse">
                SCANNING SOUL FREQUENCY...
            </p>
             <p className="text-xs text-indigo-200/60 italic">
               (Vui lòng chờ tín hiệu từ các vì sao)
            </p>
        </div>
      </div>

      <style>{`
        /* ORBIT VORTEX */
        @keyframes orbit-mystic {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(160px) rotate(0deg) scale(1); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(100px) rotate(-180deg) scale(0.8); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(20px) rotate(-360deg) scale(0); opacity: 0; }
        }

        /* RIPPLE EXPANSION */
        @keyframes ripple-expand {
            0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
            100% { transform: scale(4); opacity: 0; border-width: 0px; }
        }

        /* SPINS */
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 20s linear infinite reverse; }
        .animate-spin-reverse-medium { animation: spin 8s linear infinite reverse; }
        .animate-spin-fast { animation: spin 3s linear infinite; }

        /* PULSES */
        @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-glow 1.5s ease-in-out infinite; }

        /* FLOAT */
        @keyframes float-mystic {
            0%, 100% { transform: translateY(0px) scale(1); filter: brightness(1); }
            50% { transform: translateY(-5px) scale(1.1); filter: brightness(1.3); }
        }
        .animate-float { animation: float-mystic 3s ease-in-out infinite; }

        /* SCAN LINE */
        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan { animation: scan 2s linear infinite; }

        /* TEXT SHIMMER */
        @keyframes text-shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        .animate-shimmer {
            background-size: 200% auto;
            animation: text-shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};