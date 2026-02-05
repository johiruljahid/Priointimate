
// components/Header.tsx
import React, { useState } from 'react';
import { AppView, UserProfile } from '../types';
import { APP_NAME_BN, UI_TEXT_BN } from '../constants';

interface HeaderProps {
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  user: UserProfile;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { view: AppView; label: string }[] = [
    { view: 'home', label: UI_TEXT_BN.home },
    { view: 'models', label: UI_TEXT_BN.models },
    { view: 'subscription', label: UI_TEXT_BN.subscription },
  ];

  const navigateAndClose = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] px-4 py-3 md:px-8 bg-white/70 backdrop-blur-2xl border-b border-primary/10 shadow-glass">
      <div className="container mx-auto flex items-center justify-between">
        {/* Seductive Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigateAndClose('home')}
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-3d-pop group-hover:rotate-6 transition-all duration-300">
             <span className="text-white font-black text-2xl drop-shadow-md">P</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#2D1622] tracking-tighter hidden sm:block">
            {APP_NAME_BN}
          </h1>
        </div>

        {/* Navigation - Soft Tabs */}
        <nav className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => navigateAndClose(item.view)}
              className={`px-4 py-2.5 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 ${
                currentView === item.view 
                ? 'bg-primary text-white shadow-3d-pop scale-105' 
                : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile - Glossy Pill */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 p-1.5 pr-4 rounded-full bg-primary/5 border border-primary/10 transition-all duration-300 hover:bg-primary/10 ${isMenuOpen ? 'ring-2 ring-primary bg-white shadow-xl' : ''}`}
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-primary shadow-lg">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF4D94&color=fff&bold=true`} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-gray-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-primary font-bold mt-1">৳ {user.balance.toFixed(0)}</p>
            </div>
            <svg className={`w-4 h-4 text-primary/40 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-primary/10 rounded-[35px] shadow-[0_40px_80px_rgba(255,77,148,0.15)] animate-menu-pop z-[110] p-4 origin-top-right">
                <div className="p-5 bg-primary/5 rounded-[25px] mb-2 border border-primary/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xl font-black shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800 leading-tight">{user.name}</p>
                        <p className="text-xs text-primary font-black uppercase">ক্রেডিট: {user.credits || 0}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                  <button onClick={() => navigateAndClose('profile')} className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all group text-left">
                    <span className="font-bold">{UI_TEXT_BN.profile}</span>
                  </button>
                  <button onClick={() => navigateAndClose('subscription')} className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:text-secondary hover:bg-secondary/5 transition-all text-left">
                    <span className="font-bold">{UI_TEXT_BN.subscription}</span>
                  </button>
                  
                  {/* New Prominent Logout Button */}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button 
                      onClick={handleLogoutClick} 
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all text-left group"
                    >
                      <span className="font-black">লগআউট</span>
                      <svg className="w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes menu-pop {
          from { transform: scale(0.9) translateY(-10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-menu-pop { animation: menu-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </header>
  );
};

export default Header;
