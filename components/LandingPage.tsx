// components/LandingPage.tsx
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center overflow-y-auto overflow-x-hidden animate-fade-in scrollbar-hide">
      {/* Passionate Pink Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating Heart Emoticons */}
        <div className="absolute top-[20%] left-[10%] text-primary opacity-20 text-4xl animate-float">❤️</div>
        <div className="absolute top-[40%] right-[15%] text-secondary opacity-20 text-5xl animate-float" style={{ animationDelay: '2s' }}>💖</div>
        <div className="absolute bottom-[20%] left-[20%] text-primary opacity-10 text-6xl animate-float" style={{ animationDelay: '4s' }}>🌸</div>
      </div>

      <div className="relative z-10 w-full max-w-[500px] min-h-full flex flex-col items-center justify-between p-6 py-10 md:py-16">
        
        {/* Profile Section - Vibrant 3D Case */}
        <div className="relative w-full flex justify-center items-center">
          <div className="relative w-full max-w-[320px] aspect-[4/5] animate-float-slow">
            {/* Layered Seductive Glow */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-primary/40 to-secondary/40 rounded-[80px] blur-[40px] opacity-60"></div>
            
            <div className="relative h-full w-full bg-white p-3 rounded-[75px] shadow-3d-pop border-2 border-white">
              <div className="w-full h-full rounded-[65px] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800&h=1000" 
                  className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
                  alt="Seductive Portrait" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                <div className="absolute top-8 left-8 flex items-center gap-2 bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 shadow-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_12px_#4ade80]"></div>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest drop-shadow-md">আমি অনলাইনে আছি</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-[30px] shadow-3d-pop flex items-center justify-center border-4 border-primary/10 transform rotate-12 animate-bounce-gentle">
                <span className="text-4xl select-none">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catchy Seductive Title */}
        <div className="w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-[#2D1622] tracking-tighter leading-tight drop-shadow-sm">
              আপনার জানু <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#FF70A6] to-secondary">অপেক্ষা করছে!</span>
            </h1>
            <p className="fancy-font text-3xl text-primary opacity-80">Sweet heart...</p>
          </div>
          
          <div className="px-4">
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-snug italic">
              "আজ অনেক একা লাগছে... আসুন না দুজনে মিলে কিছু মিষ্টি মুহূর্ত কাটাই?"
            </p>
          </div>
        </div>

        {/* Hot Action Button */}
        <div className="w-full space-y-8 flex flex-col items-center">
          <button 
            onClick={onStart}
            className="group relative w-full py-7 bg-gradient-to-r from-[#FF4D94] to-[#A64DFF] text-white font-black text-2xl md:text-3xl rounded-[35px] shadow-[0_25px_50px_rgba(255,77,148,0.4)] hover:scale-[1.05] active:scale-95 transition-all duration-300 flex items-center justify-center gap-5 overflow-hidden border-b-8 border-black/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.2s]"></div>
            <span className="relative z-10 drop-shadow-lg">চ্যাট শুরু করি জানু</span>
            <div className="relative z-10 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md transform group-hover:translate-x-2 transition-transform shadow-inner">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
               </svg>
            </div>
          </button>
          
          <div className="flex items-center gap-4 bg-primary/5 px-6 py-3 rounded-full border border-primary/10">
             <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://ui-avatars.com/api/?background=random&color=fff&name=U${i}`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
             </div>
             <p className="text-[11px] text-[#A64DFF] font-black uppercase tracking-widest">
                ১২,৫০০+ জন লাভ চ্যাট করছে
             </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(20deg); }
        }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .shadow-3d-pop { box-shadow: 0 20px 40px rgba(255, 77, 148, 0.25), inset 0 -4px 8px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default LandingPage;