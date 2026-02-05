// components/Checkout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SubscriptionPackage, UserProfile } from '../types';
import { BKASH_NUMBER, COUPON_FIXED_DISCOUNT_BDT } from '../constants';

interface CheckoutProps {
  pkg: SubscriptionPackage;
  user: UserProfile;
  onConfirm: (details: { trxId: string; number: string; packageId: string; appliedCoupon?: string }) => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ pkg, user, onConfirm, onCancel }) => {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [bKashNumber, setBKashNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalPayable = pkg.price - appliedDiscount;

  const handleApplyCoupon = () => {
    if (coupon.trim().length > 3) {
      setAppliedDiscount(COUPON_FIXED_DISCOUNT_BDT);
      alert('অভিনন্দন! আপনি ' + COUPON_FIXED_DISCOUNT_BDT + ' টাকা ডিসকাউন্ট পেয়েছেন।');
    } else {
      alert('সঠিক কুপন কোড দিন।');
    }
  };

  const handleConfirm = () => {
    if (bKashNumber.length < 11 || trxId.length < 5) {
      alert('দয়া করে সঠিক তথ্য দিন।');
      return;
    }
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessPopup(true);
    }, 2000);
  };

  const finalizeCheckout = () => {
    onConfirm({ 
      trxId, 
      number: bKashNumber, 
      packageId: pkg.id, 
      appliedCoupon: appliedDiscount > 0 ? coupon : undefined 
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onCancel} />
      
      {!showSuccessPopup ? (
        <div ref={scrollContainerRef} className="relative w-full max-w-xl h-full sm:h-auto sm:max-h-[90vh] bg-[#0A0A0A] sm:rounded-[45px] shadow-2xl overflow-y-auto border-x border-white/5 animate-checkout-slide-up">
          <div className="sticky top-0 z-30 bg-gradient-to-r from-[#D12053] to-[#E91E63] p-8 flex items-center justify-between shadow-lg">
            <h2 className="text-3xl font-black text-white">চেকআউট</h2>
            <button onClick={onCancel} className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>

          <div className="p-10 space-y-8 pb-12">
            <div className="bg-[#1A1A1A] rounded-[35px] p-8 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div style={{ backgroundColor: pkg.color }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg">{pkg.icon}</div>
                   <div>
                      <p className="text-white font-black text-xl">{pkg.credits} Credits</p>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{pkg.name} PACKAGE</p>
                   </div>
                </div>
                <p className="text-2xl font-black text-white">৳{pkg.price}</p>
            </div>

            <div className="space-y-4">
                <label className="text-[11px] text-white/40 font-black uppercase tracking-wider ml-4">রেফার বা কুপন কোড</label>
                <div className="flex gap-2 bg-[#1A1A1A] p-2 rounded-[25px] border border-white/5 shadow-inner">
                   <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="HASAN78..." className="flex-grow bg-transparent px-4 py-3 text-white font-bold focus:outline-none placeholder:text-white/10 uppercase" />
                   <button onClick={handleApplyCoupon} className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl text-xs">APPLY</button>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md rounded-[35px] p-8 border border-white/5 space-y-5">
                <div className="flex justify-between items-center text-white/60 font-bold"><span>মূল্য:</span><span className="text-white">৳{pkg.price}</span></div>
                {appliedDiscount > 0 && <div className="flex justify-between items-center text-green-400 font-bold"><span>ডিসকাউন্ট:</span><span>- ৳{appliedDiscount}</span></div>}
                <div className="h-px bg-white/10 w-full my-2"></div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-lg text-white font-black uppercase">মোট প্রদেয়:</span>
                   <span className="text-4xl font-black text-primary">৳{totalPayable}</span>
                </div>
            </div>

            <div className="bg-white rounded-[35px] overflow-hidden shadow-2xl">
               <div className="bg-[#D12053] p-4 text-center"><h3 className="text-white font-black text-base">bKash পেমেন্ট নির্দেশনা:</h3></div>
               <div className="p-6 space-y-4">
                  <p className="text-[#333] text-sm font-bold leading-tight">১. বিকাশ অ্যাপে <span className="text-[#D12053]">"Send Money"</span> অপশনে যান।</p>
                  <p className="text-[#333] text-sm font-bold leading-tight">২. নিচের নাম্বারে <span className="text-[#D12053] font-black">৳{totalPayable}</span> সেন্ড মানি করুন।</p>
                  <div className="bg-[#FFF0F5] border-2 border-dashed border-[#D12053]/30 rounded-[25px] p-5 text-center cursor-pointer" onClick={() => {navigator.clipboard.writeText(BKASH_NUMBER); alert('নাম্বার কপি হয়েছে!');}}>
                     <p className="text-[10px] text-[#D12053] font-black uppercase mb-1">bKash নম্বর (Click to Copy)</p>
                     <p className="text-2xl font-black text-[#D12053] tracking-wider">{BKASH_NUMBER}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-5 pt-2">
                <input type="text" value={bKashNumber} onChange={(e) => setBKashNumber(e.target.value)} placeholder="বিকাশ নাম্বার" className="w-full bg-[#1A1A1A] border border-white/5 rounded-[25px] p-6 text-white font-bold text-lg focus:outline-none focus:border-primary/50 transition-all" />
                <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="TRANSACTION ID (TRXID)" className="w-full bg-[#1A1A1A] border border-white/5 rounded-[25px] p-6 text-white font-bold text-lg focus:outline-none focus:border-primary/50 transition-all uppercase" />
                <button onClick={handleConfirm} disabled={isProcessing} className={`w-full py-6 rounded-[25px] bg-gradient-to-r from-[#D12053] to-[#E91E63] text-white font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isProcessing ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
                   {isProcessing ? 'ভেরিফাই হচ্ছে...' : 'পেমেন্ট তথ্য জমা দিন'}
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-lg mx-4 bg-[#0A0A0A] rounded-[50px] overflow-hidden shadow-2xl animate-in zoom-in border border-primary/20 p-10 text-center space-y-8">
           <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-[30px] flex items-center justify-center mx-auto shadow-lg rotate-12 mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
           </div>
           <h3 className="text-3xl font-black text-white leading-tight">রিকোয়েস্ট সফল হয়েছে!</h3>
           <p className="text-xl font-bold text-white/90 italic">"পেমেন্ট চেক করে শীঘ্রই আপনার ক্রেডিট যোগ করা হবে। 🥰"</p>
           <button onClick={finalizeCheckout} className="w-full py-6 bg-white text-black font-black text-lg rounded-[22px]">ঠিক আছে, জান</button>
        </div>
      )}
      <style>{`
        @keyframes checkout-slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-checkout-slide-up { animation: checkout-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default Checkout;