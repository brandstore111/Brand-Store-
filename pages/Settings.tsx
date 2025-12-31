
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Shield, Moon, Sun, Bell, Phone, Info, ChevronLeft, LogOut, Lock, FileText, CheckCircle, X, Languages } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { APP_INFO } from '../constants';

const Settings: React.FC = () => {
  const { user, theme, toggleTheme, language, toggleLanguage, logout } = useAppContext();
  const navigate = useNavigate();
  const [showIdentity, setShowIdentity] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  const t = {
    settings: language === 'ar' ? 'الإعدادات' : 'Settings',
    profile: language === 'ar' ? 'الملف الشخصي' : 'Profile',
    account: language === 'ar' ? 'الحساب والحماية' : 'Account & Security',
    kyc: language === 'ar' ? 'وثائق تحقيق الشخصية' : 'Identity Documents',
    password: language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
    app: language === 'ar' ? 'التطبيق والمظهر' : 'App & Appearance',
    lang: language === 'ar' ? 'اللغة' : 'Language',
    theme: language === 'ar' ? 'المظهر' : 'Theme',
    support: language === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Support',
    logout: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
    verified: language === 'ar' ? 'موثق' : 'Verified',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
          <ChevronLeft className={`transform ${language === 'en' ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`} />
        </button>
        <h1 className="text-3xl font-black">{t.settings}</h1>
      </div>

      {/* Profile Card */}
      <div className={`p-6 rounded-[2.5rem] border shadow-xl flex items-center gap-5 ${cardBg}`}>
        <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white overflow-hidden shadow-lg border-2 border-white">
          {user?.personalPhoto ? (
            <img src={user.personalPhoto} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-black">{user?.fullName.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-black">{user?.fullName}</h2>
          <p className={`text-sm font-bold ${textSecondary}`}>{user?.phone}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{user?.type}</span>
            {user?.idFront && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                <CheckCircle size={12} /> {t.verified}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        <h3 className={`text-xs font-black uppercase tracking-widest px-2 ${textSecondary}`}>{t.account}</h3>
        <div className={`rounded-[2rem] border overflow-hidden shadow-sm ${cardBg}`}>
          <button 
            onClick={() => setShowIdentity(true)}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-100"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <FileText size={20} />
               </div>
               <span className="font-black text-sm">{t.kyc}</span>
            </div>
            <ChevronLeft size={16} className={`text-slate-300 transform ${language === 'en' ? 'rotate-180' : ''}`} />
          </button>

          <button className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                 <Lock size={20} />
               </div>
               <span className="font-black text-sm">{t.password}</span>
            </div>
            <ChevronLeft size={16} className={`text-slate-300 transform ${language === 'en' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <h3 className={`text-xs font-black uppercase tracking-widest px-2 mt-6 ${textSecondary}`}>{t.app}</h3>
        <div className={`rounded-[2rem] border overflow-hidden shadow-sm ${cardBg}`}>
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-100">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                 <Languages size={20} />
               </div>
               <span className="font-black text-sm">{t.lang}</span>
            </div>
            <span className="text-xs font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-lg uppercase">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          <button onClick={toggleTheme} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-100">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </div>
               <span className="font-black text-sm">{t.theme}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? (language === 'ar' ? 'left-1' : 'right-1') : (language === 'ar' ? 'left-7' : 'right-7')}`}></div>
            </div>
          </button>
          
          <button onClick={() => window.open(`tel:${APP_INFO.supportPhone}`)} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                 <Phone size={20} />
               </div>
               <span className="font-black text-sm">{t.support}</span>
            </div>
            <ChevronLeft size={16} className={`text-slate-300 transform ${language === 'en' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="pt-8">
          <button 
            onClick={handleLogout}
            className="w-full p-5 rounded-[1.5rem] bg-red-50 text-red-600 font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm border border-red-100"
          >
            <LogOut size={20} /> {t.logout}
          </button>
        </div>
      </div>

      {/* Identity Documents Modal */}
      {showIdentity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowIdentity(false)}></div>
           <div className={`relative w-full max-w-lg rounded-[2.5rem] p-8 overflow-y-auto max-h-[90vh] ${cardBg}`}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black">{t.kyc}</h3>
                 <button onClick={() => setShowIdentity(false)} className="p-2 text-slate-500"><X /></button>
              </div>
              
              <div className="space-y-6">
                 <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 flex items-start gap-3">
                    <CheckCircle className="shrink-0 mt-1" size={18} />
                    <p className="text-xs font-bold leading-relaxed">هذه الوثائق تُستخدم فقط للتحقق من هويتك وتأمين عملياتك المالية داخل براند ستور.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase mr-1">وجه البطاقة</p>
                       <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                          {user?.idFront ? <img src={user.idFront} className="w-full h-full object-contain" /> : <span className="text-slate-600 font-bold">لم ترفع صورة بعد</span>}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase mr-1">ظهر البطاقة</p>
                       <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                          {user?.idBack ? <img src={user.idBack} className="w-full h-full object-contain" /> : <span className="text-slate-600 font-bold">لم ترفع صورة بعد</span>}
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowIdentity(false)}
                   className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
                 >حسناً</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
