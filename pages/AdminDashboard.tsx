
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Settings, 
  CheckCircle,
  XCircle,
  Database,
  ArrowRightLeft,
  Clock,
  Smartphone,
  Wallet as WalletIcon,
  CreditCard,
  Search,
  MoreHorizontal,
  Bell,
  Check,
  X,
  Zap,
  Lock,
  RefreshCcw,
  Eye,
  UserCheck,
  Ban,
  User as UserIcon,
  ChevronLeft
} from 'lucide-react';
import { api } from '../api';
import { User, Transaction, UserStatus } from '../types';
import { APP_INFO, SERVICES_LIST } from '../constants';
import { useAppContext } from '../context/AppContext';

const AdminDashboard: React.FC = () => {
  const { theme } = useAppContext();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'USERS' | 'SERVICES' | 'SYSTEM'>('OVERVIEW');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    const [userData, transData, statData] = await Promise.all([
      api.admin.getUsers(),
      api.admin.getTransactions(),
      api.admin.getSystemStats()
    ]);
    setUsers(userData);
    setTransactions(transData);
    setStats(statData);
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'ORDERS') setOrderSearchQuery('');
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: 'SUCCESS' | 'FAILED') => {
    setProcessingId(id);
    await api.admin.updateTransactionStatus(id, status);
    await loadAdminData();
    setProcessingId(null);
  };

  const filteredTransactions = transactions.filter(tr => 
    tr.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
    (tr.userName && tr.userName.toLowerCase().includes(orderSearchQuery.toLowerCase()))
  );

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  if (loading && activeTab === 'OVERVIEW') {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-600">مركز القيادة يفتح أبوابه...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Tab Navigation - Scrollable Mobile Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sticky top-0 z-20 bg-inherit py-2">
        {[
          { id: 'OVERVIEW', label: 'نظرة عامة', icon: <Activity size={18}/> },
          { id: 'ORDERS', label: 'الطلبات', icon: <Clock size={18}/> },
          { id: 'USERS', label: 'المستخدمين', icon: <Users size={18}/> },
          { id: 'SERVICES', label: 'الخدمات', icon: <Zap size={18}/> },
          { id: 'SYSTEM', label: 'الإعدادات', icon: <Settings size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap border ${
              activeTab === tab.id 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
              : `${cardBg}`
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'أرصدة المستخدمين', value: `${stats?.totalBalance.toLocaleString()} ج.م`, icon: <Database />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'طلبات قيد المراجعة', value: stats?.pendingOrders, icon: <Clock />, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'إجمالي العمليات', value: stats?.totalTransactions, icon: <ArrowRightLeft />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'مستخدمين جدد', value: stats?.pendingUsers, icon: <UserCheck />, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((kpi, idx) => (
              <div key={idx} className={`p-5 rounded-3xl border ${cardBg}`}>
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-3`}>
                  {React.cloneElement(kpi.icon as React.ReactElement, { size: 20 })}
                </div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">{kpi.label}</p>
                <p className={`text-sm font-black ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Action Grid */}
          <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
            <h3 className="font-black text-lg mb-6">إجراءات الإدارة السريعة</h3>
            <div className="grid grid-cols-2 gap-3">
               <button className="p-4 rounded-2xl bg-blue-50 text-blue-600 font-black text-xs flex flex-col items-center gap-2">
                 <RefreshCcw size={20} /> تحديث الأسعار
               </button>
               <button className="p-4 rounded-2xl bg-orange-50 text-orange-600 font-black text-xs flex flex-col items-center gap-2">
                 <Bell size={20} /> تنبيه للكل
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="رقم العملية أو اسم العميل..." 
              className={`w-full border-none rounded-2xl py-4 pr-11 pl-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 shadow-sm bg-slate-950 text-white`} 
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3">
             {filteredTransactions.map(tr => (
               <div key={tr.id} className={`p-5 rounded-3xl border space-y-4 ${cardBg}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tr.type === 'RECHARGE' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {tr.type === 'RECHARGE' ? <Smartphone size={20} /> : <WalletIcon size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-sm">{tr.description}</p>
                        <p className="text-[10px] text-slate-500 font-bold">#{tr.id} • {new Date(tr.createdAt).toLocaleTimeString('ar-EG')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${
                      tr.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                      tr.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tr.status === 'SUCCESS' ? 'مكتمل' : tr.status === 'PENDING' ? 'قيد المراجعة' : 'فاشل'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                       <p className="text-[10px] text-slate-400 font-bold">العميل</p>
                       <p className="text-xs font-black">{tr.userName} ({tr.targetNumber || '-'})</p>
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] text-slate-400 font-bold">المبلغ</p>
                       <p className="text-sm font-black text-blue-600">{tr.amount} ج.م</p>
                    </div>
                  </div>

                  {tr.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleUpdateStatus(tr.id, 'SUCCESS')}
                        className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> قبول
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(tr.id, 'FAILED')}
                        className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2"
                      >
                        <X size={16} /> رفض
                      </button>
                    </div>
                  )}
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Same logic applies to USERS and SERVICES tabs - simplifying for mobile views */}
      {(activeTab === 'USERS' || activeTab === 'SERVICES' || activeTab === 'SYSTEM') && (
        <div className={`p-8 rounded-[2rem] border text-center ${cardBg}`}>
           <Settings size={48} className="mx-auto text-blue-600 mb-4 animate-spin-slow" />
           <p className="font-black text-sm">شاشة {activeTab} قيد التجهيز للهواتف</p>
           <p className="text-xs font-bold text-slate-400 mt-2">يرجى استخدام الوضع الرأسي للهاتف</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
