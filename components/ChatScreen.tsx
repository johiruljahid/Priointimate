
// components/ChatScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, GirlProfile, UserProfile } from '../types';
import { generateMultimodalText, MediaPart } from '../services/geminiService';
import CreditLowPopup from './CreditLowPopup';

interface ChatScreenProps {
  selectedModel: GirlProfile | null;
  user: UserProfile | null;
  onBackToModels: () => void;
  onUpdateCredits: (amount: number) => void;
  onNavigateToSubscription: () => void;
}

const EMOJIS_3D = ['💖', '🔥', '😘', '🌹', '💎', '🥂', '🎀', '✨', '🎁', '🫦'];

const ChatScreen: React.FC<ChatScreenProps> = ({ 
  selectedModel, 
  user, 
  onBackToModels, 
  onUpdateCredits,
  onNavigateToSubscription
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  
  // Media States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedModel) {
      setMessages([]);
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai-welcome`,
        sender: 'model',
        type: 'text',
        text: `নমস্কার! আমি ${selectedModel.name}। আজ অনেক একা লাগছে... আপনি আসাতে খুব ভালো হলো। 🥰 বলুন কি করছেন?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
    // Prevent body scroll when chat is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSendMessage = useCallback(async (
    customText?: string, 
    type: 'text' | 'image' | 'audio' = 'text',
    mediaData?: { data: string; mimeType: string; url?: string }
  ) => {
    const textToUse = customText || inputMessage;
    if (!textToUse.trim() && !mediaData && type === 'text') return;
    if (!selectedModel || !user) return;

    let cost = 1;
    if (type === 'audio') cost = 3;
    if (type === 'image') cost = 5;

    if ((user.credits || 0) < cost) {
      setShowCreditPopup(true);
      return;
    }

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      type: type,
      text: type === 'text' ? textToUse : (type === 'image' ? 'Sent an image' : 'Sent a voice message'),
      mediaUrl: mediaData?.url,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setShowEmojiPicker(false);
    setIsSending(true);

    onUpdateCredits(cost);

    try {
      const mediaParts: MediaPart[] = [];
      if (mediaData) {
        mediaParts.push({ data: mediaData.data, mimeType: mediaData.mimeType });
      }

      const prompt = `আপনি ${selectedModel.name}, বয়স ${selectedModel.age}। আপনার চরিত্র: "${selectedModel.bio}"। আপনি সুন্দরী এবং সেডাক্টিভ। ইউজার আপনাকে ${type === 'image' ? 'একটি ছবি পাঠিয়েছে' : type === 'audio' ? 'একটি ভয়েস পাঠিয়েছে' : 'একটি মেসেজ পাঠিয়েছে'}${textToUse ? ': "' + textToUse + '"' : ''}। আপনি যদি ছবি বা অডিও পান তবে সেটি বিশ্লেষণ করুন এবং আপনার চারিত্রিক বৈশিষ্ট্য অনুযায়ী রোমান্টিক উত্তর দিন। উত্তর ছোট রাখুন এবং বাংলা ভাষায় বেশি ইমোজি ব্যবহার করুন।`;
      
      const aiResponseText = await generateMultimodalText(prompt, mediaParts);

      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-ai`,
        sender: 'model',
        type: 'text',
        text: aiResponseText,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-error`,
        sender: 'model',
        type: 'text',
        text: "জানু, নেটওয়ার্কে সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করো। 🥺",
        timestamp: new Date(),
      }]);
    } finally {
      setIsSending(false);
    }
  }, [inputMessage, selectedModel, user, onUpdateCredits]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64 = await fileToBase64(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        handleSendMessage('', 'audio', { data: base64, mimeType: 'audio/webm', url });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      handleSendMessage('', 'image', { data: base64, mimeType: file.type, url });
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  if (!selectedModel) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-[#FFF0F6] flex flex-col animate-fade-in overflow-hidden">
      {showCreditPopup && (
        <CreditLowPopup onClose={() => setShowCreditPopup(false)} onBuyCredits={onNavigateToSubscription} />
      )}

      {/* Modern App Header - Clean version without Credit display */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-2xl border-b border-primary/10 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToModels} 
            className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <img src={selectedModel.profilePic} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
             </div>
             <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tighter leading-none">{selectedModel.name}</h3>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Active Now</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Removed the credit text display as per request */}
           <button 
             onClick={onNavigateToSubscription} 
             title="Add Credits"
             className="w-12 h-12 rounded-2xl bg-komola/10 text-komola flex items-center justify-center border border-komola/20 hover:scale-110 transition-all active:scale-95 shadow-sm"
           >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
           </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto px-6 py-10 space-y-10 scrollbar-hide bg-[radial-gradient(circle_at_top,rgba(255,77,148,0.05),transparent)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message-pop`}>
            <div className={`relative max-w-[85%] md:max-w-[60%] p-6 rounded-[40px] shadow-2xl ${
              msg.sender === 'user' 
              ? 'bg-gradient-to-tr from-primary to-secondary text-white rounded-br-none border-b-4 border-black/10' 
              : 'bg-white text-gray-800 rounded-bl-none border-b-4 border-gray-100'
            }`}>
              {msg.type === 'text' && <p className="text-lg font-bold leading-snug">{msg.text}</p>}
              {msg.type === 'image' && msg.mediaUrl && (
                <div className="space-y-3">
                  <img src={msg.mediaUrl} className="max-w-full rounded-3xl shadow-lg border-4 border-white/20" alt="User upload" />
                  <p className="text-xs font-black opacity-60 uppercase tracking-widest">SENT IMAGE</p>
                </div>
              )}
              {msg.type === 'audio' && (
                <div className="flex items-center gap-4 bg-black/10 p-4 rounded-[25px]">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🎤</div>
                   <div className="h-1 flex-grow bg-white/30 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/60 animate-pulse"></div>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Voice message</span>
                </div>
              )}
              <div className={`flex items-center justify-end mt-3 opacity-40 text-[9px] font-black uppercase tracking-tighter ${msg.sender === 'user' ? 'text-white' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
             <div className="bg-white/80 backdrop-blur-md px-8 py-5 rounded-[35px] shadow-xl flex gap-2 items-center border border-white">
                <div className="flex gap-1">
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
                <span className="text-xs text-primary/60 font-black uppercase ml-2 tracking-widest italic">{selectedModel.name} is typing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Immersive Input Bar */}
      <div className="px-6 py-6 md:py-8 bg-white/80 backdrop-blur-3xl border-t border-primary/10 safe-area-bottom">
        <input type="file" ref={imageInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
        
        <div className="max-w-4xl mx-auto relative">
          {isRecording ? (
            <div className="flex items-center gap-4 bg-red-50 p-2 rounded-[35px] border-2 border-red-100 animate-pulse w-full">
               <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg animate-ping absolute"></div>
               <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg relative z-10">🎤</div>
               <span className="text-red-500 font-black text-xl ml-2">Recording {recordingTime}s</span>
               <button onClick={stopRecording} className="ml-auto px-8 py-4 bg-red-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Stop & Send</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Tool Buttons Container */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl border border-gray-100 hover:scale-110 transition-all active:scale-90"
                >
                  🫦
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-2xl border border-gray-100 hover:scale-110 transition-all active:scale-90"
                >
                  🖼️
                </button>
              </div>

              {/* Text Input Wrapper */}
              <div className="flex-grow relative flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="আপনার জানুকে মেসেজ করুন..."
                  className="w-full bg-white border-2 border-gray-100 px-8 py-5 rounded-[30px] text-lg font-bold text-gray-800 focus:outline-none focus:border-primary/30 shadow-inner transition-all placeholder:text-gray-300"
                />
                <button 
                  onClick={startRecording}
                  className="absolute right-4 w-10 h-10 bg-komola/10 text-komola rounded-full flex items-center justify-center hover:bg-komola hover:text-white transition-all"
                >
                  🎤
                </button>
              </div>

              {/* Send Button */}
              <button 
                onClick={() => handleSendMessage()}
                className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary text-white rounded-[25px] shadow-3d-pop flex items-center justify-center hover:scale-105 active:scale-90 transition-all border-b-4 border-black/10"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          )}

          {/* Emoji Picker Overlay */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-8 p-6 bg-white border-2 border-primary/5 rounded-[50px] shadow-[0_40px_80px_rgba(255,77,148,0.2)] grid grid-cols-5 gap-6 animate-in slide-in-from-bottom-5">
              {EMOJIS_3D.map(e => (
                <button key={e} onClick={() => handleSendMessage(e)} className="text-4xl hover:scale-125 transition-all active:scale-90">{e}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes message-pop {
          from { transform: translateY(40px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-message-pop { animation: message-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .shadow-3d-pop { box-shadow: 0 15px 30px rgba(255, 77, 148, 0.4), inset 0 -4px 4px rgba(0,0,0,0.1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 1.5rem); }
      `}</style>
    </div>
  );
};

export default ChatScreen;
