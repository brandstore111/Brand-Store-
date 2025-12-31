
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, Languages } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { APP_INFO } from '../constants';

// Fix: SupportBot component with corrected Gemini API integration
const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'يا أهلاً بيك يا زميلي في براند ستور! أنا "دغري" أخوك البورسعيدي.. أؤمرني يا دغري، عايز تشحن ولا مديونيتك مضايقاك؟ ولا أكلمك رسمي شوية؟' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dialect, setDialect] = useState<'PORT_SAIDI' | 'FORMAL'>('PORT_SAIDI');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Fix: Strictly use new GoogleGenAI({ apiKey: process.env.API_KEY })
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        أنت "دغري"، بوت الدعم الفني لمحل "براند ستور" (Brand Store) الموجود في بورسعيد (شارع محمد علي والنصر أمام كراكيب).
        أنت خبير في كل خدمات المحل: 
        1. شحن الهواء وفواتير الموبايل.
        2. خدمات فودافون كاش وكافة المحافظ الذكية.
        3. خدمات إنستا باي (InstaPay).
        4. المديونيات: المحفظة في التطبيق تسمح بالرصيد السالب لتسجيل المديونيات.
        5. المتجر: نبيع إكسسوارات موبايل (جملة وقطاعي).
        
        تعليمات الشخصية:
        - إذا كان المستخدم اختار اللهجة البورسعيدية (PORT_SAIDI): تكلم كبورسعيدي أصيل، استخدم كلمات مثل (يا دغري، يا زميلي، الشباب، على الميه، بورسعيد بلدنا). كن ودوداً جداً وشجع العميل.
        - إذا كان المستخدم اختار اللهجة الرسمية (FORMAL): تكلم بالعربية الفصحى بأسلوب مهني وراقي.
        - رقم الدعم هو 01274790388 ومصطفى Eldarsh وشاهر Magde هم أصحاب المكان.
        
        اللهجة الحالية المطلوبة: ${dialect}.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction }
      });

      // Fix: Extract text directly using the .text property (not a method)
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'معلش يا زميلي، الشبكة مريحة.. قول تاني كدة؟' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'يا ساتر! حصل مشكلة في السلوك.. كلمنا فون أحسن على ' + APP_INFO.supportPhone }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[100] animate-bounce hover:scale-110 transition-transform active:scale-95 border-4 border-white"
      >
        <MessageCircle size={32} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 rounded-[2.5rem] border border-slate-800">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="font-black">دغري - الدعم الذكي</h3>
                <p className="text-[10px] opacity-70 font-bold">بورسعيدي أصلي يخلص لك كل حاجة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setDialect(prev => prev === 'PORT_SAIDI' ? 'FORMAL' : 'PORT_SAIDI')}
                 className="p-2 hover:bg-white/10 rounded-xl transition-all"
                 title="تغيير اللهجة"
               >
                 <Languages size={20} />
               </button>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#020617]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-4 rounded-3xl flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-6 bg-slate-900 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder={dialect === 'PORT_SAIDI' ? "قول يا زميلي عايز إيه.." : "كيف يمكنني مساعدتك؟"}
                className="w-full bg-slate-950 text-white p-4 pr-6 pl-14 rounded-2xl text-sm font-bold border border-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button 
                onClick={handleSend}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-600 mt-3 font-bold">بواسطة "دغري" AI - براند ستور بورسعيد</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportBot;
