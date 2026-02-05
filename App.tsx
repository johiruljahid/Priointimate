
// App.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile as UserProfileType, GirlProfile, AppView, WithdrawRequest, SubscriptionPackage, PaymentRequest } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import UserProfileComponent from './components/UserProfile';
import ModelList from './components/ModelList';
import ModelProfileDetail from './components/ModelProfileDetail';
import ChatScreen from './components/ChatScreen';
import SubscriptionPackages from './components/SubscriptionPackages';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { 
  onAuthChange,
  syncUserByUid, 
  signUpUser,
  signInUser,
  logoutUser,
  syncAllModels,
  addModelDB,
  updateModelDB,
  deleteModelDB,
  deductCreditsDB,
  unlockContentDB,
  createPaymentRequestDB, 
  approvePaymentDB,
  createWithdrawRequestDB,
  approveWithdrawDB,
  syncAllPayments,
  syncAllWithdrawals,
  syncAllUsers
} from './services/firebase';

type AppStage = 'landing' | 'auth' | 'main';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('landing');
  const [currentView, setCurrentView] = useState<AppView>('home');
  
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfileType[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [girlModels, setGirlModels] = useState<GirlProfile[]>([]);
  const [selectedModel, setSelectedModel] = useState<GirlProfile | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);

  // Auth State Listener
  useEffect(() => {
    const unsubAuth = onAuthChange((firebaseUser) => {
      if (currentView === 'admin') return;

      if (firebaseUser) {
        const unsubUser = syncUserByUid(firebaseUser.uid, (profile) => {
          if (profile) {
            setUser(profile);
            setAppStage('main');
          }
        });
        return () => unsubUser();
      } else {
        if (appStage !== 'landing' && currentView !== 'admin') {
          setUser(null);
          setAppStage('auth');
        }
      }
    });
    return () => unsubAuth();
  }, [appStage, currentView]);

  // Sync Models (Live)
  useEffect(() => {
    const unsubModels = syncAllModels(setGirlModels);
    return () => unsubModels();
  }, []);

  // Sync Data for Admin/User
  useEffect(() => {
    if (currentView === 'admin' || user?.email === 'admin@prio.com') {
      const unsubUsers = syncAllUsers(setAllUsers);
      const unsubPays = syncAllPayments(setPaymentRequests);
      const unsubWithdraws = syncAllWithdrawals(setWithdrawRequests);
      return () => { unsubUsers(); unsubPays(); unsubWithdraws(); };
    }
  }, [user, currentView]);

  const handleNavigate = (view: AppView) => setCurrentView(view);
  const handleSelectModel = (model: GirlProfile) => { setSelectedModel(model); setCurrentView('modelDetail'); };

  const handleCreatePaymentRequest = async (details: { trxId: string; number: string; packageId: string; appliedCoupon?: string }) => {
    if (!user) return;
    const pkg = selectedPackage!;
    await createPaymentRequestDB({
      userId: user.id,
      userName: user.name,
      packageId: pkg.id,
      packageName: pkg.name,
      amount: pkg.price - (details.appliedCoupon ? 49 : 0),
      credits: pkg.credits,
      method: 'bKash',
      number: details.number,
      trxId: details.trxId,
      appliedCoupon: details.appliedCoupon
    });
    setCurrentView('home');
  };

  const handleApprovePayment = async (requestId: string) => {
    await approvePaymentDB(requestId);
  };

  const handleApproveWithdraw = async (id: string) => {
    await approveWithdrawDB(id);
  };

  const handleUserLogout = async () => {
    await logoutUser();
    setUser(null);
    setCurrentView('home');
    setAppStage('auth');
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    try {
      await signUpUser(name, email, pass);
    } catch (err: any) {
      alert("রেজিস্ট্রেশনে সমস্যা: " + err.message);
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      await signInUser(email, pass);
    } catch (err: any) {
      alert("লগইন সমস্যা: " + err.message);
    }
  };

  const handleAddWithdrawRequest = async (req: Omit<WithdrawRequest, 'id' | 'status' | 'timestamp'>) => {
    await createWithdrawRequestDB(req);
  };

  const handleUpdateCredits = async (amount: number) => {
    if (user) {
      await deductCreditsDB(user.id, amount);
    }
  };

  const handleUnlockItem = async (itemId: string, cost: number) => {
    if (user) {
      try {
        await unlockContentDB(user.id, itemId, cost);
      } catch (err: any) {
        alert("আনলক করতে সমস্যা: " + err.message);
      }
    }
  };

  const handleAddModel = async (model: GirlProfile) => {
    try {
      await addModelDB(model);
      alert("মডেল সফলভাবে যোগ করা হয়েছে!");
    } catch (err: any) {
      alert("মডেল যোগ করতে সমস্যা: " + err.message);
    }
  };

  const handleUpdateModel = async (model: GirlProfile) => {
    try {
      await updateModelDB(model);
      alert("মডেল সফলভাবে আপডেট করা হয়েছে!");
    } catch (err: any) {
      alert("মডেল আপডেট করতে সমস্যা: " + err.message);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await deleteModelDB(id);
      alert("মডেল সফলভাবে ডিলিট করা হয়েছে!");
    } catch (err: any) {
      alert("মডেল ডিলিট করতে সমস্যা: " + err.message);
    }
  };

  const handleAdminBypass = () => {
    const virtualAdmin: UserProfileType = {
      id: 'admin-root',
      name: 'Prio Admin',
      email: 'admin@prio.com',
      referralCode: 'ADMINX',
      balance: 0,
      referralEarnings: 0,
      credits: 99999,
      referredBy: null,
      withdrawalRequests: [],
      unlockedItems: []
    };
    setUser(virtualAdmin);
    setAppStage('main');
    setCurrentView('admin');
  };

  // Determine if we should show site chrome (Header/Footer)
  const isChatActive = currentView === 'chat';
  const isAdminActive = currentView === 'admin';
  const showChrome = !isChatActive && !isAdminActive && user;

  if (appStage === 'landing') return <LandingPage onStart={() => setAppStage('auth')} />;

  if (appStage === 'auth') return (
    <AuthPage 
      onLogin={handleLogin} 
      onRegister={handleRegister} 
      onAdminLogin={handleAdminBypass} 
    />
  );

  return (
    <div className={`flex flex-col min-h-screen ${isAdminActive ? 'bg-[#F8F9FD]' : 'bg-transparent'}`}>
      {showChrome && (
        <Header onNavigate={handleNavigate} currentView={currentView} user={user} onLogout={handleUserLogout} />
      )}
      
      <main className={`flex-grow ${isChatActive ? '' : 'container mx-auto p-4 md:p-8 max-w-7xl'}`}>
        {currentView === 'home' && <Home onViewModels={() => handleNavigate('models')} onSelectModel={handleSelectModel} models={girlModels} />}
        {currentView === 'profile' && user && <UserProfileComponent user={user} onUpdateUser={setUser} onAddWithdrawRequest={handleAddWithdrawRequest} onLogout={handleUserLogout} />}
        {currentView === 'models' && <ModelList models={girlModels} onSelectModel={handleSelectModel} />}
        {currentView === 'modelDetail' && selectedModel && (
          <ModelProfileDetail
            model={selectedModel}
            user={user || undefined}
            onBack={() => setCurrentView('models')}
            onChatNow={m => { setSelectedModel(m); setCurrentView('chat'); }}
            isSubscribed={false}
            onSubscribePrompt={() => setCurrentView('subscription')}
            onUpdateCredits={handleUpdateCredits} 
            onUnlockItem={handleUnlockItem}
          />
        )}
        {currentView === 'chat' && (
          <ChatScreen 
            selectedModel={selectedModel} 
            user={user}
            onBackToModels={() => setCurrentView('models')} 
            onUpdateCredits={handleUpdateCredits}
            onNavigateToSubscription={() => setCurrentView('subscription')}
          />
        )}
        {currentView === 'subscription' && <SubscriptionPackages onSelectPackage={pkg => { setSelectedPackage(pkg); setCurrentView('checkout'); }} />}
        {currentView === 'checkout' && selectedPackage && user && (
          <Checkout pkg={selectedPackage} user={user} onConfirm={handleCreatePaymentRequest} onCancel={() => setCurrentView('subscription')} />
        )}
        {isAdminActive && (
          <AdminPanel 
            withdrawRequests={withdrawRequests} 
            paymentRequests={paymentRequests}
            users={allUsers}
            models={girlModels}
            onApproveWithdraw={handleApproveWithdraw}
            onRejectWithdraw={() => {}}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={() => {}}
            onAddModel={handleAddModel}
            onUpdateModel={handleUpdateModel}
            onDeleteModel={handleDeleteModel}
            onLogout={handleUserLogout}
          />
        )}
      </main>

      {showChrome && <Footer />}
    </div>
  );
};

export default App;
