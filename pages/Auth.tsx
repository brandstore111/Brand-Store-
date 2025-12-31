
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Phone, User, Eye, EyeOff, Camera, ImagePlus, Loader2, X, FileText, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { useAppContext } from '../context/AppContext';
import { APP_INFO } from '../constants';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, theme } = useAppContext();

  // Get initial mode from URL params
  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const initialType = (searchParams.get('type') as any) || 'CUSTOMER';
  const selectedAdmin = searchParams.get('admin');

  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    idFront: '',
    idBack: '',
    personalPhoto: '',
    type: initialType
  });

  useEffect(() => {
    // Handle URL param updates
    const mode = searchParams.get('mode');
    const admin = searchParams.get('admin');
    const type = searchParams.get('type');

    setIsLogin(mode !== 'register');
    
    if (admin === 'shaher') {
      setFormData(prev => ({ ...prev, email: 'shahermagdee@gmail.com', phone: '01010452456', password: '', type: 'ADMIN' }));
    } else if (admin === 'mostfa') {
      setFormData(prev => ({ ...prev, email: 'mostfa@mail.com', phone: '01274790388', password: '', type: 'ADMIN' }));
    } else {
      setFormData(prev => ({ ...prev, type: type || 'CUSTOMER' }));
    }
  }, [location.search]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idFront' | 'idBack' | 'personalPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !acceptedTerms) {
      alert('يرجى الموافقة على الشروط والأحكام للمتابعة');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        // Use either email or phone for identification as per mock API
        const identifier = formData.email || formData.phone;
        const user = await api.auth.login(identifier, formData.password);
        setUser(user);
        if (user.type === 'ADMIN') navigate('/admin');
        else navigate('/dashboard');
      } else {
        await api.auth.register(formData);
        setRegistrationSuccess(true);
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء المصادقة');
    } finally {
      setLoading(false);
    }
  };

  // حقول الإدخال المشتركة بتصميم عالي التباين (خلفية سوداء، نص أبيض)
  const inputClasses = `w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-2xl py-4 pr-11 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm shadow-inner`;

  if (registrationSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-600 to-indigo-900'}`}>
        <div className={`max-w-md w-full rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in duration-500 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-800'}`}>
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={64} />
           </div>
           <h2 className="text-3xl font-black mb-4 tracking-tighter">طلبك قيد المراجعة</h2>
           <p className={`font-bold mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
             تم استلام بياناتك بنجاح. سنقوم بمراجعة مستندات الهوية وتفعيل حسابك كـ {formData.type === 'MERCHANT' ? 'تاجر' : 'عميل'} خلال ٢٤ ساعة.
           </p>
           <button 
             onClick={() => navigate('/')}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all"
           >
             العودة للرئيسية
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#020617]' : 'bg-slate-900'}`}>
      <div className={`max-w-md w-full rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border border-slate-800' : 'bg-white'}`}>
        <button onClick={() => navigate('/')} className={`absolute top-6 right-6 p-2 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
          <ArrowRight size={24} />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-blue-600 mb-2 tracking-tighter uppercase">{APP_INFO.name}</h1>
            <p className={`font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              {isLogin 
                ? (selectedAdmin ? `دخول المسؤول: ${selectedAdmin === 'shaher' ? 'شاهر' : 'مصطفى'}` : 'تسجيل الدخول')
                : (formData.type === 'MERCHANT' ? 'تسجيل نظام جديد' : 'فتح حساب عميل')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-1 uppercase">البريد الالكتروني أو الهاتف</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      readOnly={!!selectedAdmin}
                      placeholder="example@mail.com أو 01xxxx"
                      className={`${inputClasses} ${selectedAdmin ? 'opacity-70 cursor-not-allowed' : ''}`}
                      value={formData.email || formData.phone}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-1 uppercase">كلمه المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus={!!selectedAdmin}
                      placeholder="••••••••"
                      className={`${inputClasses} pl-11`}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {selectedAdmin && (
                    <p className="text-[10px] font-bold text-blue-500 mt-2 px-1 italic">
                      يرجى إدخال كلمة المرور المخصصة لحسابك للمتابعة.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-1 uppercase">الاسم رباعي</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكامل (رباعي)"
                      className={inputClasses}
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-1 uppercase">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      required
                      placeholder="01xxxxxxxxx"
                      className={inputClasses}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 mr-1 uppercase">كلمه المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className={`${inputClasses} pl-11`}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 mr-1 uppercase">وش البطاقه</label>
                    <label className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                      {formData.idFront ? <img src={formData.idFront} className="w-full h-full object-cover" /> : <ImagePlus className="text-gray-400" />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} required />
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 mr-1 uppercase">ضهر البطاقه</label>
                    <label className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                      {formData.idBack ? <img src={formData.idBack} className="w-full h-full object-cover" /> : <ImagePlus className="text-gray-400" />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'idBack')} required />
                    </label>
                  </div>
                </div>

                <div className="space-y-3 px-1 py-2">
                  <label className={`flex items-start gap-3 text-xs cursor-pointer group ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="font-bold leading-tight group-hover:text-blue-600 transition-colors">
                      أوافق على <button type="button" onClick={() => setShowTerms(true)} className="text-blue-600 underline">الشروط والاحكام</button> لـ {formData.type === 'MERCHANT' ? 'نظام التجار' : 'حساب العملاء'}
                    </span>
                  </label>
                </div>
              </>
            )}

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'أدخل'}
            </button>
          </form>

          {!selectedAdmin && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className={`font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 font-black mr-2 hover:underline"
                >
                  {isLogin ? 'أنشئ حساباً' : 'سجل دخولك'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowTerms(false)}></div>
          <div className={`relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-white'}`}>
            <div className={`p-8 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className="text-2xl font-black">الشروط والاحكام العامة</h3>
              <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-400">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 text-right leading-relaxed">
              <section className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100/50'}`}>
                <h4 className="text-blue-700 font-black mb-2">١. صحة البيانات</h4>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>يقر المستخدم بأن جميع البيانات والمعلومات المدخلة صحيحة تماماً.</p>
              </section>
              <section className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100/50'}`}>
                <h4 className="text-blue-700 font-black mb-2">٢. المسؤولية القانونية</h4>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>يؤكد المستخدم مسؤوليته التامة عن كافة العمليات التي تتم من خلال حسابه.</p>
              </section>
            </div>
            <div className={`p-8 border-t ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
              <button 
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTerms(false);
                }}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg"
              >أوافق على كافة الشروط</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
