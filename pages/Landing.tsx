
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, ChevronLeft, Smartphone, Wallet, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { APP_INFO } from '../constants';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showAdminSelect, setShowAdminSelect] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>

      {/* Content */}
      <div className="w-full max-w-md z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 animate-bounce">
            <span className="text-4xl font-black italic">B</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">{APP_INFO.name}</h1>
          <p className="text-slate-400 font-bold text-lg">{APP_INFO.tagline}</p>
        </div>

        <div className="space-y-4 min-h-[300px] flex flex-col justify-center">
          {!showAdminSelect ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 1. تسجيل النظام */}
              <button 
                onClick={() => setShowAdminSelect(true)}
                className="w-full group bg-slate-800/50 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500 shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-500/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-black">تسجيل النظام</h3>
                    <p className="text-xs text-slate-400 group-hover:text-blue-100 font-bold">وصول الإدارة والتحكم الكامل</p>
                  </div>
                </div>
                <ChevronLeft className="text-slate-500 group-hover:text-white transform group-hover:-translate-x-2 transition-all" />
              </button>

              {/* 2. تسجيل جديد */}
              <button 
                onClick={() => navigate('/auth?mode=register&type=CUSTOMER')}
                className="w-full group bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500 shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-500/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                    <UserPlus size={32} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-black">تسجيل جديد</h3>
                    <p className="text-xs text-slate-400 group-hover:text-indigo-100 font-bold">فتح حساب عميل للاستفادة من الخدمات</p>
                  </div>
                </div>
                <ChevronLeft className="text-slate-500 group-hover:text-white transform group-hover:-translate-x-2 transition-all" />
              </button>

              {/* 3. تسجيل الدخول */}
              <button 
                onClick={() => navigate('/auth?mode=login')}
                className="w-full group bg-white text-slate-900 hover:bg-slate-100 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500 shadow-2xl shadow-white/5"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                    <LogIn size={32} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-black">تسجيل الدخول</h3>
                    <p className="text-xs text-slate-500 font-bold">لديك حساب بالفعل؟ ادخل من هنا</p>
                  </div>
                </div>
                <ChevronLeft className="text-slate-900 transform group-hover:-translate-x-2 transition-all" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                 <h2 className="text-xl font-black text-blue-400">اختر حساب المسؤول</h2>
                 <button onClick={() => setShowAdminSelect(false)} className="flex items-center gap-1 text-slate-500 hover:text-white text-sm font-bold transition-all">
                    العودة <ArrowRight size={16} />
                 </button>
              </div>

              {/* أدمن شاهر */}
              <button 
                onClick={() => navigate('/auth?mode=login&admin=shaher')}
                className="w-full group bg-slate-800/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-500/20 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                  <User size={32} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-lg font-black">أدمن شاهر</h3>
                  <p className="text-xs text-slate-400 group-hover:text-blue-100 font-bold tracking-widest uppercase">Shaher Magde</p>
                </div>
                <ChevronLeft className="text-slate-600 group-hover:text-white transition-all" />
              </button>

              {/* أدمن مصطفى */}
              <button 
                onClick={() => navigate('/auth?mode=login&admin=mostfa')}
                className="w-full group bg-slate-800/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-indigo-500/20 group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                  <User size={32} />
                </div>
                <div className="text-right flex-1">
                  <h3 className="text-lg font-black">أدمن مصطفى</h3>
                  <p className="text-xs text-slate-400 group-hover:text-indigo-100 font-bold tracking-widest uppercase">Mostfa Eldarsh</p>
                </div>
                <ChevronLeft className="text-slate-600 group-hover:text-white transition-all" />
              </button>
            </div>
          )}
        </div>

        <div className="pt-8 flex justify-center gap-8 text-slate-500 opacity-50">
           <Smartphone size={24} />
           <Wallet size={24} />
           <ShoppingBag size={24} />
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">براند ستور &copy; {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
