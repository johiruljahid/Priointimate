// components/ModelCard.tsx
import React from 'react';
import { GirlProfile } from '../types';
import { UI_TEXT_BN } from '../constants';

interface ModelCardProps {
  model: GirlProfile;
  onSelect: (model: GirlProfile) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(model)}
      className="group relative cursor-pointer"
    >
      {/* Dynamic 3D Shadow Layer */}
      <div className="absolute inset-x-4 -bottom-6 h-12 bg-primary/20 blur-2xl rounded-[60px] group-hover:bg-primary/30 transition-all duration-500"></div>
      
      {/* Main Glass/3D Card Body */}
      <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-[60px] shadow-3d-card border-[3px] border-white group-hover:-translate-y-4 transition-all duration-500 overflow-hidden">
        
        {/* Profile Image Container - 3D Depth */}
        <div className="relative aspect-[4/5] rounded-[45px] overflow-hidden shadow-2xl mb-8">
          <img
            src={model.profilePic}
            alt={model.name}
            className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110"
          />
          
          {/* Vivid Status Badge */}
          <div className="absolute top-5 right-5 bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-[0_10px_20px_rgba(255,77,148,0.4)] animate-pulse border-2 border-white/20">
            ONLINE 🔥
          </div>

          {/* Seductive Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Animated Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        {/* 3D Text Container */}
        <div className="text-center px-4 pb-4 space-y-6">
          <div className="relative">
             <h3 className="text-4xl font-black text-3d tracking-tighter mb-1">
               {model.name}
             </h3>
             <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">
               {model.age} YEARS OLD
             </p>
          </div>

          <p className="text-gray-500 italic text-sm font-bold leading-relaxed line-clamp-2 h-10 px-2 opacity-80">
            "{model.bio}"
          </p>

          <button 
            className="w-full py-5 rounded-[30px] bg-gradient-to-r from-primary to-secondary text-white font-black text-xl 
                       flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,77,148,0.4)] 
                       hover:scale-105 active:scale-95 transition-all duration-300 border-b-8 border-black/10 group-hover:brightness-110"
          >
            {UI_TEXT_BN.chatNow}
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;