
// components/AdminPanel.tsx
import React, { useState } from 'react';
import { WithdrawRequest, PaymentRequest, UserProfile, GirlProfile, VaultItem } from '../types';
import { generateText } from '../services/geminiService';

interface AdminPanelProps {
  withdrawRequests: WithdrawRequest[];
  paymentRequests: PaymentRequest[];
  users: UserProfile[];
  models: GirlProfile[];
  onApproveWithdraw: (id: string) => void;
  onRejectWithdraw: (id: string) => void;
  onApprovePayment: (id: string) => void;
  onRejectPayment: (id: string) => void;
  onAddModel: (m: GirlProfile) => void;
  onUpdateModel: (m: GirlProfile) => void;
  onDeleteModel: (id: string) => void;
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'payments' | 'withdraw' | 'users' | 'models';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  withdrawRequests, 
  paymentRequests, 
  users, 
  models, 
  onApproveWithdraw, 
  onRejectWithdraw,
  onApprovePayment, 
  onRejectPayment, 
  onAddModel, 
  onUpdateModel, 
  onDeleteModel, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [formData, setFormData] = useState<Partial<GirlProfile>>({
    name: '', age: 20, bio: '', profilePic: '', gallery: [], exclusiveVault: []
  });

  // Stats calculation
  const totalRevenue = paymentRequests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0);
  const totalCommissionPaid = withdrawRequests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0);
  const pendingPayments = paymentRequests.filter(r => r.status === 'pending');
  const pendingWithdrawals = withdrawRequests.filter(r => r.status === 'pending');

  const generateAIContent = async (type: 'bio' | 'vault', index?: number) => {
    if (!formData.name) return alert("আগে মডেলের নাম লিখুন!");
    setIsAILoading(true);
    try {
      let prompt = "";
      if (type === 'bio') {
        prompt = `You are a creative writer for a premium dating app. Write a seductive bio in Bengali for ${formData.name}, age ${formData.age}. No preamble. Max 2 short sentences. Use hot emojis.`;
        const res = await generateText(prompt);
        setFormData(prev => ({ ...prev, bio: res.trim() }));
      } else if (type === 'vault' && index !== undefined) {
        prompt = `Write a short sexy teaser in Bengali for an exclusive photo of ${formData.name}. No preamble. 1 powerful line. Use hot emojis.`;
        const res = await generateText(prompt);
        const newVault = [...(formData.exclusiveVault || [])];
        newVault[index] = { ...newVault[index], teaser: res.trim() };
        setFormData(prev => ({ ...prev, exclusiveVault: newVault }));
      }
    } catch (err) {
      console.error(err);
      alert("AI জেনারেশনে সমস্যা হয়েছে।");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.profilePic) return alert("নাম এবং প্রোফাইল পিকচার দিন");
    const toSave = {
      ...formData,
      id: formData.id || `m-${Date.now()}`,
      gallery: formData.gallery?.filter(g => g !== '') || [],
      exclusiveVault: formData.exclusiveVault?.filter(v => v.url !== '').map(v => ({
        ...v, id: v.id || `v-${Math.random().toString(36).substr(2, 9)}`, type: 'image'
      })) || [],
      exclusiveContentPrice: 100
    } as GirlProfile;
    if (formData.id) onUpdateModel(toSave); else onAddModel(toSave);
    setIsModalOpen(false);
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 px-4 md:px-0">
      <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">TOTAL REVENUE</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-6xl font-black">{totalRevenue}</h3>
          <span className="text-4xl font-bold">৳</span>
        </div>
      </div>
      <div className="bg-white rounded-[50px] p-10 text-[#333] shadow-2xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PENDING PAYMENTS</p>
        <h3 className="text-6xl font-black text-primary">{pendingPayments.length}</h3>
      </div>
      <div className="bg-white rounded-[50px] p-10 text-[#333] shadow-2xl border-r-[8px] border-r-[#10B981]">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">COMMISSION PAID</p>
        <h3 className="text-6xl font-black text-[#059669]">{totalCommissionPaid}</h3>
      </div>
      <div className="bg-white rounded-[50px] p-10 text-[#333] shadow-2xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">TOTAL USERS</p>
        <h3 className="text-6xl font-black">{users.length}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20 overflow-x-hidden text-gray-900">
      <div className="bg-[#1A1C29] px-6 py-2 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] text-white font-black uppercase tracking-widest">ADMIN SECURE SESSION</span>
        </div>
        <button onClick={onLogout} className="text-[10px] text-white/50 font-black uppercase tracking-widest hover:text-white transition-colors">LOGOUT</button>
      </div>

      <div className="container mx-auto max-w-7xl pt-10 px-4">
        <div className="bg-white rounded-[45px] p-6 md:p-10 shadow-xl border border-gray-50 flex flex-col lg:flex-row items-center justify-between gap-8">
           <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Prio Admin Panel</h1>
           <div className="bg-gray-50/80 p-2 rounded-full border border-gray-100 flex gap-1 flex-wrap justify-center overflow-x-auto">
              {['dashboard', 'payments', 'withdraw', 'users', 'models'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as AdminTab)}
                  className={`px-8 py-4 rounded-full text-[11px] font-black transition-all duration-300 uppercase tracking-widest whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-primary shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'payments' ? `পেমেন্ট (${pendingPayments.length})` : 
                   tab === 'withdraw' ? `উইথড্র (${pendingWithdrawals.length})` : 
                   tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
           </div>
        </div>

        <div className="animate-in fade-in duration-500 mt-10">
          {activeTab === 'dashboard' && renderDashboard()}
          
          {activeTab === 'models' && (
            <div className="space-y-8 pb-32">
               <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black text-gray-900 uppercase">মডেল ম্যানেজমেন্ট</h3>
                  <button onClick={() => { setFormData({ name: '', age: 20, bio: '', profilePic: '', gallery: [], exclusiveVault: [] }); setIsModalOpen(true); }} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">নতুন মডেল</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {models.map(m => (
                    <div key={m.id} className="bg-white p-6 rounded-[45px] shadow-xl border border-gray-100 group">
                       <img src={m.profilePic} className="w-full h-64 object-cover rounded-[35px] mb-4" alt="" />
                       <h4 className="text-2xl font-black text-gray-900 mb-1">{m.name}</h4>
                       <p className="text-xs text-gray-400 font-bold italic line-clamp-2 h-8 mb-6">"{m.bio}"</p>
                       <div className="flex gap-2">
                          <button onClick={() => { setFormData(m); setIsModalOpen(true); }} className="flex-grow bg-softBg text-primary py-3 rounded-2xl font-black text-xs uppercase tracking-widest">এডিট</button>
                          <button onClick={() => { if(confirm("মুছে ফেলবেন?")) onDeleteModel(m.id); }} className="bg-red-50 text-red-400 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all">✖</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'payments' && (
             <div className="space-y-8 pb-32">
                <h3 className="text-3xl font-black text-gray-900 uppercase">পেমেন্ট রিকোয়েস্ট</h3>
                <div className="space-y-6">
                  {pendingPayments.length === 0 ? <p className="text-gray-400 font-bold">কোনো পেন্ডিং পেমেন্ট নেই জান।</p> : 
                  pendingPayments.map(req => (
                    <div key={req.id} className="bg-white p-8 rounded-[45px] shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-softBg rounded-2xl flex items-center justify-center text-3xl">💎</div>
                          <div>
                             <p className="text-xl font-black text-gray-900">{req.userName}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{req.method} • {req.number}</p>
                             <p className="text-[10px] text-primary font-black mt-1 uppercase">TRX: {req.trxId}</p>
                          </div>
                       </div>
                       <div className="text-center">
                          <p className="text-3xl font-black text-primary">৳ {req.amount}</p>
                          <p className="text-[8px] text-gray-400 font-black uppercase">CREDITS: {req.credits}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => onApprovePayment(req.id)} className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Approve</button>
                          <button onClick={() => onRejectPayment(req.id)} className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Reject</button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'withdraw' && (
             <div className="space-y-8 pb-32">
                <h3 className="text-3xl font-black text-gray-900 uppercase">উইথড্র রিকোয়েস্ট</h3>
                <div className="space-y-6">
                   {pendingWithdrawals.length === 0 ? <p className="text-gray-400 font-bold">কোনো পেন্ডিং উইথড্র নেই জান।</p> : 
                   pendingWithdrawals.map(req => (
                     <div key={req.id} className="bg-white p-8 rounded-[45px] shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl">💰</div>
                           <div>
                              <p className="text-xl font-black text-gray-900">{req.userName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{req.method} • {req.number}</p>
                           </div>
                        </div>
                        <p className="text-3xl font-black text-primary">৳ {req.amount}</p>
                        <div className="flex gap-2">
                           <button onClick={() => onApproveWithdraw(req.id)} className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Approve</button>
                           <button onClick={() => onRejectWithdraw(req.id)} className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Reject</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'users' && (
             <div className="space-y-8 pb-32">
                <h3 className="text-3xl font-black text-gray-900 uppercase">ইউজার লিস্ট</h3>
                <div className="bg-white rounded-[40px] shadow-xl overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b">
                         <tr>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">নাম</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">ইমেইল</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">ক্রেডিট</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">রেফার কোড</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y">
                         {users.map(u => (
                           <tr key={u.id}>
                              <td className="p-6 font-bold">{u.name}</td>
                              <td className="p-6 font-medium text-gray-500">{u.email}</td>
                              <td className="p-6 font-black text-primary">{u.credits || 0} ★</td>
                              <td className="p-6 font-mono font-bold uppercase">{u.referralCode}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-5xl rounded-[60px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50 backdrop-blur-xl">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">মডেল এডিট</h2>
                 <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-md">✖</button>
              </div>
              
              <div className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">নাম</label>
                       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 p-6 rounded-[30px] border-2 border-gray-100 font-bold text-xl" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">বয়স</label>
                       <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full bg-gray-50 p-6 rounded-[30px] border-2 border-gray-100 font-bold text-xl" />
                    </div>
                    <div>
                       <div className="flex justify-between items-center ml-4 mb-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">বায়ো</label>
                          <button onClick={() => generateAIContent('bio')} disabled={isAILoading} className="text-primary font-black text-[10px] uppercase">✨ AI Bio</button>
                       </div>
                       <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-gray-50 p-6 rounded-[30px] border-2 border-gray-100 font-bold h-32 resize-none" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">প্রোফাইল পিকচার URL</label>
                       <input value={formData.profilePic} onChange={e => setFormData({...formData, profilePic: e.target.value})} className="w-full bg-gray-50 p-6 rounded-[30px] border-2 border-gray-100 font-bold" />
                    </div>
                 </div>

                 <div className="space-y-10">
                    {/* PUBLIC GALLERY FIRST */}
                    <div className="bg-gray-50 p-8 rounded-[45px] border-2 border-dashed border-gray-200">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xl font-black text-gray-600 uppercase">পাবলিক গ্যালারি (FREE)</h4>
                          <button onClick={() => setFormData(p => ({...p, gallery: [...(p.gallery||[]), ""]}))} className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center">+</button>
                       </div>
                       <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                          {formData.gallery?.map((g, i) => (
                             <div key={i} className="flex gap-2">
                                <input value={g} onChange={e => { const ng = [...(formData.gallery||[])]; ng[i] = e.target.value; setFormData({...formData, gallery: ng}); }} className="flex-grow p-4 rounded-xl border border-gray-200 text-xs font-bold bg-white" placeholder="Free Image URL" />
                                <button onClick={() => setFormData(p => ({...p, gallery: p.gallery?.filter((_,idx)=>idx!==i)}))} className="text-red-500 bg-white p-4 rounded-xl border border-gray-100">✖</button>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* PRIVATE VAULT SECOND */}
                    <div className="bg-softBg p-8 rounded-[45px] border-2 border-dashed border-primary/20">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xl font-black text-primary uppercase">প্রাইভেট ভল্ট (FIXED 100 CR)</h4>
                          <button onClick={() => setFormData(p => ({...p, exclusiveVault: [...(p.exclusiveVault||[]), {id: '', url: '', teaser: '', type: 'image'}]}))} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">+</button>
                       </div>
                       <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
                          {formData.exclusiveVault?.map((v, i) => (
                             <div key={i} className="bg-white p-6 rounded-[35px] shadow-xl border border-primary/10 space-y-4">
                                <input value={v.url} onChange={e => { const nv = [...(formData.exclusiveVault||[])]; nv[i].url = e.target.value; setFormData({...formData, exclusiveVault: nv}); }} className="w-full p-4 rounded-xl border border-gray-100 text-[10px] font-bold" placeholder="Secret Image URL" />
                                <div className="flex gap-2">
                                   <input value={v.teaser} onChange={e => { const nv = [...(formData.exclusiveVault||[])]; nv[i].teaser = e.target.value; setFormData({...formData, exclusiveVault: nv}); }} className="flex-grow p-4 rounded-xl border border-gray-100 text-[10px] font-bold" placeholder="Teaser Text..." />
                                   <button onClick={() => generateAIContent('vault', i)} className="bg-gray-900 text-white px-4 rounded-xl text-[10px] font-black uppercase">AI</button>
                                </div>
                                <button onClick={() => setFormData(p => ({...p, exclusiveVault: p.exclusiveVault?.filter((_,idx)=>idx!==i)}))} className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">REMOVE ITEM</button>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t bg-gray-50/50 backdrop-blur-xl flex gap-4">
                 <button onClick={handleSave} className="flex-grow py-6 bg-gradient-to-r from-primary to-secondary text-white font-black text-2xl rounded-[30px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">সেভ করুন</button>
                 <button onClick={() => setIsModalOpen(false)} className="px-12 py-6 bg-white text-gray-500 font-black text-2xl rounded-[30px] border shadow-sm">বাতিল</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
