
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  Settings, 
  Clock,
  Smartphone,
  Wallet as WalletIcon,
  Search,
  Check,
  X,
  Zap,
  RefreshCcw,
  Bell,
  Eye,
  UserCheck,
  Ban,
  ShieldAlert,
  FileText,
  ChevronLeft,
  Store,
  Lock,
  Unlock
} from 'lucide-react';
import { api } from '../api';
import { User, Transaction, UserStatus } from '../types';
import { useAppContext } from '../context/AppContext';

const AdminDashboard: React.FC = () => {
  const { theme, systemSettings, updateSystemSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'USERS' | 'SERVICES' | 'SYSTEM'>('OVERVIEW');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [newAppName, setNewAppName] = useState(systemSettings.appName);

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

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    await api.admin.updateUserStatus(userId, status);
    loadAdminData();
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status } : null);
    }
  };

  const updateAppName = () => {
    updateSystemSettings({ 
      appName: newAppName.toUpperCase(),
      lastAction: "تحديث اسم المتجر" 
    });
    alert("تم تغيير اسم العلامة التجارية بنجاح!");
  };

  const toggleSystemStatus = () => {
    updateSystemSettings({ 
      systemOpen: !systemSettings.systemOpen,
      lastAction: "تغيير حالة المتجر" 
    });
  };

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900';
  const inputBg = theme === 'dark' ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200';

  if (loading && activeTab === 'OVERVIEW') {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-600">جاري فتح مركز القيادة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sticky top-0 z-20 bg-inherit py-2">
        {[
          { id: 'OVERVIEW', label: 'نظرة عامة', icon: <Activity size={18}/> },
          { id: 'ORDERS', label: 'الطلبات', icon: <Clock size={18}/> },
          { id: 'USERS', label: 'المستخدمين', icon: <Users size={18}/> },
          { id: 'SYSTEM', label: 'إعدادات المالك', icon: <Settings size={18}/> },
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
              { label: 'أرصدة المستخدمين', value: `${stats?.totalBalance.toLocaleString()} ج.م`, icon: <WalletIcon />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'طلبات قيد المراجعة', value: stats?.pendingOrders, icon: <Clock />, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'إجمالي العمليات', value: stats?.totalTransactions, icon: <RefreshCcw />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
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
        </div>
      )}

      {activeTab === 'SYSTEM' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className={`p-8 rounded-[2.5rem] border shadow-xl ${cardBg}`}>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                    <Store size={24} />
                 </div>
                 <h3 className="text-xl font-black">👑 لوحة تحكم المالك</h3>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-2">تعديل اسم المتجر</label>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          className={`flex-1 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-600 font-black ${inputBg}`}
                          value={newAppName}
                          onChange={(e) => setNewAppName(e.target.value)}
                          placeholder="الاسم الجديد..."
                       />
                       <button 
                          onClick={updateAppName}
                          className="bg-blue-600 text-white px-6 rounded-2xl font-black shadow-lg"
                       >تحديث</button>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800">
                       <div>
                          <p className="text-sm font-black mb-1">حالة المتجر</p>
                          <p className={`text-xs font-bold ${systemSettings.systemOpen ? 'text-emerald-500' : 'text-red-500'}`}>
                             {systemSettings.systemOpen ? '● المتجر متاح الآن للطلبات' : '● المتجر في وضع الصيانة'}
                          </p>
                       </div>
                       <button 
                          onClick={toggleSystemStatus}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${systemSettings.systemOpen ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                       >
                          {systemSettings.systemOpen ? <Lock size={24} /> : <Unlock size={24} />}
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-indigo-600/10 border border-indigo-600/20 p-5 rounded-3xl">
                          <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">إجمالي العملاء</p>
                          <p className="text-xl font-black text-indigo-500">{systemSettings.usersCount}</p>
                       </div>
                       <div className="bg-slate-800 p-5 rounded-3xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">آخر إجراء</p>
                          <p className="text-xs font-black text-white truncate">{systemSettings.lastAction}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="ابحث باسم العميل أو الهاتف..." 
              className="w-full bg-slate-950 text-white rounded-2xl py-4 pr-11 pl-4 text-xs font-bold"
            />
          </div>

          <div className="space-y-3">
            {users.filter(u => u.type === 'CUSTOMER').map(u => (
              <div key={u.id} className={`p-4 rounded-3xl border flex items-center justify-between ${cardBg}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800">
                    {u.personalPhoto ? <img src={u.personalPhoto} className="w-full h-full object-cover" /> : <Users className="text-slate-600 m-auto mt-3" />}
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{u.fullName}</h4>
                    <p className="text-[10px] font-bold text-slate-500">{u.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(u)}
                  className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal (KYC View) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className={`relative w-full max-w-lg rounded-[2.5rem] p-8 overflow-y-auto max-h-[90vh] ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">تفاصيل الهوية</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-500"><X /></button>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-600/10 border border-blue-600/20">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                    <img src={selectedUser.personalPhoto} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">{selectedUser.fullName}</h4>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${selectedUser.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {selectedUser.status === 'ACTIVE' ? 'حساب نشط' : 'قيد المراجعة'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-500 flex items-center gap-2">
                      <FileText size={14} /> وجه البطاقة
                    </p>
                    <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                      {selectedUser.idFront ? <img src={selectedUser.idFront} className="w-full h-full object-contain" /> : <div className="h-full flex items-center justify-center text-slate-700">لا توجد صورة</div>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-500 flex items-center gap-2">
                      <FileText size={14} /> ظهر البطاقة
                    </p>
                    <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                      {selectedUser.idBack ? <img src={selectedUser.idBack} className="w-full h-full object-contain" /> : <div className="h-full flex items-center justify-center text-slate-700">لا توجد صورة</div>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  {selectedUser.status !== 'ACTIVE' && (
                    <button 
                      onClick={() => handleUpdateUserStatus(selectedUser.id, 'ACTIVE')}
                      className="bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
                    >
                      <UserCheck size={20} /> تفعيل الحساب
                    </button>
                  )}
                  <button 
                    onClick={() => handleUpdateUserStatus(selectedUser.id, 'BLOCKED')}
                    className="bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Ban size={20} /> حظر العميل
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
