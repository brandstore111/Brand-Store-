
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  X, 
  ArrowRight, 
  AlertCircle, 
  UserCircle2, 
  FileText 
} from 'lucide-react';
import { api } from '../api';
import { useAppContext } from '../context/AppContext';
import { APP_INFO } from '../constants';

// Fix: Completed Auth component with login/register logic and added default export
const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, theme, rememberedAccounts, addRememberedAccount, removeRememberedAccount } = useAppContext();

  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'register' ? 'REGISTER' : 'LOGIN';
  const adminParam = queryParams.get('admin');

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    identifier: adminParam === 'shaher' ? '01010452456' : adminParam === 'mostfa' ? '01274790388' : '',
    password: adminParam === 'shaher' ? '0000#' : adminParam === 'mostfa' ? '5555@' : '',
    fullName: '',
    nickname: '',
    email: '',
    phone: '',
    idFront: '',
    idBack: '',
    personalPhoto: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await api.auth.login(formData.identifier, formData.password);
      setUser(user);
      addRememberedAccount(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await api.auth.register(formData);
      setUser(user);
      addRememberedAccount(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (field: string) => {
    // Simulated file upload with placeholder URLs as per api.ts expectations
    const dummyUrl = field === 'personalPhoto' 
      ? 'https://via.placeholder.com/150?text=User' 
      : 'https://via.placeholder.com/400x250?text=ID+Preview';
    setFormData(prev => ({ ...prev, [field]: dummyUrl }));
  };

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900';
  const inputBg = theme === 'dark' ? 'bg-slate-950 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-50'}`} dir="rtl">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div 
            onClick={() => navigate('/')}
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 cursor-pointer mb-6"
          >
            <span className="text-2xl font-black text-white italic">B</span>
          </div>
          <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'LOGIN' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-slate-500 font-bold mt-2">مرحباً بك في {APP_INFO.name}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className={`p-8 rounded-[2.5rem] border shadow-2xl ${cardBg}`}>
          <form onSubmit={mode === 'LOGIN' ? handleLogin : handleRegister} className="space-y-5">
            {mode === 'REGISTER' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">الاسم بالكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className={`w-full rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold ${inputBg}`}
                      placeholder="أدخل اسمك كما في البطاقة"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      className={`w-full rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold ${inputBg}`}
                      placeholder="01xxxxxxxxx"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'LOGIN' && (
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">البريد أو الهاتف</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    className={`w-full rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold ${inputBg}`}
                    placeholder="example@mail.com"
                    value={formData.identifier}
                    onChange={e => setFormData({...formData, identifier: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className={`w-full rounded-2xl py-4 pr-12 pl-12 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold ${inputBg}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'personalPhoto', label: 'الصورة', icon: <UserCircle2 size={24} /> },
                  { id: 'idFront', label: 'وجه البطاقة', icon: <FileText size={24} /> },
                  { id: 'idBack', label: 'ظهر البطاقة', icon: <FileText size={24} /> }
                ].map(file => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => handleFileUpload(file.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed transition-all ${(formData as any)[file.id] ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 text-slate-500 hover:border-blue-600'}`}
                  >
                    {file.icon}
                    <span className="text-[8px] font-black mt-1 text-center">{file.label}</span>
                    {(formData as any)[file.id] && <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>}
                  </button>
                ))}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (mode === 'LOGIN' ? 'دخول' : 'إنشاء حساب')}
              {!isSubmitting && <ArrowRight className="rotate-180" size={18} />}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
             <button 
               onClick={() => setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
               className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
             >
               {mode === 'LOGIN' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخول'}
             </button>
             
             {rememberedAccounts.length > 0 && mode === 'LOGIN' && (
                <div className="w-full pt-6 border-t border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-4">حسابات مسجلة</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {rememberedAccounts.map(acc => (
                      <div 
                        key={acc.id}
                        onClick={() => setFormData({...formData, identifier: acc.phone})}
                        className="flex-shrink-0 flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-blue-600 transition-all group relative"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs overflow-hidden">
                          {acc.photo ? <img src={acc.photo} className="w-full h-full object-cover" /> : acc.fullName.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold truncate max-w-[60px]">{acc.fullName.split(' ')[0]}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeRememberedAccount(acc.id); }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             )}
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto text-slate-500 font-bold hover:text-white transition-all text-sm"
          >
            <ArrowRight size={16} /> العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
