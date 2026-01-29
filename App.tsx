import React, { useState, useEffect, useMemo } from 'react';
import { WelcomeForm } from './components/WelcomeForm';
import { CardAnimation } from './components/CardAnimation';
import { ResultCard } from './components/ResultCard';
import { UserData, Card, AppStep } from './types';
import { drawCard, markAsPlayed, submitToGoogleSheet } from './services/dataService';

// Component for twinkling stars background
const StarBackground = () => {
  const stars = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() < 0.2 ? '3px' : Math.random() < 0.5 ? '2px' : '1px', // Variation in size
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 3}s`, // 3-6s cycle
      opacity: Math.random() * 0.5 + 0.3 
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.4); box-shadow: 0 0 5px rgba(255, 255, 255, 0.6); }
        }
        .star-twinkle {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
};

// Component for drifting golden sparkles/stardust
const SparkleEffect = () => {
  const sparkles = useMemo(() => {
    return [...Array(35)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.3 ? '4px' : Math.random() < 0.6 ? '3px' : '2px', // Slightly larger for visibility
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 15 + 15}s`, // Slow drift 15-30s
      startOpacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <style>{`
        @keyframes magical-drift {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: var(--opacity); }
          50% { transform: translate(20px, -80px) rotate(45deg); opacity: var(--opacity); }
          100% { transform: translate(-20px, -180px) rotate(90deg); opacity: 0; }
        }
        .sparkle-dust {
          position: absolute;
          background-color: #fbbf24; /* Amber-400 */
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.6), 0 0 3px rgba(255, 255, 255, 0.8); /* Golden glow with white core */
          animation-name: magical-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle-dust"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
            '--opacity': sparkle.startOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<AppStep>('FORM');
  const [user, setUser] = useState<UserData | null>(null);
  const [card, setCard] = useState<Card | null>(null);

  // Audio refs
  const shuffleSound = React.useRef<HTMLAudioElement | null>(null);
  const revealSound = React.useRef<HTMLAudioElement | null>(null);
  const signalSound = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio (using generic open source sounds for demo)
    shuffleSound.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_34d1933c09.mp3?filename=magic-spell-6005.mp3'); // Magic sound
    revealSound.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=success-1-6297.mp3'); // Tada sound
    signalSound.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=atmosphere-sound-11394.mp3'); // Cosmic signal sound
  }, []);

  const handleFormSubmit = (data: UserData) => {
    setUser(data);
    setStep('SHUFFLING');
    
    // Play sound
    if (shuffleSound.current) {
        shuffleSound.current.volume = 0.5;
        shuffleSound.current.play().catch(e => console.log("Audio play failed interaction required", e));
    }

    if (signalSound.current) {
        signalSound.current.volume = 0.4;
        signalSound.current.loop = true;
        signalSound.current.play().catch(e => console.log("Signal audio play failed", e));
    }

    // Simulate animation delay
    setTimeout(() => {
      // Stop signal sound
      if (signalSound.current) {
          signalSound.current.pause();
          signalSound.current.currentTime = 0;
      }

      const drawnCard = drawCard();
      setCard(drawnCard);
      
      // Save data
      markAsPlayed(data.phoneNumber, drawnCard.id);
      submitToGoogleSheet(data, drawnCard);

      setStep('RESULT');
      
      // Note: We don't play reveal sound yet, we wait for user to flip the card in ResultCard

    }, 3500); // 3.5s animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex flex-col relative overflow-hidden text-white">
      {/* Background decorations - Mystical Stars/Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600 blur-[120px] opacity-20 pointer-events-none z-0"></div>
      
      {/* Stars dust effect (Static Texture) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none z-0"></div>

      {/* Animated Stars */}
      <StarBackground />
      
      {/* Animated Golden Sparkles */}
      <SparkleEffect />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 w-full">
        {step === 'FORM' && (
          <WelcomeForm onSubmit={handleFormSubmit} />
        )}

        {step === 'SHUFFLING' && (
          <CardAnimation />
        )}

        {step === 'RESULT' && card && user && (
          <ResultCard card={card} user={user} />
        )}
      </main>

      <footer className="w-full text-center p-6 text-indigo-300 text-xs relative z-20 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-3 font-semibold uppercase tracking-wider text-[10px] md:text-xs">
            <a href="https://babyboss.com.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors whitespace-nowrap relative group">
                Trang chủ
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                    babyboss.com.vn
                </span>
            </a>
            <span className="hidden sm:inline opacity-30">|</span>
            <a href="https://kinhdoanhgelato.babyboss.com.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors whitespace-nowrap relative group">
                Kinh doanh kem Ý Gelato
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                    kinhdoanhgelato.babyboss.com.vn
                </span>
            </a>
            <span className="hidden sm:inline opacity-30">|</span>
            <a href="https://dichvutiec.gelato.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors whitespace-nowrap relative group">
                Tổ chức tiệc
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                    dichvutiec.gelato.vn
                </span>
            </a>
            <span className="hidden sm:inline opacity-30">|</span>
            <a href="tel:1900998880" className="hover:text-pink-400 transition-colors whitespace-nowrap flex items-center gap-1 relative group">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               Hotline: 1900 9988 80
               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                    Gọi: 1900 9988 80
                </span>
            </a>
        </div>
         <p className="opacity-50 font-light">© 2026 Baby Boss JSC., All rights reserved.</p>
      </footer>
    </div>
  );
}