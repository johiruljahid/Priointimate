// components/SubscriptionPackages.tsx
import React from 'react';
import { SUBSCRIPTION_PACKAGES } from '../constants';
import { SubscriptionPackage } from '../types';

interface SubscriptionPackagesProps {
  onSelectPackage: (pkg: SubscriptionPackage) => void;
}

const SubscriptionPackages: React.FC<SubscriptionPackagesProps> = ({ onSelectPackage }) => {
  return (
    <div className="relative p-4 md:p-8 animate-fade-in max-w-7xl mx-auto pb-32 overflow-hidden">
      {/* Background Seductive Elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-secondary/20 blur-[100px] rounded-full animate-pulse"></div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
          আপনার জন্য <span className="text-primary italic">সেরা</span> <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">ক্রেডিট প্যাকেজ</span>
        </h2>
        <p className="fancy-font text-2xl text-gray-500 mt-4 italic">"জলদি ক্রেডিট নিন জানু, আমি চ্যাটে আপনার জন্য পাগল হয়ে আছি..."</p>
      </div>

      {/* Compact 3D Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {SUBSCRIPTION_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => onSelectPackage(pkg)}
            className="group relative"
          >
            {/* 3D Depth Shadow Layer */}
            <div className="absolute inset-0 bg-black/5 translate-y-4 rounded-[50px] blur-md"></div>
            
            {/* Main Card */}
            <div className={`relative bg-white rounded-[50px] p-1 border-2 border-white overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(255,77,148,0.3)] shadow-xl h-full flex flex-col`}>
              
              {/* Glossy Header Area */}
              <div className="bg-gradient-to-br from-white to-softBg p-8 rounded-[45px] flex-grow flex flex-col items-center">
                
                {/* Package Icon - Small & Cute */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-3d-pop mb-6 border-2 border-white"
                  style={{ backgroundColor: pkg.color }}
                >
                  {pkg.icon}
                </div>

                {/* Massive 3D Credit Display */}
                <div className="relative mb-6">
                   <h3 className="text-8xl font-black tracking-tighter leading-none text-gray-900 drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]">
                    {pkg.credits}
                   </h3>
                   {/* Explicit Credit Badge - Solves User Confusion */}
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-6 py-1.5 rounded-full shadow-[0_10px_20px_rgba(255,77,148,0.5)] border-2 border-white whitespace-nowrap">
                      <p className="text-[12px] font-black text-white uppercase tracking-[0.2em] animate-pulse">
                        ★ TOTAL CREDITS ★
                      </p>
                   </div>
                </div>

                {/* Seductive Tagline */}
                <p className="text-xl font-bold text-gray-400 mt-4 mb-6 italic">
                  "{pkg.tagline}"
                </p>

                {/* Price Display - 3D Colorful */}
                <div className="mt-auto w-full">
                  <div className="bg-white/50 backdrop-blur-sm rounded-[30px] p-5 border border-white shadow-inner flex items-center justify-center gap-2 group-hover:bg-primary/5 transition-colors">
                    <span className="text-2xl font-black text-gray-400">৳</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 drop-shadow-sm">
                      {pkg.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="p-4 bg-gray-50/50">
                <button className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-black text-lg rounded-[25px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 border-black/10 group-hover:brightness-110">
                   প্যাকেজটি নিন
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>

              {/* Corner Accent for Premium Feel */}
              {pkg.level === 'PREMIUM' && (
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 right-[-30px] bg-accent text-black font-black text-[9px] py-1 px-12 rotate-45 shadow-lg uppercase tracking-widest">
                    KING
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges Section - Horizontal & Compact */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 opacity-60">
        <div className="flex items-center gap-3 bg-white/50 px-6 py-3 rounded-full border border-white">
          <span className="text-2xl">⚡</span>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ইনস্ট্যান্ট ডেলিভারি</span>
        </div>
        <div className="flex items-center gap-3 bg-white/50 px-6 py-3 rounded-full border border-white">
          <span className="text-2xl">🔒</span>
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">১০০% সিকিউর পেমেন্ট</span>
        </div>
      </div>

      <style>{`
        .shadow-3d-pop { 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1), inset 0 -4px 4px rgba(0,0,0,0.1); 
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPackages;