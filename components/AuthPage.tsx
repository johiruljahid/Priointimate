
// components/AuthPage.tsx
import React, { useState } from 'react';
import { APP_NAME_BN } from '../constants';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onAdminLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onAdminLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Admin Code States
  const [showAdminCodeField, setShowAdminCodeField] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      if (!name) { alert("দয়া করে আপনার নাম লিখুন জান!"); return; }
      onRegister(name, email, password);
    }
  };

  const handleAdminVerify = () => {
    if (adminCode === "Mishela") {
      onAdminLogin();
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8] flex items-center justify-center p-4 py-12 md:py-20 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-komola/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[60px] shadow-[0_60px_120px_rgba(255,77,148,0.15)] border-[8px] border-white p-8 md:p-14 animate-in zoom-in fade-in duration-700 flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[360px] aspect-[4/5] group perspective-1000">
             <div className="absolute -inset-10 bg-gradient-to-tr from-primary/30 to-komola/30 rounded-[70px] blur-[60px] opacity-40 group-hover:opacity-60 transition-all duration-1000"></div>
             
             <div className="relative h-full w-full bg-white p-3 rounded-[55px] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-2 border-white/50 overflow-hidden transform group-hover:rotate-y-6 group-hover:scale-[1.02] transition-all duration-700 ease-out">
                <img 
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800&h=1000" 
                  className="w-full h-full object-cover rounded-[45px]" 
                  alt="Beautiful Model" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-10 left-0 right-0 text-center flex flex-col items-center">
                   <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Verified Profile</span>
                   </div>
                   <p className="text-white text-xl font-black italic drop-shadow-lg">"আপনার জানু অপেক্ষা করছে জান... ❤️"</p>
                </div>
             </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="text-center mb-8">
            <div className="inline-block relative mb-4">
              <h2 className="text-6xl md:text-7xl font-black text-3d-color tracking-tighter">
                {APP_NAME_BN}
              </h2>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-600 leading-tight italic max-w-xs mx-auto text-3d">
              {isLogin ? '"আপনার একাকীত্ব দূর করতে আমি তৈরি, আপনি তৈরি তো জান? 🔥"' : '"নতুন অ্যাডভেঞ্চার শুরু করুন আজই জান! 😘"'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
             {!isLogin && (
               <div className="group space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">আপনার পূর্ণ নাম</label>
                  <div className="relative">
                     <div className="absolute inset-0 bg-gray-100 rounded-[28px] shadow-3d-input pointer-events-none"></div>
                     <input 
                       type="text" 
                       required
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="আপনার নাম লিখুন" 
                       className="relative w-full bg-transparent border-2 border-transparent p-5 rounded-[28px] font-bold text-lg text-gray-800 focus:outline-none focus:border-primary/20 transition-all placeholder:text-gray-300 z-10"
                     />
                  </div>
               </div>
             )}

             <div className="group space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">ইমেইল এড্রেস</label>
                <div className="relative">
                   <div className="absolute inset-0 bg-gray-100 rounded-[28px] shadow-3d-input pointer-events-none"></div>
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="example@mail.com" 
                     className="relative w-full bg-transparent border-2 border-transparent p-5 rounded-[28px] font-bold text-lg text-gray-800 focus:outline-none focus:border-primary/20 transition-all placeholder:text-gray-300 z-10"
                   />
                </div>
             </div>

             <div className="group space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-6">পাসওয়ার্ড</label>
                <div className="relative">
                   <div className="absolute inset-0 bg-gray-100 rounded-[28px] shadow-3d-input pointer-events-none"></div>
                   <input 
                     type="password" 
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="relative w-full bg-transparent border-2 border-transparent p-5 rounded-[28px] font-bold text-lg text-gray-800 focus:outline-none focus:border-primary/20 transition-all placeholder:text-gray-300 z-10"
                   />
                </div>
             </div>

             <button 
               type="submit"
               className="w-full py-6 mt-4 bg-gradient-to-r from-primary via-[#FF70A6] to-komola text-white font-black text-2xl rounded-[30px] shadow-[0_25px_50px_rgba(255,77,148,0.4)] hover:scale-[1.02] active:scale-95 transition-all border-b-[8px] border-black/10 flex items-center justify-center gap-4"
             >
               <span>{isLogin ? 'লগইন করি জান' : 'শুরু করি জান'}</span>
               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
               </div>
             </button>
          </form>

          <div className="w-full mt-8">
            <div 
              onClick={() => setIsLogin(!isLogin)}
              className="group cursor-pointer p-6 bg-gradient-to-br from-primary/5 to-komola/5 rounded-[40px] border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all duration-300 text-center flex flex-col items-center gap-2"
            >
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {isLogin ? 'নতুন অ্যাকাউন্ট খুলতে চান?' : 'ইতিমধ্যেই অ্যাকাউন্ট আছে?'}
              </span>
              <span className="text-2xl font-black text-primary underline underline-offset-[10px] decoration-4 group-hover:scale-105 transition-transform decoration-komola/50">
                {isLogin ? 'এখানে রেজিস্টার করুন! ✨' : 'সরাসরি লগইন করুন 💋'}
              </span>
            </div>
          </div>

          <div className="mt-8 w-full flex flex-col items-center gap-4">
             {!showAdminCodeField ? (
                <button 
                  onClick={() => setShowAdminCodeField(true)}
                  className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
                >
                   ADMIN ACCESS
                </button>
             ) : (
                <div className="w-full max-w-xs animate-in slide-in-from-bottom-2 duration-300">
                   <div className="bg-gray-50 p-5 rounded-[30px] border-2 border-primary/10 shadow-xl space-y-3">
                      <p className="text-[10px] font-black text-primary uppercase text-center tracking-widest">এডমিন কোড লিখুন</p>
                      <input 
                         type="password"
                         value={adminCode}
                         onChange={(e) => setAdminCode(e.target.value)}
                         onKeyPress={(e) => e.key === 'Enter' && handleAdminVerify()}
                         placeholder="CODE"
                         className="w-full bg-white p-3 rounded-2xl text-center font-black text-gray-800 border-2 border-gray-100 outline-none uppercase tracking-widest"
                      />
                      <div className="flex gap-2">
                         <button onClick={handleAdminVerify} className="flex-grow py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">VERIFY</button>
                         <button onClick={() => setShowAdminCodeField(false)} className="px-4 py-3 bg-gray-200 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest">ESC</button>
                      </div>
                      {adminError && <p className="text-[9px] text-red-500 font-black text-center uppercase tracking-tighter">ভুল কোড জান! ❌</p>}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
