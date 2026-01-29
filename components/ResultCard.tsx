import React, { useState, useRef, useEffect } from 'react';
import { Card, CardGroup, UserData } from '../types';

interface ResultCardProps {
  card: Card;
  user: UserData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ card, user }) => {
  const [isFlipped, setIsFlipped] = useState(false); // false = Image Side, true = Text Side
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Audio refs
  const flipWhooshSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Sound: Card Flip Whoosh
    flipWhooshSound.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=success-1-6297.mp3'); 
    flipWhooshSound.current.volume = 0.4;
    
    // REMOVED AUTO DOWNLOAD LOGIC HERE
  }, []);

  // Helper for haptic feedback
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50); // Subtle 50ms vibration
    }
  };

  const handleCardClick = () => {
    triggerHaptic();
    // Toggle between Image and Text
    setIsFlipped(!isFlipped);
    
    // Play quiet flip sound
    if (flipWhooshSound.current) {
      flipWhooshSound.current.currentTime = 0;
      flipWhooshSound.current.play().catch(() => {});
    }
  };

  // --- DOWNLOAD IMAGE LOGIC ---
  const handleDownloadImage = async () => {
      triggerHaptic();
      setIsDownloading(true);
      try {
          // fetch the image as a blob
          const response = await fetch(card.imageUrl);
          const blob = await response.blob();
          
          // create a temporary link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // Set filename
          link.download = `BabyBoss_Tarot_${card.id}.png`;
          document.body.appendChild(link);
          
          // trigger click
          link.click();
          
          // cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      } catch (err) {
          console.error("Download failed", err);
          alert("Không thể tự động tải ảnh. Hãy chụp màn hình!");
      } finally {
          setIsDownloading(false);
      }
  };

  // --- SHARING LOGIC ---
  const caption = `✨ ${user.fullName} vừa rút được lá bài định mệnh 2026: "${card.name}" - ${card.title} tại Baby Boss Gelato! 🔮\n\n🍦 Vị kem bản mệnh: ${card.flavor}\n💬 Thông điệp vũ trụ: "${card.message}"\n\n👉 Bạn có tò mò vị kem định mệnh của mình là gì không? Thử ngay tại đây nhé! #BabyBossGelato #TarotViGiac`;
  
  const url = window.location.href;
  const fullShareText = `${caption}\n${url}`;

  // Helper: Copy & Redirect (Dành cho Zalo, TikTok, Insta)
  const handleCopyAndRedirect = async (platformName: string, redirectUrl: string) => {
    triggerHaptic();
    try {
      await navigator.clipboard.writeText(fullShareText);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);

      const confirm = window.confirm(
        `Đã sao chép nội dung!\nMở ${platformName} để dán và đăng bài ngay?`
      );
      if (confirm) {
        window.open(redirectUrl, '_blank');
      }
    } catch (err) {
      alert("Không thể sao chép tự động. Hãy chụp màn hình!");
    }
  };

  // Helper: Handle Instagram Story specifically
  const handleInstagramStory = async () => {
    triggerHaptic();
    try {
      await navigator.clipboard.writeText(fullShareText);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);

      const confirm = window.confirm(
        `Đã sao chép caption!\n\nBạn hãy dùng ảnh lá bài vừa lưu (hoặc chụp màn hình) để đăng Story và dán caption này vào nhé!`
      );
      if (confirm) {
        // Try to open Instagram Story Camera directly
        window.location.href = 'instagram://story-camera';
        
        // Fallback to web if app doesn't open
        setTimeout(() => {
            window.open('https://instagram.com', '_blank');
        }, 1000);
      }
    } catch (err) {
      alert("Không thể sao chép. Hãy chụp màn hình!");
    }
  };

  // 1. Native Share (Ưu tiên số 1 trên Mobile)
  const handleNativeShare = async () => {
    triggerHaptic();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Baby Boss Tarot',
          text: caption,
          url: url,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy Link
      try {
        await navigator.clipboard.writeText(fullShareText);
        alert("Đã sao chép liên kết! Bạn hãy dán vào Facebook/Zalo nhé.");
      } catch (e) {
         alert("Trình duyệt không hỗ trợ chia sẻ.");
      }
    }
  };

  // 2. Web Intents (FB/Threads)
  const handleFacebookShare = () => {
    triggerHaptic();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(caption)}`, '_blank');
  };
  const handleThreadsShare = () => {
    triggerHaptic();
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(caption + ' ' + url)}`, '_blank');
  };

  // --- STYLING LOGIC ---
  const isWinner = card.group === CardGroup.WINNER;
  
  // Style cho thẻ bài
  const borderClass = isWinner 
    ? 'border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.6)]' 
    : 'border-indigo-400 shadow-[0_0_30px_rgba(129,140,248,0.4)]'; 
  
  const bgGradient = isWinner
    ? 'bg-gradient-to-b from-yellow-900 via-black to-yellow-900'
    : 'bg-gradient-to-b from-indigo-950 via-black to-indigo-900';

  const titleColor = isWinner ? 'text-yellow-400' : 'text-indigo-300';

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center pb-20">
        
      {/* 3D CARD FLIP CONTAINER */}
      <div 
        className="relative w-full aspect-[2/3] max-h-[550px] cursor-pointer perspective-1000 mb-4 z-10"
        onClick={handleCardClick}
      >
        <div className={`w-full h-full relative transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* --- FRONT FACE (0 deg) --- */}
            <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden border-[3px] ${borderClass} bg-black`}>
                
                {/* Ribbon May Mắn (Strictly for Winner) */}
                {isWinner && (
                    <div className="absolute top-0 right-0 z-20 w-28 h-28 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 text-red-900 font-black text-xs py-1.5 w-32 text-center border-b-2 border-red-900 shadow-xl">
                            MAY MẮN
                        </div>
                        <div className="absolute top-4 right-10 text-white animate-pulse">✨</div>
                    </div>
                )}

                <div className="w-full h-full relative group">
                    <img 
                        src={card.imageUrl} 
                        alt={card.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Winner Shine Effect */}
                    {isWinner && (
                         <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-200/20 opacity-50 pointer-events-none"></div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>

                    {/* Top Title */}
                    <div className="absolute top-4 left-0 w-full text-center pointer-events-none">
                         <span className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">Baby Boss Tarot</span>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 inset-x-0 pb-6 pt-12 px-4 text-center pointer-events-none">
                        <div className="mb-2">
                             <h1 className={`text-2xl font-black uppercase ${titleColor} drop-shadow-lg leading-none mb-1`}>{card.name}</h1>
                             <p className="text-sm font-bold uppercase tracking-widest text-white/90">{card.title}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BACK FACE (180 deg) --- */}
            <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl border-[3px] ${borderClass} bg-[#120f1d]`}>
                 
                <div className={`w-full h-full flex flex-col ${bgGradient} p-6 overflow-y-auto scrollbar-hide relative`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
                        
                        {/* Winner Indicator on Text Side */}
                        {isWinner && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/50">
                                <span className="text-[10px] font-bold text-yellow-300 uppercase">May Mắn</span>
                                <span className="text-yellow-300 text-xs">✨</span>
                            </div>
                        )}
                        
                        <div className="text-center mb-6 relative z-10 mt-4">
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Lá bài của bạn</div>
                            <h2 className={`text-xl font-black uppercase leading-tight ${titleColor} mb-1`}>{card.name}</h2>
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{card.title}</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <h4 className="text-[10px] uppercase font-bold text-indigo-300 mb-2">💬 Thông điệp vũ trụ:</h4>
                                <p className="text-gray-100 italic text-sm leading-relaxed">"{card.message}"</p>
                            </div>
                            
                            <div className={`p-4 rounded-xl border ${isWinner ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-indigo-900/20 border-indigo-500/30'}`}>
                                <h4 className={`text-[10px] uppercase font-bold mb-2 ${isWinner ? 'text-yellow-400' : 'text-purple-300'}`}>
                                    {isWinner ? '🎁 QUÀ TẶNG:' : '⚡ LỜI KHUYÊN:'}
                                </h4>
                                <p className="text-white font-medium text-sm leading-relaxed">
                                    {card.advice}
                                </p>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                                <div className="text-2xl">🍦</div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-bold text-gray-400">Vị kem bản mệnh:</h4>
                                    <p className={`font-bold ${isWinner ? 'text-yellow-300' : 'text-pink-300'}`}>{card.flavor}</p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>

        </div>
      </div>

      {/* FLIP BUTTON (Explicit Interaction) */}
      <button 
        onClick={handleCardClick}
        className="mb-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-bold backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 animate-pulse"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        {isFlipped ? 'XEM MẶT TRƯỚC' : 'LẬT MẶT SAU'}
      </button>

      {/* --- ACTION BAR (Always visible) --- */}
      <div className="w-full opacity-100 translate-y-0 transition-all duration-700">
          
          {/* Main Buttons */}
          <div className="flex gap-3 mb-5">
              <button 
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="flex-1 bg-white/10 active:bg-white/20 border border-white/20 rounded-xl py-3 font-semibold text-sm text-gray-200 flex items-center justify-center gap-2 transition"
              >
                  {isDownloading ? (
                      <span className="animate-spin">⏳</span>
                  ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  )}
                  {isDownloading ? 'Đang tải...' : 'Lưu Ảnh'}
              </button>
              
              <button 
                onClick={handleNativeShare}
                className={`flex-1 rounded-xl py-3 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg animate-pulse ${isWinner ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}
              >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                  Chia sẻ ngay
              </button>
          </div>

          {/* Social Icons Bar */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-3 text-center">Hoặc chia sẻ thủ công qua</p>
              
              <div className="flex justify-between items-center px-1 overflow-x-auto gap-2 no-scrollbar">
                  {/* Facebook */}
                  <button onClick={handleFacebookShare} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg transform active:scale-95 transition">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <span className="text-[9px] text-gray-300">Face</span>
                  </button>

                  {/* Zalo */}
                  <button onClick={() => handleCopyAndRedirect('Zalo', 'https://zalo.me')} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center shadow-lg transform active:scale-95 transition">
                          <span className="font-black text-white text-[10px]">Zalo</span>
                      </div>
                      <span className="text-[9px] text-gray-300">Zalo</span>
                  </button>

                  {/* TikTok */}
                  <button onClick={() => handleCopyAndRedirect('TikTok', 'https://tiktok.com')} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg transform active:scale-95 transition">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                      </div>
                      <span className="text-[9px] text-gray-300">TikTok</span>
                  </button>
                  
                  {/* Instagram Story (NEW) */}
                   <button onClick={handleInstagramStory} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] shadow-lg transform active:scale-95 transition">
                         <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                         </div>
                      </div>
                      <span className="text-[9px] text-gray-300">Story</span>
                  </button>

                   {/* Instagram Feed */}
                   <button onClick={() => handleCopyAndRedirect('Instagram', 'https://instagram.com')} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center shadow-lg transform active:scale-95 transition">
                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </div>
                      <span className="text-[9px] text-gray-300">Insta</span>
                  </button>

                  {/* Threads */}
                  <button onClick={handleThreadsShare} className="flex flex-col items-center gap-1 group min-w-[40px]">
                      <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg transform active:scale-95 transition">
                           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.08 0C5.454 0 0 5.485 0 12.19c0 5.253 3.42 9.697 8.083 11.45.626.236.96-.328.96-.583 0-.417-.02-3.13-.02-5.464-3.568.536-4.066-2.618-4.32-3.43-.14-.356-.732-1.455-1.25-1.748-.426-.237-1.04-.82.02-.835 1.155-.015 1.785.83 2.036 1.233.996 1.71 2.62 1.22 3.264.93.102-.724.39-1.22.71-1.5-3.09-.35-6.33-1.545-6.33-6.88 0-1.52.543-2.76 1.436-3.734-.144-.352-.622-1.766.136-3.682 0 0 1.17-.375 3.834 1.43A13.345 13.345 0 0112.08 6.55c1.185.005 2.38.16 3.513.47 2.66-1.805 3.83-1.43 3.83-1.43.76 1.916.282 3.33.138 3.682.894.975 1.435 2.214 1.435 3.734 0 5.346-3.245 6.525-6.34 6.87.402.345.76.993.76 2.002 0 1.446-.014 2.612-.014 2.966 0 .26.33.83.966.582 4.658-1.758 8.076-6.198 8.076-11.45C24.16 5.484 18.707 0 12.08 0z" /></svg>
                      </div>
                      <span className="text-[9px] text-gray-300">Threads</span>
                  </button>
              </div>
          </div>

          {/* Toast Notification */}
          {showCopiedToast && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Đã sao chép!</span>
              </div>
          )}
      </div>
    </div>
  );
}