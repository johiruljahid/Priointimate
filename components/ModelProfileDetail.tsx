
// components/ModelProfileDetail.tsx
import React, { useState, useEffect } from 'react';
import { GirlProfile, UserProfile, VaultItem } from '../types';
import CreditLowPopup from './CreditLowPopup';

interface ModelProfileDetailProps {
  model: GirlProfile;
  user?: UserProfile;
  onBack: () => void;
  onChatNow: (model: GirlProfile) => void;
  isSubscribed: boolean;
  onSubscribePrompt: () => void;
  onUpdateCredits: (amount: number) => void;
  onUnlockItem: (itemId: string, cost: number) => void;
}

const ModelProfileDetail: React.FC<ModelProfileDetailProps> = ({
  model, user, onBack, onChatNow, onSubscribePrompt, onUnlockItem
}) => {
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingOpenId, setPendingOpenId] = useState<string | null>(null);
  
  // Improved Lightbox state to handle navigation
  const [lightbox, setLightbox] = useState<{ 
    isOpen: boolean; 
    url: string; 
    type: string; 
    currentIndex: number;
    currentArray: string[];
  }>({
    isOpen: false, 
    url: '', 
    type: 'image',
    currentIndex: 0,
    currentArray: []
  });

  const UNLOCK_COST = 100;

  useEffect(() => {
    if (pendingOpenId && user?.unlockedItems?.includes(pendingOpenId)) {
      const item = model.exclusiveVault.find(v => (v.id === pendingOpenId || v.url === pendingOpenId));
      if (item) {
        const vaultUrls = model.exclusiveVault.map(v => v.url);
        const idx = vaultUrls.indexOf(item.url);
        setLightbox({ 
          isOpen: true, 
          url: item.url, 
          type: item.type || 'image',
          currentIndex: idx,
          currentArray: vaultUrls
        });
        setPendingOpenId(null);
        setLoadingId(null);
      }
    }
  }, [user, pendingOpenId, model.exclusiveVault]);

  const checkUnlocked = (item: VaultItem) => {
    if (!user || !user.unlockedItems) return false;
    return user.unlockedItems.includes(item.id) || user.unlockedItems.includes(item.url);
  };

  const handleAction = async (item: VaultItem) => {
    const id = item.id || item.url;
    const vaultUrls = model.exclusiveVault.map(v => v.url);
    const idx = vaultUrls.indexOf(item.url);

    if (checkUnlocked(item)) {
      setLightbox({ 
        isOpen: true, 
        url: item.url, 
        type: item.type || 'image',
        currentIndex: idx,
        currentArray: vaultUrls
      });
      return;
    }

    if (user && (user.credits || 0) >= UNLOCK_COST) {
      if (window.confirm(`জানু, এই গোপন ছবিটি দেখতে ১০০ ক্রেডিট লাগবে। তুমি কি রাজি? 🫦`)) {
        try {
          setLoadingId(id);
          setPendingOpenId(id);
          await onUnlockItem(id, UNLOCK_COST);
        } catch (err) {
          alert("পেমেন্ট সফল হয়নি।");
          setLoadingId(null);
          setPendingOpenId(null);
        }
      }
    } else {
      setShowCreditPopup(true);
    }
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    const { currentIndex, currentArray } = lightbox;
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Loop around
    if (newIndex >= currentArray.length) newIndex = 0;
    if (newIndex < 0) newIndex = currentArray.length - 1;

    setLightbox({
      ...lightbox,
      currentIndex: newIndex,
      url: currentArray[newIndex]
    });
  };

  const SEDUCTIVE_NOTES = ["আমাকে দেখবে? ❤️", "গোপন রূপ? 🫦", "কাছে আসো না... 🔥", "১০০ ক্রেডিট লাগবে... 😉", "খুব একা... 💋", "খুলবে কি? 🎁"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in pb-32">
      {showCreditPopup && <CreditLowPopup onClose={() => setShowCreditPopup(false)} onBuyCredits={onSubscribePrompt} />}

      {/* Improved Lightbox with Navigation */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-fade-in">
           {/* Close Button */}
           <button 
             onClick={() => setLightbox({...lightbox, isOpen: false})} 
             className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10 z-[2005] hover:bg-white/20 transition-all"
           >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>

           {/* Previous Button */}
           <button 
             onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
             className="absolute left-4 md:left-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center border border-white/10 z-[2001] hover:bg-primary hover:scale-110 active:scale-95 transition-all shadow-2xl"
           >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
           </button>

           {/* Next Button */}
           <button 
             onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
             className="absolute right-4 md:right-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center border border-white/10 z-[2001] hover:bg-primary hover:scale-110 active:scale-95 transition-all shadow-2xl"
           >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/></svg>
           </button>

           {/* Main Image View */}
           <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <div className="relative max-w-full max-h-[80vh] group">
                <img 
                  key={lightbox.url}
                  src={lightbox.url} 
                  className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(255,77,148,0.3)] border-4 border-white/10 animate-in zoom-in duration-300" 
                  alt="" 
                />
              </div>
              
              {/* Image Counter Badge */}
              <div className="mt-8 px-6 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                 <p className="text-white font-black tracking-widest uppercase text-xs">
                    ছবি: {lightbox.currentIndex + 1} / {lightbox.currentArray.length}
                 </p>
              </div>
           </div>
        </div>
      )}

      <div className="flex items-center gap-6">
        <button onClick={onBack} className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary font-black border border-primary/10 hover:scale-110 active:scale-95 transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{model.name}'s Portfolio</h2>
      </div>

      <div className="bg-white rounded-[60px] p-8 md:p-12 shadow-2xl border-4 border-white flex flex-col md:flex-row gap-12 items-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
         <div className="relative w-56 h-[380px] rounded-[45px] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-700">
            <img src={model.profilePic} className="w-full h-full object-cover" alt="" />
         </div>
         <div className="relative z-10 space-y-8 text-center md:text-left flex-grow">
            <div>
               <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none mb-4 text-3d">{model.name}</h1>
               <p className="text-2xl md:text-3xl font-bold text-gray-500 italic opacity-80 leading-tight">"{model.bio}"</p>
            </div>
            <button onClick={() => onChatNow(model)} className="px-14 py-6 bg-gradient-to-r from-primary to-secondary text-white font-black text-2xl rounded-[30px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 justify-center md:justify-start border-b-8 border-black/10">
               চ্যাট শুরু করুন 🫦
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </button>
         </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center gap-4">
           <div className="w-2 h-10 bg-primary rounded-full"></div>
           <h3 className="text-4xl font-black text-gray-900 tracking-tight">পাবলিক গ্যালারি ✨</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {model.gallery?.map((img, i) => (
             <div 
               key={i} 
               onClick={() => setLightbox({
                 isOpen: true, 
                 url: img, 
                 type: 'image', 
                 currentIndex: i, 
                 currentArray: model.gallery || []
               })} 
               className="aspect-[3/4] rounded-[40px] overflow-hidden bg-white p-2 shadow-xl cursor-pointer hover:scale-105 transition-all border-2 border-white group"
             >
                <img src={img} className="w-full h-full object-cover rounded-[35px] group-hover:scale-110 transition-transform duration-1000" alt="" />
             </div>
           ))}
        </div>
      </div>

      <div className="bg-[#0A0A0F] rounded-[80px] p-10 md:p-20 border-[6px] border-white/5 relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,77,148,0.2),transparent_70%)]"></div>
         <div className="relative z-10 text-center space-y-12">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">আমার <span className="text-primary italic">গোপন</span> ভল্ট</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {model.exclusiveVault.map((item, idx) => {
                  const id = item.id || item.url;
                  const unlocked = checkUnlocked(item);
                  const loading = loadingId === id;
                  const note = SEDUCTIVE_NOTES[idx % SEDUCTIVE_NOTES.length];
                  return (
                    <div key={id} onClick={() => !loading && handleAction(item)} className={`relative aspect-[3/4] rounded-[50px] overflow-hidden border-4 cursor-pointer transition-all duration-700 ${unlocked ? 'border-green-500/30 shadow-[0_0_40px_rgba(74,222,128,0.1)]' : 'border-white/5 hover:border-primary/40'}`}>
                       <img src={item.url} className={`w-full h-full object-cover transition-all duration-[1.5s] ${unlocked ? 'blur-0 opacity-100 scale-100' : 'blur-xl opacity-30 scale-110'}`} alt="" />
                       {!unlocked ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20 backdrop-blur-[1px]">
                            {loading ? (
                               <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                               <>
                                 <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-2xl mb-5 text-3xl">🔒</div>
                                 <p className="text-[10px] text-white font-black uppercase tracking-widest mb-2">{item.teaser || "SECRET PHOTO"}</p>
                                 <p className="text-xs text-primary font-bold italic mb-8 opacity-80 px-2">"{note}"</p>
                                 <button className="bg-primary text-white px-8 py-3 rounded-full text-xs font-black uppercase shadow-xl border-b-4 border-black/20 hover:scale-110 active:scale-95 transition-all">১০০ ক্রেডিট 🫦</button>
                               </>
                            )}
                         </div>
                       ) : (
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-8">
                            <div className="w-full flex justify-between items-center text-white">
                               <div>
                                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">UNLOCKED</p>
                                  <p className="text-xl font-black">গোপন রূপ 💋</p>
                               </div>
                               <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                  );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ModelProfileDetail;
