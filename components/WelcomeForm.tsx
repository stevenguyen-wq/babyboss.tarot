import React, { useState } from 'react';
import { UserData } from '../types';
import { checkHasPlayed } from '../services/dataService';

interface WelcomeFormProps {
  onSubmit: (data: UserData) => void;
}

export const WelcomeForm: React.FC<WelcomeFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !phoneNumber || !dob) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Simple phone validation
    if (phoneNumber.length < 9) {
       setError('Số điện thoại không hợp lệ.');
       return;
    }

    if (checkHasPlayed(phoneNumber)) {
        setError('Số điện thoại này đã nhận quẻ rồi. Mỗi người chỉ được 1 lần nhé!');
        return;
    }

    // Submit without location
    onSubmit({ 
      fullName, 
      phoneNumber, 
      dob,
    });
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-75"></div>

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-2 uppercase tracking-wide drop-shadow-sm">
          Tarot Vị Giác
        </h1>
        <h2 className="text-xl font-bold text-indigo-200">Baby Boss Gelato</h2>
        <p className="text-sm text-indigo-100 mt-2 italic opacity-80">
          Định mệnh 2026 của bạn có vị gì?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-sm font-semibold text-indigo-200 mb-1 ml-1">Họ và Tên</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 outline-none transition backdrop-blur-sm"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-200 mb-1 ml-1">Số điện thoại</label>
          <input
            type="tel"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 outline-none transition backdrop-blur-sm"
            placeholder="0912..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-200 mb-1 ml-1">Ngày sinh</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 outline-none transition backdrop-blur-sm [color-scheme:dark]"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm text-center font-medium backdrop-blur-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.5)] transform transition hover:-translate-y-1 active:translate-y-0 mt-6 text-lg tracking-wider border border-white/20"
        >
          🔮 KHÁM PHÁ NGAY
        </button>
      </form>
      
      <div className="mt-6 text-center text-xs text-indigo-400/80">
        * Mỗi người chỉ được khám phá vận mệnh bản thân một lần
      </div>
    </div>
  );
}
