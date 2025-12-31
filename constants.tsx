
import React from 'react';
import { 
  Smartphone, 
  Wallet, 
  CreditCard, 
  Receipt, 
  Send, 
  ShoppingBag, 
  Users, 
  Settings,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  SmartphoneNfc
} from 'lucide-react';

export const APP_INFO = {
  name: "Brand Store",
  tagline: "منصتك المتكاملة للخدمات المالية",
  address: "محمد علي والنصر أمام كراكيب",
  supportPhone: "01274790388",
  admins: [
    { name: "Shaher Magde", email: "shahermagdee@gmail.com" },
    { name: "Mostfa Eldarsh", phone: "01274790388" }
  ],
  paymentNumbers: {
    vodafone: "01010452456",
    orange: "01274790388"
  }
};

export const SERVICES_LIST = [
  { id: 'recharge', name: 'شحن على الهواء', icon: <Smartphone className="w-6 h-6" />, color: 'bg-blue-500', path: '/service/recharge' },
  { id: 'vodafone-cash', name: 'فودافون كاش', icon: <SmartphoneNfc className="w-6 h-6" />, color: 'bg-red-600', path: '/service/vodafone-cash' },
  { id: 'instapay', name: 'InstaPay', icon: <Send className="w-6 h-6" />, color: 'bg-indigo-600', path: '/service/instapay' },
  { id: 'bills', name: 'دفع فواتير', icon: <Receipt className="w-6 h-6" />, color: 'bg-green-600', path: '/service/bills' },
  { id: 'bank', name: 'إيداع بنكي', icon: <CreditCard className="w-6 h-6" />, color: 'bg-teal-600', path: '/service/bank' },
  { id: 'talabat', name: 'شحن طلبات', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-orange-500', path: '/service/talabat' },
  { id: 'fawry', name: 'فوري باي', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-yellow-500', path: '/service/fawry' },
];

export const CATEGORIES = ['إكسسوارات موبايل', 'شواحن', 'سماعات', 'جرابات', 'أخرى'];
