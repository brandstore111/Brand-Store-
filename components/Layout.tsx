
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Wallet, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Settings as SettingsIcon,
  PlusCircle,
  LayoutDashboard,
  Store,
  BarChart3,
  Package,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { APP_INFO } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'الرئيسية', icon: <LayoutDashboard size={20}/>, path: '/dashboard', roles: ['CUSTOMER', 'MERCHANT', 'ADMIN'] },
    { label: 'المتجر', icon: <ShoppingBag size={20}/>, path: '/marketplace', roles: ['CUSTOMER', 'MERCHANT', 'ADMIN'] },
    { label: 'المحفظة', icon: <Wallet size={20}/>, path: '/wallet', roles: ['CUSTOMER', 'MERCHANT', 'ADMIN'] },
    { label: 'إدارة المتجر', icon: <Store size={20}/>, path: '/merchant', roles: ['MERCHANT', 'ADMIN'] },
    { label: 'لوحة التحكم', icon: <ShieldCheckIcon size={20}/>, path: '/admin', roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.type));

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className={`flex h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`} dir="rtl">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0f172a] text-white p-6 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10 border-b border-slate-700 pb-6 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">B</div>
            <h1 className="text-xl font-black tracking-widest uppercase">{APP_INFO.name}</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700 space-y-2">
          <button onClick={toggleTheme} className="w-full flex lg:hidden items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-bold text-sm">{theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <SettingsIcon size={20} />
            <span className="font-bold text-sm">الإعدادات</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-950 transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className={`h-20 border-b px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-72 lg:w-96">
              <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث عن طلب، مستخدم، أو عملية..." 
                className={`w-full border-none rounded-xl pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle Desktop */}
            <button 
              onClick={toggleTheme}
              className={`hidden lg:flex p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="hidden sm:flex flex-col items-end px-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">رصيد المحفظة</p>
              <p className="text-sm font-black text-blue-600">{user?.walletBalance.toLocaleString()} ج.م</p>
            </div>
            
            <div className={`p-2.5 rounded-xl relative cursor-pointer transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-blue-50 text-slate-600'}`}>
              <Bell size={20} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
            
            <div className={`flex items-center gap-3 p-1.5 pr-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user?.fullName.split(' ')[0]}</p>
                <p className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-center font-bold uppercase">{user?.type}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-md">
                {user?.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className={`fixed bottom-0 inset-x-0 border-t lg:hidden px-6 py-4 flex items-center justify-between shadow-2xl z-40 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
           {filteredNavItems.slice(0, 4).map(item => (
             <button
               key={item.path}
               onClick={() => navigate(item.path)}
               className={`flex flex-col items-center gap-1 transition-all ${location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'}`}
             >
               {React.cloneElement(item.icon as React.ReactElement, { size: 22, strokeWidth: location.pathname === item.path ? 2.5 : 2 })}
               <span className="text-[10px] font-black">{item.label}</span>
             </button>
           ))}
        </nav>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[45] bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

const ShieldCheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Layout;
