
import { User, Product, Transaction, UserType, UserStatus } from './types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated Database
let currentBalance = -500.00;

let mockProducts: Product[] = [
  { id: '1', name: 'شاحن سامسونج 45 وات', wholesalePrice: 250, retailPrice: 350, quantity: 15, category: 'شواحن', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400', available: true },
  { id: '2', name: 'سماعة ايفون سلكية', wholesalePrice: 80, retailPrice: 150, quantity: 50, category: 'سماعات', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', available: true },
  { id: '3', name: 'جراب شفاف آيفون 13', wholesalePrice: 20, retailPrice: 60, quantity: 100, category: 'جرابات', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=400', available: true },
];

let mockUsers: User[] = [
  { id: 'u1', fullName: 'شاهر', nickname: 'Shaher', email: 'shaher@admin.local', phone: '01010452456', type: 'ADMIN', status: 'ACTIVE', walletBalance: 2450.75, password: '0000#' },
  { id: 'u2', fullName: 'مصطفى', nickname: 'Eldarsh', email: 'mostafa@admin.local', phone: '01274790388', type: 'ADMIN', status: 'ACTIVE', walletBalance: 5000, password: '5555@' },
  { 
    id: 'u3', 
    fullName: 'أحمد علي حسن', 
    nickname: 'حمادة', 
    email: 'ahmed@mail.com', 
    phone: '01111111111', 
    type: 'CUSTOMER', 
    status: 'ACTIVE', 
    walletBalance: -500, 
    password: '123',
    idFront: 'https://via.placeholder.com/400x250?text=ID+Front+Preview',
    idBack: 'https://via.placeholder.com/400x250?text=ID+Back+Preview',
    personalPhoto: 'https://via.placeholder.com/150?text=Face'
  }
];

let mockTransactions: Transaction[] = [
  { id: 'tr1', userId: 'u1', userName: 'Shaher Magde', type: 'DEPOSIT', amount: 1000, status: 'SUCCESS', description: 'إيداع محفظة', createdAt: new Date().toISOString() },
  { id: 'tr2', userId: 'u3', userName: 'أحمد علي حسن', type: 'RECHARGE', amount: 500, status: 'SUCCESS', description: 'شحن رصيد (مديونية)', targetNumber: '01012345678', createdAt: new Date().toISOString() },
];

export const api = {
  auth: {
    login: async (emailOrPhone: string, password: string): Promise<User> => {
      await sleep(1000);
      
      const cleanIdentifier = emailOrPhone.trim().toLowerCase();
      
      // البحث بدقة وتجاهل المسافات وحالة الأحرف
      const user = mockUsers.find(u => {
        const uEmail = (u.email || "").trim().toLowerCase();
        const uPhone = (u.phone || "").trim().toLowerCase();
        return uEmail === cleanIdentifier || uPhone === cleanIdentifier;
      });
      
      if (!user) {
        console.error("User not found for identifier:", cleanIdentifier);
        throw new Error('هذا الحساب غير مسجل لدينا.');
      }
      
      if (password !== user.password) throw new Error('كلمة المرور غير صحيحة.');
      
      if (user.status === 'BLOCKED') throw new Error('لقد تم حظر هذا الحساب.');
      return user;
    },
    register: async (data: any): Promise<User> => {
      await sleep(1500);
      const exists = mockUsers.find(u => u.email === data.email || u.phone === data.phone);
      if (exists) throw new Error('البريد أو الهاتف مسجل بالفعل.');
      const newUser: User = {
        id: 'u' + (mockUsers.length + 1),
        fullName: data.fullName,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        type: 'CUSTOMER',
        status: 'ACTIVE',
        walletBalance: 0,
        idFront: data.idFront,
        idBack: data.idBack,
        personalPhoto: data.personalPhoto,
        password: data.password
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },
  wallet: {
    getBalance: async () => currentBalance,
    getTransactions: async (): Promise<Transaction[]> => mockTransactions
  },
  payment: {
    process: async (details: any) => {
      await sleep(1000);
      const transactionId = 'TXN-' + Math.random().toString(36).toUpperCase().substring(2, 10);
      if (details.type === 'DEPOSIT') currentBalance += details.amount;
      else currentBalance -= details.amount;
      const newTx: Transaction = {
        id: transactionId,
        userId: 'u3',
        userName: 'العميل الحالي',
        type: details.type === 'RECHARGE' ? 'RECHARGE' : (details.type === 'DEPOSIT' ? 'DEPOSIT' : 'PURCHASE'),
        amount: details.amount,
        status: 'SUCCESS',
        description: details.description,
        targetNumber: details.target,
        createdAt: new Date().toISOString()
      };
      mockTransactions = [newTx, ...mockTransactions];
      return { success: true, transactionId, message: 'تم تنفيذ العملية', status: 'SUCCESS', newBalance: currentBalance };
    }
  },
  marketplace: {
    getProducts: async () => mockProducts,
    checkout: async (cartItems: any[], total: number) => api.payment.process({ amount: total, description: 'شراء منتجات', type: 'PAYMENT' })
  },
  admin: {
    getSystemStats: async () => ({
      totalBalance: currentBalance,
      totalUsers: mockUsers.length,
      totalTransactions: mockTransactions.length,
      pendingOrders: mockTransactions.filter(t => t.status === 'PENDING').length,
      pendingUsers: mockUsers.filter(u => u.status === 'PENDING').length,
      activeServices: 8
    }),
    getUsers: async () => mockUsers,
    getTransactions: async () => mockTransactions,
    updateTransactionStatus: async (id: string, status: 'SUCCESS' | 'FAILED') => {
      mockTransactions = mockTransactions.map(t => t.id === id ? { ...t, status } : t);
      return { success: true };
    },
    updateUserStatus: async (userId: string, status: UserStatus) => {
      mockUsers = mockUsers.map(u => u.id === userId ? { ...u, status } : u);
      return { success: true };
    }
  }
};
