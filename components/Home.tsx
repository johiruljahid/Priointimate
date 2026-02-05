// components/Home.tsx
import React from 'react';
import { APP_NAME_BN, UI_TEXT_BN } from '../constants';
import { GirlProfile } from '../types';
import ModelCard from './ModelCard';

interface HomeProps {
  onViewModels: () => void;
  onSelectModel: (model: GirlProfile) => void;
  models: GirlProfile[];
}

const Home: React.FC<HomeProps> = ({ onViewModels, onSelectModel, models }) => {
  const featuredModels = models.slice(0, 3);

  return (
    <div className="p-4 md:p-8 space-y-24 animate-fade-in max-w-7xl mx-auto pb-32">
      {/* Vivid 3D Hero */}
      <div className="relative overflow-hidden bg-white/60 backdrop-blur-3xl p-14 md:p-28 rounded-[80px] border-[5px] border-white shadow-[0_40px_100px_rgba(255,77,148,0.15)] text-center group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] group-hover:bg-secondary/20 transition-all duration-1000"></div>
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-tight text-3d animate-in slide-in-from-top duration-700">
            {UI_TEXT_BN.welcome} <br/>
            <span className="text-3d-color inline-block scale-110 md:scale-125 px-4 transform-gpu drop-shadow-2xl">
              {APP_NAME_BN}
            </span> এ!
          </h2>
          <p className="text-2xl md:text-4xl text-gray-700 max-w-4xl mx-auto leading-tight font-black italic opacity-90 drop-shadow-sm">
            "আপনার জীবনের সবচেয়ে রঙিন এবং রোমান্টিক অ্যাডভেঞ্চার এখানে শুরু..."
          </p>
          <div className="flex justify-center pt-8">
            <button 
              onClick={onViewModels} 
              className="group relative px-20 py-8 bg-gradient-to-r from-primary to-secondary text-white font-black text-3xl md:text-4xl rounded-[45px] shadow-[0_30px_60px_rgba(255,77,148,0.5)] hover:scale-105 hover:-translate-y-2 active:scale-95 transition-all duration-300 border-b-[10px] border-black/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 rounded-[40px]"></div>
              <span className="relative z-10 drop-shadow-lg">সব মডেল দেখুন 🔥</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Models Grid */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-5xl md:text-7xl font-black text-3d tracking-tight inline-block relative">
            সেরা আকর্ষণীয় মডেলরা
            <div className="absolute -bottom-4 left-0 w-full h-3 bg-gradient-to-r from-primary via-secondary to-primary rounded-full shadow-lg"></div>
          </h3>
          <p className="text-primary font-black uppercase tracking-[0.5em] text-xs pt-4">FEATURED THIS WEEK</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-20 px-4">
          {featuredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onSelect={onSelectModel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;