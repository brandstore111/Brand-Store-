
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
  Bell,
  AlertCircle,
  TrendingDown
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
  
  // التحقق من حالة المديونية
  const isDebt = (user?.walletBalance || 0) < 0;
  const balanceValue = Math.abs(user?.walletBalance || 0);

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Mobile Header Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white overflow-hidden shadow-lg border-2 border-white">
            {user?.personalPhoto ? (
              <img src={user.personalPhoto} className="w-full h-full object-cover" />
            ) : (
              <span className="font-black">{user?.fullName.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">أهلاً بك مجدداً</p>
            <h2 className={`text-lg font-black ${textPrimary}`}>{user?.fullName.split(' ')[0] || 'عميلنا'} 👋</h2>
          </div>
        </div>
        <div className={`p-2.5 rounded-2xl border flex items-center justify-center relative ${cardBg}`}>
          <Bell size={20} className="text-blue-600" />
          <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
      </div>

      {/* Main Wallet/Debt Card */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl transition-all duration-500 ${
        isDebt 
        ? 'bg-gradient-to-br from-red-600 to-rose-900 shadow-red-500/20' 
        : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20'
      }`}>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs font-bold mb-1">
                {isDebt ? 'إجمالي المديونية' : 'الرصيد المتاح'}
              </p>
              <h3 className="text-4xl font-black tracking-tighter">
                {isDebt && <span className="text-2xl ml-1">-</span>}
                {balanceValue.toLocaleString()} 
                <span className="text-sm font-bold opacity-80 mr-1">ج.م</span>
              </h3>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              {isDebt ? <TrendingDown size={24} /> : <WalletIcon size={24} />}
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => navigate('/wallet/deposit')}
               className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
             >
               {isDebt ? 'سداد المديونية' : 'شحن المحفظة'}
             </button>
             <button className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 rounded-2xl font-black text-sm border border-white/20 active:scale-95 transition-all">
               التفاصيل
             </button>
          </div>
        </div>
        {isDebt && (
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-black/20 p-2 rounded-xl">
            <AlertCircle size={14} />
            <span>يرجى سداد المبلغ المستحق لتجنب حظر الخدمات</span>
          </div>
        )}
      </div>

      {/* Services Section */}
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
               <span className="text-[10px] font-black uppercase">آخر سداد</span>
            </div>
            <p className={`text-lg font-black ${textPrimary}`}>0 ج.م</p>
         </div>
         <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-red-500 mb-2">
               <TrendingDown size={16} />
               <span className="text-[10px] font-black uppercase">آخر سحب</span>
            </div>
            <p className={`text-lg font-black ${textPrimary}`}>{transactions[0]?.amount || 0} ج.م</p>
         </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-lg font-black ${textPrimary}`}>سجل المديونية</h3>
          <button onClick={() => navigate('/wallet')} className="text-blue-600 font-bold text-xs">عرض السجل</button>
        </div>
        
        <div className="space-y-3">
          {loading ? (
             [1,2,3].map(i => <div key={i} className={`h-20 rounded-3xl animate-pulse ${cardBg}`}></div>)
          ) : transactions.map(tr => (
            <div key={tr.id} className={`p-4 rounded-3xl border flex items-center justify-between active:bg-slate-50 transition-colors ${cardBg}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  tr.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {tr.type === 'DEPOSIT' ? <Plus size={24} /> : <TrendingDown size={24} />}
                </div>
                <div>
                  <p className={`font-black text-sm ${textPrimary}`}>{tr.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                     <Clock size={10} />
                     <span>{new Date(tr.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className={`font-black text-sm ${tr.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tr.type === 'DEPOSIT' ? '+' : '-'}{tr.amount} ج.م
                </p>
                <ChevronLeft size={16} className="text-slate-300 inline-block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
