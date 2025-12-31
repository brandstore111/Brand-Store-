
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, CheckCircle2, AlertCircle, Send, Loader2, ReceiptText } from 'lucide-react';
import { SERVICES_LIST } from '../constants';
import { api } from '../api';
import { useAppContext } from '../context/AppContext';

const ServiceForm: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { updateBalance } = useAppContext();
  const service = SERVICES_LIST.find(s => s.id === serviceId);

  const [step, setStep] = useState<'FORM' | 'CONFIRM' | 'SUCCESS' | 'ERROR'>('FORM');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [formData, setFormData] = useState({
    number: '',
    amount: '',
    pin: '',
    provider: ''
  });

  const handleNext = () => {
    if (!formData.number || !formData.amount) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setStep('CONFIRM');
  };
  
  const handleProcess = async () => {
    setLoading(true);
    try {
      const result = await api.payment.process({
        amount: parseFloat(formData.amount),
        method: 'WALLET',
        description: `${service?.name} للرقم ${formData.number}`,
        target: formData.number,
        type: 'PAYMENT'
      });

      if (result.success) {
        setResponse(result);
        if (result.newBalance !== undefined) updateBalance(result.newBalance);
        setStep('SUCCESS');
      } else {
        setResponse(result);
        setStep('ERROR');
      }
    } catch (err) {
      setStep('ERROR');
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div>Service not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowRight className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-black text-gray-800">{service.name}</h1>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        {step === 'FORM' && (
          <div className="p-8 space-y-6">
            <div className={`w-20 h-20 rounded-3xl ${service.color} mx-auto flex items-center justify-center text-white shadow-2xl`}>
              {React.cloneElement(service.icon as React.ReactElement, { size: 40 })}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 mr-2">رقم الهاتف / رقم المشترك</label>
                <div className="relative">
                  <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                    value={formData.number}
                    onChange={e => setFormData({...formData, number: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 mr-2">المبلغ (ج.م)</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">ج.م</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 pr-16 pl-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-xl"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              متابعة العملية <Send size={20} className="rotate-180" />
            </button>
          </div>
        )}

        {step === 'CONFIRM' && (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-black text-center text-gray-800">تأكيد العملية</h2>
            <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">الخدمة</span>
                <span className="font-black text-gray-800">{service.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">الرقم</span>
                <span className="font-black text-gray-800">{formData.number}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-500 font-black text-lg">المبلغ الإجمالي</span>
                <span className="font-black text-2xl text-blue-600">{formData.amount} ج.م</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 mr-2">كلمة المرور (للتأكيد)</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.pin}
                onChange={e => setFormData({...formData, pin: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={loading}
                onClick={() => setStep('FORM')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-4 rounded-2xl transition-all"
              >تعديل</button>
              <button 
                disabled={loading}
                onClick={handleProcess}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'تأكيد ودفع'}
              </button>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={60} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">تمت العملية بنجاح!</h2>
              <p className="text-gray-500 font-bold">{response?.message}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl text-sm space-y-2">
              <p className="flex justify-between"><span>رقم العملية:</span> <span className="font-black text-blue-600">#{response?.transactionId}</span></p>
              <p className="flex justify-between"><span>الرصيد المتبقي:</span> <span className="font-black">{response?.newBalance?.toLocaleString()} ج.م</span></p>
              <p className="flex justify-between"><span>التاريخ:</span> <span className="font-black">{new Date().toLocaleString('ar-EG')}</span></p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
               العودة للرئيسية <ReceiptText size={20} />
            </button>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={60} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">فشلت العملية</h2>
              <p className="text-gray-500 font-bold">{response?.message || 'لم نتمكن من إتمام العملية حالياً. يرجى مراجعة الرصيد أو المحاولة مرة أخرى.'}</p>
            </div>
            <button 
              onClick={() => setStep('FORM')}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl transition-all"
            >المحاولة مرة أخرى</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceForm;
