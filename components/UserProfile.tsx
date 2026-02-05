
// components/UserProfile.tsx
import React, { useState } from 'react';
import { UserProfile as UserProfileType, WithdrawRequest } from '../types';
import { UI_TEXT_BN } from '../constants';

interface UserProfileProps {
  user: UserProfileType;
  onUpdateUser: (updatedUser: UserProfileType) => void;
  onAddWithdrawRequest: (request: WithdrawRequest) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onAddWithdrawRequest, onLogout }) => {
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Smart 3D Young Boy Avatar for user
  const userAvatar = "https://img.freepik.com/premium-photo/3d-cartoon-avatar-young-man-hoodie-smiling_1029473-10023.jpg";

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = user.referralEarnings;
    if (amount < 200) { alert(UI_TEXT_BN.minWithdraw); return; }
    if (!withdrawNumber || withdrawNumber.length < 11) { alert("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।"); return; }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest: WithdrawRequest = {
        id: `withdraw-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        amount: amount,
        method: withdrawMethod,
        number: withdrawNumber,
        status: 'pending',
        timestamp: new Date(),
      };
      onAddWithdrawRequest(newRequest);
      onUpdateUser({
        ...user,
        referralEarnings: 0,
        withdrawalRequests: [...user.withdrawalRequests, newRequest]
      });
      setWithdrawNumber('');
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("কোডটি কপি করা হয়েছে!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in pb-32">
      <div className="relative bg-white rounded-[60px] p-8 md:p-14 shadow-[0_40px_100px_rgba(255,77,148,0.15)] border-4 border-white group overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-gray-50">
              <img src={userAvatar} className="w-full h-full object-cover" alt={user.name} />
            </div>
            <div className="absolute bottom-2 right-6 w-12 h-12 bg-white rounded-2xl shadow-3d-pop flex items-center justify-center text-2xl border-2 border-primary/10">✨</div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4 text-3d">{user.name}</h2>
            <p className="text-xl text-primary font-bold italic mb-8 opacity-70">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="bg-softBg px-8 py-4 rounded-[30px] shadow-inner border border-white text-center">
                 <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1">আপনার ক্রেডিট</p>
                 <span className="text-3xl font-black text-gray-800">{Math.floor(user.credits || 0)} ★</span>
              </div>
              <div className="bg-secondary/5 px-8 py-4 rounded-[30px] shadow-inner border border-white text-center">
                 <p className="text-[10px] text-secondary font-black uppercase tracking-[0.3em] mb-1">রেফার কমিশন</p>
                 <span className="text-3xl font-black text-gray-800">৳ {Math.floor(user.referralEarnings || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[50px] p-10 shadow-[0_30px_60px_rgba(255,77,148,0.1)] border-2 border-white flex flex-col h-full relative group">
           <div className="absolute top-4 right-8 text-6xl opacity-10">🎁</div>
           <div className="mb-8">
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-primary to-[#FF80AB] flex items-center justify-center text-white shadow-3d-pop mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">আপনার প্রমো কোড</h3>
              <p className="text-lg text-gray-500 font-medium italic">"আপনার কোডটি বন্ধুদের শেয়ার করুন এবং পান ২০% লাইফটাইম কমিশন! 🔥"</p>
           </div>
           <div onClick={() => copyToClipboard(user.referralCode)} className="mt-auto p-8 bg-softBg rounded-[40px] border-4 border-dashed border-primary/20 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-all active:scale-95">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-primary uppercase mb-1">কপি করতে ক্লিক করুন</span>
                 <span className="text-4xl font-black text-gray-900 tracking-widest uppercase">{user.referralCode}</span>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl">📋</div>
           </div>
        </div>

        <div className="bg-white rounded-[50px] p-10 shadow-[0_30px_60px_rgba(166,77,255,0.1)] border-2 border-white relative flex flex-col h-full">
          {user.referralEarnings < 200 && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-center justify-center p-10 text-center rounded-[50px]">
              <div className="bg-white p-8 rounded-[40px] shadow-3d-pop border-2 border-primary/10 animate-bounce">
                <p className="text-lg font-black text-gray-800 leading-tight">উত্তোলনের জন্য কমপক্ষে ২০০ টাকা রেফারেল কমিশন লাগবে জান!</p>
              </div>
            </div>
          )}
          <h3 className="text-3xl font-black text-gray-900 mb-6">টাকা উত্তোলন করুন</h3>
          <div className="bg-gray-50 p-6 rounded-[35px] text-center mb-8">
             <p className="text-[10px] text-gray-400 font-black uppercase mb-1">উত্তোলনযোগ্য ব্যালেন্স</p>
             <span className="text-5xl font-black text-gray-900">৳ {Math.floor(user.referralEarnings)}</span>
          </div>
          <form onSubmit={handleWithdraw} className="space-y-4 mt-auto">
            <div className="flex gap-2">
              <button type="button" onClick={() => setWithdrawMethod('bKash')} className={`flex-1 py-4 rounded-2xl font-black ${withdrawMethod === 'bKash' ? 'bg-[#D12053] text-white shadow-lg' : 'bg-gray-100'}`}>bKash</button>
              <button type="button" onClick={() => setWithdrawMethod('Nagad')} className={`flex-1 py-4 rounded-2xl font-black ${withdrawMethod === 'Nagad' ? 'bg-[#F7941D] text-white shadow-lg' : 'bg-gray-100'}`}>Nagad</button>
            </div>
            <input type="text" value={withdrawNumber} onChange={(e) => setWithdrawNumber(e.target.value)} placeholder="বিকাশ/নগদ নম্বর দিন" className="w-full bg-gray-50 p-5 rounded-2xl text-lg font-bold outline-none border-2 border-transparent focus:border-primary/20" />
            <button type="submit" disabled={isSubmitting || user.referralEarnings < 200} className="w-full py-5 rounded-[25px] bg-gradient-to-r from-primary to-secondary text-white font-black text-xl shadow-xl active:scale-95">
              {isSubmitting ? 'প্রসেসিং...' : 'রিকোয়েস্ট পাঠান'}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-white/80 backdrop-blur-2xl">
           <div className="w-full max-w-md bg-white rounded-[50px] p-10 text-center shadow-3xl border-4 border-white animate-in zoom-in">
              <div className="w-20 h-20 bg-green-500 rounded-[25px] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">✅</div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">রিকোয়েস্ট সফল!</h3>
              <p className="text-lg font-bold text-gray-600 mb-8 italic">"খুব শীঘ্রই আপনার টাকা ফোনে চলে আসবে জান। 🥰"</p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl">ঠিক আছে</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
