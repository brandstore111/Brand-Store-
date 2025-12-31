
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Tag, Plus, Minus, ShoppingBag, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../constants';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');
  const [priceType, setPriceType] = useState<'RETAIL' | 'WHOLESALE'>('RETAIL');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  
  const { addToCart, removeFromCart, cart, clearCart, updateBalance, user } = useAppContext();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await api.marketplace.getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const cartTotal = cart.reduce((acc, item) => {
    const price = priceType === 'RETAIL' ? item.product.retailPrice : item.product.wholesalePrice;
    return acc + (price * item.qty);
  }, 0);

  const handleCheckout = async () => {
    if (cartTotal > (user?.walletBalance || 0)) {
      alert('رصيد المحفظة غير كافٍ');
      return;
    }
    
    setCheckoutStatus('PROCESSING');
    try {
      const result = await api.marketplace.checkout(cart, cartTotal);
      if (result.success) {
        setCheckoutResult(result);
        if (result.newBalance !== undefined) updateBalance(result.newBalance);
        clearCart();
        setCheckoutStatus('SUCCESS');
      } else {
        setCheckoutResult(result);
        setCheckoutStatus('ERROR');
      }
    } catch (err) {
      setCheckoutStatus('ERROR');
    }
  };

  const filteredProducts = products.filter(p => 
    (filter === 'الكل' || p.category === filter) &&
    (p.name.includes(search))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Cart Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">متجر الإكسسوارات</h1>
          <p className="text-gray-500">جملة وقطاعي بأفضل الأسعار</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setPriceType('RETAIL')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${priceType === 'RETAIL' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >قطاعي</button>
            <button 
              onClick={() => setPriceType('WHOLESALE')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${priceType === 'WHOLESALE' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >جملة</button>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-blue-600"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" /> الفئات
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilter('الكل')}
                className={`w-full text-right px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'الكل' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >الكل</button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full text-right px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === cat ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >{cat}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full bg-white border-gray-100 rounded-2xl py-4 pr-12 pl-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                      <span className="text-xs font-black text-blue-600">{product.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-lg text-gray-800 mb-2 truncate">{product.name}</h4>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-blue-600">
                        <span className="text-2xl font-black">
                          {priceType === 'RETAIL' ? product.retailPrice : product.wholesalePrice}
                        </span>
                        <span className="text-xs font-bold mr-1">ج.م</span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">الكمية: {product.quantity}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> إضافة للسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold">لم يتم العثور على منتجات مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <ShoppingCart className="text-blue-600" /> سلة التسوق
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkoutStatus === 'SUCCESS' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black">تم الدفع بنجاح!</h3>
                  <p className="text-gray-500 font-bold">رقم العملية: {checkoutResult?.transactionId}</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStatus('IDLE');
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black"
                  >حسناً</button>
                </div>
              ) : checkoutStatus === 'ERROR' ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-red-600">فشل الطلب</h3>
                  <p className="text-gray-500 font-bold">{checkoutResult?.message || 'حدث خطأ غير متوقع'}</p>
                  <button 
                    onClick={() => setCheckoutStatus('IDLE')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black"
                  >المحاولة مجدداً</button>
                </div>
              ) : cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                    <img src={item.product.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.product.name}</h4>
                      <p className="text-sm text-blue-600 font-black">
                        {priceType === 'RETAIL' ? item.product.retailPrice : item.product.wholesalePrice} ج.م × {item.qty}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-red-500 font-bold mt-2 hover:underline"
                      >إزالة</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={64} />
                  <p className="font-bold">السلة فارغة حالياً</p>
                </div>
              )}
            </div>

            {cart.length > 0 && checkoutStatus === 'IDLE' && (
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold">الإجمالي</span>
                  <span className="text-2xl font-black text-blue-600">{cartTotal.toLocaleString()} ج.م</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={checkoutStatus === 'PROCESSING'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {checkoutStatus === 'PROCESSING' ? <Loader2 className="animate-spin" /> : 'إتمام الشراء والدفع'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
