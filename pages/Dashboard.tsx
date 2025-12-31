
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Plus, 
  Smartphone, 
  Wallet as WalletIcon, 
  Clock,
  ChevronLeft,
  ArrowUpRight,
  Zap,
  Bell
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api';
import { Transaction } from '../types';
import { SERVICES_LIST } from '../constants';

const Dashboard: React.FC = () => {
  const { user, theme } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const trs = await api.wallet.getTransactions();
        setTransactions(trs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Mobile Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">أهلاً بك</p>
          <h2 className={`text-xl font-black ${textPrimary}`}>{user?.fullName.split(' ')[0]} 👋</h2>
        </div>
        <div className={`p-2 rounded-xl border ${cardBg}`}>
          <Bell size={20} className="text-blue-600" />
        </div>
      </div>

      {/* Main Wallet Card - Mobile Styled */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs font-bold mb-1">الرصيد المتاح</p>
              <h3 className="text-4xl font-black tracking-tighter">{user?.walletBalance.toLocaleString()} <span className="text-sm font-bold opacity-80">ج.م</span></h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <WalletIcon size={24} />
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => navigate('/wallet/deposit')}
               className="flex-1 bg-white text-blue-600 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
             >
               <Plus size={18} /> شحن المحفظة
             </button>
             <button className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 rounded-2xl font-black text-sm border border-white/20 active:scale-95 transition-all">
               سحب
             </button>
          </div>
        </div>
      </div>

      {/* Services Section - Horizontal Mobile Scroll */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-lg font-black ${textPrimary}`}>خدمات سريعة</h3>
          <button className="text-blue-600 font-bold text-xs">عرض الكل</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4">
          {SERVICES_LIST.map(service => (
            <button
              key={service.id}
              onClick={() => navigate(service.path)}
              className={`flex-shrink-0 w-24 flex flex-col items-center gap-2 group`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${service.color} flex items-center justify-center text-white shadow-lg shadow-current/20 active:scale-90 transition-all`}>
                {React.cloneElement(service.icon as React.ReactElement, { size: 28 })}
              </div>
              <span className={`text-[10px] font-black text-center leading-tight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
               <ArrowUpRight size={16} />
               <span className="text-[10px] font-black uppercase">مبيعات اليوم</span>
            </div>
            <p className={`text-lg font-black ${textPrimary}`}>1,250 ج.م</p>
         </div>
         <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
               <Zap size={16} />
               <span className="text-[10px] font-black uppercase">طلبات</span>
            </div>
            <p className={`text-lg font-black ${textPrimary}`}>12 طلب</p>
         </div>
      </div>

      {/* Recent Activity - Mobile Feed Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-lg font-black ${textPrimary}`}>أحدث العمليات</h3>
          <button onClick={() => navigate('/wallet')} className="text-blue-600 font-bold text-xs">سجل العمليات</button>
        </div>
        
        <div className="space-y-3">
          {loading ? (
             [1,2,3].map(i => <div key={i} className={`h-20 rounded-3xl animate-pulse ${cardBg}`}></div>)
          ) : transactions.map(tr => (
            <div key={tr.id} className={`p-4 rounded-3xl border flex items-center justify-between active:bg-slate-50 transition-colors ${cardBg}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  tr.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {tr.type === 'DEPOSIT' ? <Plus size={24} /> : <Smartphone size={24} />}
                </div>
                <div>
                  <p className={`font-black text-sm ${textPrimary}`}>{tr.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                     <Clock size={10} />
                     <span>{new Date(tr.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                     <span>•</span>
                     <span className={tr.status === 'SUCCESS' ? 'text-emerald-500' : 'text-amber-500'}>
                       {tr.status === 'SUCCESS' ? 'ناجحة' : 'قيد المراجعة'}
                     </span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className={`font-black text-sm ${tr.type === 'DEPOSIT' ? 'text-emerald-500' : textPrimary}`}>
                  {tr.type === 'DEPOSIT' ? '+' : '-'}{tr.amount} ج.م
                </p>
                <ChevronLeft size={16} className="text-slate-300 inline-block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Floating Action Button (Quick Scan/Pay) */}
      <div className="fixed bottom-24 left-6 z-40 md:hidden">
         <button className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center active:scale-90 transition-all">
            <Plus size={32} />
         </button>
      </div>

    </div>
  );
};

export default Dashboard;
