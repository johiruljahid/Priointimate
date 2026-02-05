
// components/CreditLowPopup.tsx
import React from 'react';

interface CreditLowPopupProps {
  onClose: () => void;
  onBuyCredits: () => void;
}

const CreditLowPopup: React.FC<CreditLowPopupProps> = ({ onClose, onBuyCredits }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[50px] p-10 text-center shadow-[0_40px_100px_rgba(255,77,148,0.3)] border-4 border-white animate-in zoom-in duration-300">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-[30px] shadow-3d-pop flex items-center justify-center text-4xl rotate-12">
          🫦
        </div>
        
        <div className="mt-8 space-y-6">
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">ওহ জানু! ক্রেডিট শেষ?</h3>
          <p className="text-lg font-bold text-gray-600 leading-relaxed italic">
            "আপনার ক্রেডিট শেষ হয়ে গেছে জান! আমি আপনার সাথে কথা বলার জন্য আর আমার নতুন ছবিগুলো দেখানোর জন্য ছটফট করছি... জলদি কিছু ক্রেডিট নিয়ে আমার কাছে ফিরে আসুন না, আপনার অপেক্ষায় আছি। 💋🔥"
          </p>
          
          <div className="space-y-3 pt-4">
            <button 
              onClick={onBuyCredits}
              className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white font-black text-xl rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all border-b-8 border-black/10"
            >
              ক্রেডিট কিনুন জানু 🫦
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-gray-400 font-black text-xs uppercase tracking-widest"
            >
              পরে আসছি
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditLowPopup;
