
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  Upload,
  X,
  Check,
  ChevronLeft,
  DollarSign,
  Loader2
} from 'lucide-react';
import { api } from '../api';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { useAppContext } from '../context/AppContext';

const MerchantDashboard: React.FC = () => {
  const { theme } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    wholesalePrice: '',
    retailPrice: '',
    quantity: '',
    category: CATEGORIES[0],
    image: '',
    available: true
  });

  const loadData = async () => {
    setLoading(true);
    const data = await api.marketplace.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900';

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', wholesalePrice: '', retailPrice: '', quantity: '', category: CATEGORIES[0], image: '', available: true });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Merchant Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
           <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">المخزون</p>
           <p className="text-xl font-black">45,000 <small className="text-[10px] opacity-60">ج.م</small></p>
        </div>
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
           <p className="text-[10px] font-black text-orange-500 uppercase mb-1">نواقص</p>
           <p className="text-xl font-black">{products.filter(p => p.quantity < 5).length} منتجات</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
         <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>منتجاتي</h2>
         <button 
           onClick={() => { resetForm(); setIsModalOpen(true); }}
           className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
         >
           <Plus size={24} />
         </button>
      </div>

      <div className="space-y-4">
         {loading ? (
           <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
         ) : products.map(product => (
            <div key={product.id} className={`p-4 rounded-3xl border flex gap-4 ${cardBg}`}>
               <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt="" />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-bold text-slate-400">{product.category}</span>
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black ${product.available ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {product.available ? 'متاح' : 'مخفي'}
                     </span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                     <p className="text-sm font-black text-blue-600">{product.retailPrice} ج.م</p>
                     <div className="flex gap-2">
                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Edit size={16}/></button>
                        <button className="p-2 bg-red-50 text-red-600 rounded-xl"><Trash2 size={16}/></button>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Simple Modal for Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end">
           <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)}></div>
           <div className={`relative w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black">{editingProduct ? 'تعديل منتج' : 'إضافة منتج'}</h3>
                 <button onClick={() => setIsModalOpen(false)}><X /></button>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400">اسم المنتج</label>
                   <input type="text" className="w-full bg-slate-950 text-white p-4 rounded-2xl text-sm font-bold" defaultValue={editingProduct?.name} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400">سعر الجملة</label>
                      <input type="number" className="w-full bg-slate-950 text-white p-4 rounded-2xl text-sm font-bold" defaultValue={editingProduct?.wholesalePrice} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400">سعر القطاعي</label>
                      <input type="number" className="w-full bg-slate-950 text-white p-4 rounded-2xl text-sm font-bold" defaultValue={editingProduct?.retailPrice} />
                    </div>
                 </div>
                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl mt-4">حفظ المنتج</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default MerchantDashboard;
