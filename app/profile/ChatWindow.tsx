"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLang } from "../../lib/lang";

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    username: string;
    avatar: string;
    status?: string;
  };
}

export default function ChatWindow({ isOpen, onClose, recipient }: ChatWindowProps) {
  const { lang, dir } = useLang();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: lang === 'ar' ? `مرحباً! أعجبتني مشاريعك جداً 🚀` : "Hey! I really love your projects! 🚀", sender: "me", time: "12:00 PM" },
    { id: 2, text: lang === 'ar' ? `شكراً لك! هذا يعني الكثير لي. كيف يمكنني مساعدتك؟` : "Thank you! That means a lot. How can I help you today?", sender: "them", time: "12:01 PM" },
    { id: 3, text: lang === 'ar' ? "كنت أتساءل إذا كنت مهتماً بالتعاون في لعبة جديدة؟" : "I was wondering if you'd be interested in collaborating on a new game?", sender: "me", time: "12:02 PM" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue("");

    // Fake reply
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: lang === 'ar' ? "يبدو ذلك مذهلاً! دعنا نتحدث أكثر عن التفاصيل." : "That sounds amazing! Let's talk more about the details.",
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />
      
      {/* Chat Container */}
      <div className="relative w-full h-full max-w-5xl bg-[#08090b] border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.15)] rounded-none md:rounded-[3rem] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500" dir={dir}>
         {/* 🫧 GLOW EFFECTS */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

         {/* Header */}
         <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-[#08090b]/80 backdrop-blur-xl">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-purple-500/10">
                  {recipient.username.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h3 className="text-xl font-black text-white tracking-tight">@{recipient.username}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{lang === 'ar' ? 'متصل الآن' : 'Active Now'}</span>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all active:scale-95 group">
               <span className="text-xl group-hover:rotate-90 transition-transform block">✕</span>
            </button>
         </header>

         {/* Messages Area */}
         <div 
           ref={scrollRef}
           className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide no-scrollbar relative z-10"
         >
            {messages.map((msg) => (
               <div 
                 key={msg.id} 
                 className={`flex ${msg.sender === 'me' ? (lang === 'ar' ? 'justify-start' : 'justify-end') : (lang === 'ar' ? 'justify-end' : 'justify-start')} animate-in fade-in slide-in-from-bottom-2 duration-300`}
               >
                  <div className={`max-w-[80%] md:max-w-[70%] p-5 md:p-6 rounded-[2rem] shadow-2xl relative group ${msg.sender === 'me' ? 'bg-white text-slate-950 rounded-br-none' : 'bg-slate-900/80 backdrop-blur-xl text-white border border-white/5 rounded-bl-none'}`}>
                     <p className="text-base md:text-lg font-medium leading-relaxed">{msg.text}</p>
                     <span className={`text-[9px] font-bold uppercase tracking-widest mt-3 block opacity-40 ${msg.sender === 'me' ? 'text-slate-900' : 'text-slate-400'}`}>
                        {msg.time}
                     </span>
                     
                     {/* Floating Glow for Me */}
                     {msg.sender === 'me' && (
                       <div className="absolute -inset-0.5 bg-white/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Footer / Input */}
         <footer className="p-8 border-t border-white/5 relative z-10 bg-[#08090b]/80 backdrop-blur-xl">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
               <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-[2.5rem] p-2 pr-6 pl-4 group-focus-within:border-white/20 transition-all">
                  <button className="p-4 hover:bg-white/5 rounded-full text-2xl transition-all grayscale hover:grayscale-0">😀</button>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك للمبدع...' : 'Type your message to creator...'}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-slate-600 outline-none"
                  />
                  <button 
                    onClick={handleSend}
                    className="bg-white text-slate-950 h-14 w-14 rounded-full flex items-center justify-center font-black shadow-2xl hover:scale-105 active:scale-90 transition-all"
                  >
                     <span className={`${lang === 'ar' ? 'rotate-180' : ''}`}>➤</span>
                  </button>
               </div>
            </div>
            <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest mt-6">
               {lang === 'ar' ? 'تشفير فائق الأمان من الطرفين' : 'End-to-End Encrypted Secure Matrix'}
            </p>
         </footer>
      </div>
    </div>
  );
}
