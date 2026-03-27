"use client";

import React, { useState, useMemo } from "react";
import { useLang } from "../../lib/lang";
import { BUILTIN_ASSETS, ASSET_CATEGORIES } from "../../lib/assets";
import Link from "next/link";

export default function AssetStorePage() {
  const { t, lang, dir } = useLang();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<"details"|"success">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string|null>(null);
  const [method, setMethod] = useState<"card"|"paypal">("card");

  const handlePurchase = (asset: any) => {
    if (!asset.price) {
      window.location.href = "/editor";
      return;
    }
    setSelectedAsset(asset);
    setPaymentStep("details");
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setMethod("card");
    setError(null);
  };

  const completePayment = () => {
    // Validation
    if (method === "card") {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError(lang === 'ar' ? 'رقم البطاقة غير مكتمل' : 'Invalid card number');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError(lang === 'ar' ? 'تاريخ الانتهاء غير صحيح' : 'Invalid expiry date (MM/YY)');
        return;
      }
      if (cvc.length < 3) {
        setError(lang === 'ar' ? 'رمز CVC غير صحيح' : 'Invalid CVC');
        return;
      }
    } else {
      // PayPal login validation placeholder
    }

    setError(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("success");
    }, 1500);
  };

  const filtered = useMemo(() => {
    return BUILTIN_ASSETS.filter(a => {
      const matchesFilter = filter === "all" || a.cat === filter;
      const matchesSearch = search === "" || 
        a.name.toLowerCase().includes(search.toLowerCase()) || 
        a.desc.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const featuredAsset = BUILTIN_ASSETS[BUILTIN_ASSETS.length - 1]; // Template as featured

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      {/* 🔮 HERO SECTION */}
      <div className="relative mb-16 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-white/[0.05] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-blue-900/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20 pointer-events-none"></div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-16">
          <div className="flex-1 text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black tracking-widest uppercase mb-6">
              ✨ {lang === 'ar' ? 'أصل مميز' : 'Featured Asset'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              {featuredAsset.name}
            </h1>
            <p className="text-slate-400 text-lg mb-8 font-light max-w-xl">
              {featuredAsset.desc} {lang === 'ar' ? 'ابدأ مشروعك القادم بأساس احترافي متكامل جاهز للتعديل.' : 'Kickstart your next project with a professional foundation.'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link href="/editor" className="px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.05] transition-all shadow-xl shadow-white/10 active:scale-95">
                {t("assets.download")}
              </Link>
              <button className="px-8 py-4 bg-slate-900/50 backdrop-blur-xl border border-white/5 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">
                {lang === 'ar' ? 'التفاصيل' : 'Details'}
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] aspect-square rounded-[3rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[180px] shadow-2xl shadow-purple-600/20 animate-pulse-slow">
            {featuredAsset.icon}
          </div>
        </div>
      </div>

      {/* 🔍 FILTER & SEARCH */}
      <div className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">{t("nav.assets")}</h2>
            <p className="text-slate-500 text-sm">{t("assets.desc")}</p>
          </div>
          <div className="relative w-full md:w-[400px]">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'ابحث عن أصول، رسومات، أكواد...' : 'Search assets, sprites, code...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {ASSET_CATEGORIES.map((cat) => (
            <button 
              key={cat.key} 
              onClick={() => setFilter(cat.key)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all border shrink-0 flex items-center gap-2 ${filter === cat.key ? 'bg-white text-slate-950 border-white shadow-xl shadow-white/5' : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'}`}
            >
              <span>{cat.icon}</span>
              {cat.key === 'all' ? t("assets.all") : (lang === 'ar' ? t(`assets.${cat.key}`) : cat.label)}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 ASSET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(asset => (
          <div key={asset.id} className={`group flex flex-col bg-slate-950 border ${asset.cat === 'premium' ? 'border-amber-500/30' : 'border-white/[0.03]'} rounded-[2rem] overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 relative`}>
            {asset.cat === 'premium' && (
              <div className="absolute top-4 right-4 z-20 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg shadow-amber-500/20">
                PRO 👑
              </div>
            )}
            <div className={`aspect-[4/3] w-full bg-gradient-to-br ${asset.preview || 'from-slate-800 to-slate-900'} flex items-center justify-center text-7xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl">{asset.icon}</span>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-white border border-white/10 tracking-widest uppercase">
                {lang === 'ar' ? t(`assets.${asset.cat}`) : asset.cat}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-black text-white text-lg leading-tight group-hover:text-purple-400 transition-colors line-clamp-1">{asset.name}</h3>
                <span className={`text-[10px] font-black ${asset.price ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400 bg-emerald-400/10'} px-2 py-0.5 rounded-md uppercase tracking-wide`}>
                  {asset.price || t("assets.free")}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-medium mb-6 line-clamp-2 h-8 leading-relaxed">
                {asset.desc}
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 p-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[8px]">GF</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold tracking-tight">GameForge Studio</span>
                </div>
                <button 
                  onClick={() => handlePurchase(asset)}
                  className={`p-2.5 rounded-xl border border-white/5 transition-all ${asset.price ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-900 text-slate-400 hover:bg-purple-600 hover:text-white'}`}
                >
                   {asset.price ? (
                     <span className="text-[10px] font-black uppercase px-2">Buy</span>
                   ) : (
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                   )}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
            <span className="text-6xl mb-6 block grayscale">📂</span>
            <p className="text-slate-500 font-black text-xl mb-2">{t("assets.empty")}</p>
            <button onClick={() => {setSearch(""); setFilter("all")}} className="text-purple-400 text-sm font-bold hover:underline">
              {lang === 'ar' ? 'عرض جميع الأصول' : 'Show all assets'}
            </button>
          </div>
        )}
      </div>

      {/* 🚀 SELL CTA */}
      <div className="mt-32 p-12 md:p-20 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-[#08090c] border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-600/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10 leading-tight">
          {t("assets.support.title")}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 relative z-10 font-light leading-relaxed">
          {t("assets.support.desc")}
        </p>
        <button className="relative z-10 px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-[2rem] hover:scale-[1.05] transition-all shadow-2xl shadow-purple-600/30 active:scale-95">
          {t("assets.sell")}
        </button>
      </div>

      {/* 💳 PAYMENT MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#0c0d12] border border-white/[0.08] rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-500/10 relative">
             {paymentStep === "details" ? (
               <div className="p-8 sm:p-12">
                  <button onClick={() => setSelectedAsset(null)} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-colors">✕</button>
                  
                  <div className="flex items-center gap-6 mb-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedAsset.preview} flex items-center justify-center text-4xl shadow-lg`}>
                      {selectedAsset.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-1">{selectedAsset.name}</h4>
                      <p className="text-slate-500 text-sm font-medium">{t("assets.support.title")}</p>
                    </div>
                    <div className="ml-auto text-end">
                       <span className="text-2xl font-black text-amber-500">{selectedAsset.price}</span>
                       <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Global License</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">{lang === 'ar' ? 'وسيلة الدفع' : 'Payment Method'}</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setMethod("card")}
                          className={`flex items-center justify-center gap-3 p-4 rounded-xl font-bold text-sm transition-all ${method === 'card' ? 'bg-white text-slate-950 border-white shadow-xl shadow-white/10' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
                        >
                           💳 {lang === 'ar' ? 'بطاقة' : 'Card'}
                        </button>
                        <button 
                          onClick={() => setMethod("paypal")}
                          className={`flex items-center justify-center gap-3 p-4 rounded-xl font-bold text-sm transition-all ${method === 'paypal' ? 'bg-[#ffc439] text-slate-950 border-[#ffc439] shadow-xl shadow-[#ffc439]/20' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'}`}
                        >
                           🅿️ PayPal
                        </button>
                      </div>
                    </div>

                    {method === "card" ? (
                      <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        {error && (
                          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] font-black uppercase text-center animate-in shake-in duration-300">
                            ⚠️ {error}
                          </div>
                        )}
                        
                        <div className={`bg-black/40 p-1.5 border ${error && cardNumber.length < 16 ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl flex items-center px-4 transition-colors`}>
                          <span className="text-slate-600 text-sm mr-4">🔒</span>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                              setCardNumber(v);
                              if(error) setError(null);
                            }}
                            className="bg-transparent border-none text-white text-sm w-full py-3 focus:outline-none font-mono tracking-widest" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`bg-black/40 p-1.5 border ${error && !/^\d{2}\/\d{2}$/.test(expiry) ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl flex items-center px-4 transition-colors`}>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              maxLength={5}
                              value={expiry}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, '');
                                if(v.length > 2) v = v.substring(0,2) + '/' + v.substring(2,4);
                                setExpiry(v);
                                if(error) setError(null);
                              }}
                              className="bg-transparent border-none text-white text-sm w-full py-3 focus:outline-none font-mono" 
                            />
                          </div>
                          <div className={`bg-black/40 p-1.5 border ${error && cvc.length < 3 ? 'border-rose-500/50' : 'border-white/5'} rounded-2xl flex items-center px-4 transition-colors`}>
                            <input 
                              type="text" 
                              placeholder="CVC" 
                              maxLength={3}
                              value={cvc}
                              onChange={(e) => {
                                setCvc(e.target.value.replace(/\D/g, ''));
                                if(error) setError(null);
                              }}
                              className="bg-transparent border-none text-white text-sm w-full py-3 focus:outline-none font-mono" 
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                         <div className="text-center py-6 px-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <span className="text-3xl block mb-2">🅿️</span>
                            <p className="text-xs text-blue-400 font-bold px-8">
                               {lang === 'ar' ? 'سيتم تحويلك إلى صفحة PayPal الآمنة لإتمام الدفع.' : 'You will be redirected to PayPal to complete your purchase securely.'}
                            </p>
                         </div>
                         <div className="space-y-3">
                            <div className="bg-black/40 p-4 border border-white/5 rounded-2xl flex items-center">
                               <span className="text-slate-600 text-sm mr-4">✉️</span>
                               <input type="email" placeholder="PayPal Email" className="bg-transparent border-none text-white text-sm w-full focus:outline-none font-medium" />
                            </div>
                         </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-600 text-center px-8">
                       {lang === 'ar' ? 'بأتمام هذا الطلب أنت توافق على شروط بيع الأصول الرقمية لمنصة GameForge.' : 'By completing this order, you agree to the GameForge digital asset sale terms.'}
                    </p>

                    <button 
                      onClick={completePayment}
                      disabled={isProcessing}
                      className={`w-full py-5 font-black rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50 ${method === 'paypal' ? 'bg-[#ffc439] text-[#003087] shadow-[#ffc439]/20' : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-amber-500/20'}`}
                    >
                      {isProcessing ? (
                        <div className={`w-5 h-5 border-2 rounded-full animate-spin ${method === 'paypal' ? 'border-[#003087]/30 border-t-[#003087]' : 'border-slate-950/30 border-t-slate-950'}`}></div>
                      ) : (
                        method === 'paypal' 
                          ? (lang === 'ar' ? 'دفع بواسطة PayPal' : 'Pay with PayPal')
                          : (lang === 'ar' ? `دفع ${selectedAsset.price}` : `Pay ${selectedAsset.price}`)
                      )}
                    </button>
                  </div>
               </div>
             ) : (
               <div className="p-12 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
                    ✅
                  </div>
                  <h4 className="text-3xl font-black text-white mb-4">{lang === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}</h4>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    {lang === 'ar' ? 'تمت إضافة الأصل بنجاح إلى حسابك. يمكنك الآن استخدامه في جميع مشاريعك.' : 'Asset added to your library. You can now use it in all your GameForge projects.'}
                  </p>
                  <button 
                    onClick={() => { setSelectedAsset(null); window.location.href="/editor"; }}
                    className="px-12 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-[1.05] transition-all"
                  >
                    {lang === 'ar' ? 'افتح المحرر للبدء' : 'Open Editor to Start'}
                  </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
