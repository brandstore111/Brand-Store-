
import { User, Product, Transaction, UserType, UserStatus } from './types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated Database
let currentBalance = 2450.75;

let mockProducts: Product[] = [
  { id: '1', name: 'شاحن سامسونج 45 وات', wholesalePrice: 250, retailPrice: 350, quantity: 15, category: 'شواحن', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400', available: true },
  { id: '2', name: 'سماعة ايفون سلكية', wholesalePrice: 80, retailPrice: 150, quantity: 50, category: 'سماعات', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', available: true },
  { id: '3', name: 'جراب شفاف آيفون 13', wholesalePrice: 20, retailPrice: 60, quantity: 100, category: 'جرابات', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=400', available: true },
];

let mockUsers: User[] = [
  { id: 'u1', fullName: 'Shaher Magde', nickname: 'Shaher', email: 'shahermagdee@gmail.com', phone: '01010452456', type: 'ADMIN', status: 'ACTIVE', walletBalance: 2450.75 },
  { id: 'u2', fullName: 'Mostfa Eldarsh', nickname: 'Eldarsh', email: 'mostfa@mail.com', phone: '01274790388', type: 'ADMIN', status: 'ACTIVE', walletBalance: 5000 },
  { id: 'u3', fullName: 'أحمد علي حسن', nickname: 'حمادة', email: 'ahmed@mail.com', phone: '01111111111', type: 'CUSTOMER', status: 'ACTIVE', walletBalance: 120 }
];

let mockTransactions: Transaction[] = [
  { id: 'tr1', userId: 'u1', userName: 'Shaher Magde', type: 'DEPOSIT', amount: 1000, status: 'SUCCESS', description: 'إيداع محفظة', createdAt: new Date().toISOString() },
  { id: 'tr2', userId: 'u3', userName: 'أحمد علي حسن', type: 'RECHARGE', amount: 50, status: 'PENDING', description: 'شحن رصيد فودافون', targetNumber: '01012345678', createdAt: new Date().toISOString() },
  { id: 'tr3', userId: 'u3', userName: 'أحمد علي حسن', type: 'PURCHASE', amount: 350, status: 'SUCCESS', description: 'شراء شاحن سامسونج', createdAt: new Date().toISOString() },
];

export const api = {
  auth: {
    login: async (emailOrPhone: string, password: string): Promise<User> => {
      await sleep(1000);
      
      let user: User | undefined;

      // Admin 1: Shaher Magde (0000#)
      if ((emailOrPhone === 'shahermagdee@gmail.com' || emailOrPhone === '01010452456') && password === '0000#') {
        user = mockUsers[0];
      }
      
      // Admin 2: Mostfa Eldarsh (5555@)
      else if ((emailOrPhone === 'mostfa@mail.com' || emailOrPhone === '01274790388') && password === '5555@') {
        user = mockUsers[1];
      }

      else {
        user = mockUsers.find(u => (u.email === emailOrPhone || u.phone === emailOrPhone));
      }

      if (!user) throw new Error('بيانات الدخول غير صحيحة');
      if (user.status === 'PENDING') throw new Error('حسابك قيد المراجعة حالياً، يرجى الانتظار');
      if (user.status === 'BLOCKED') throw new Error('لقد تم حظر حسابك، يرجى التواصل مع الدعم');

      return user;
    },
    register: async (data: any): Promise<User> => {
      await sleep(1500);
      
      const exists = mockUsers.find(u => u.email === data.email || u.phone === data.phone);
      if (exists) throw new Error('البريد الإلكتروني أو رقم الهاتف مسجل بالفعل');

      const newUser: User = {
        id: 'u' + (mockUsers.length + 1),
        fullName: data.fullName,
        nickname: data.nickname,
        email: data.email,
        phone: data.phone,
        type: data.type || 'CUSTOMER',
        status: 'PENDING', // New users always pending
        walletBalance: 0,
        idFront: data.idFront,
        idBack: data.idBack,
        personalPhoto: data.personalPhoto
      };
      mockUsers.push(newUser);
      return newUser;
    }
  },
  admin: {
    getUsers: async (): Promise<User[]> => {
      await sleep(800);
      return mockUsers;
    },
    updateUserStatus: async (userId: string, status: UserStatus) => {
      await sleep(500);
      mockUsers = mockUsers.map(u => u.id === userId ? { ...u, status } : u);
      return true;
    },
    getTransactions: async (): Promise<Transaction[]> => {
      await sleep(800);
      return mockTransactions;
    },
    updateTransactionStatus: async (id: string, status: 'SUCCESS' | 'FAILED') => {
      await sleep(1000);
      mockTransactions = mockTransactions.map(t => t.id === id ? { ...t, status } : t);
      return true;
    },
    updateUserBalance: async (userId: string, amount: number) => {
      await sleep(500);
      mockUsers = mockUsers.map(u => u.id === userId ? { ...u, walletBalance: u.walletBalance + amount } : u);
      return true;
    },
    getSystemStats: async () => {
      await sleep(600);
      return {
        totalBalance: mockUsers.reduce((acc, u) => acc + u.walletBalance, 0),
        totalUsers: mockUsers.length,
        totalTransactions: mockTransactions.length,
        pendingOrders: mockTransactions.filter(t => t.status === 'PENDING').length,
        pendingUsers: mockUsers.filter(u => u.status === 'PENDING').length,
        activeServices: 8
      };
    }
  },
  wallet: {
    getBalance: async () => {
      await sleep(500);
      return currentBalance;
    },
    getTransactions: async (): Promise<Transaction[]> => {
      await sleep(800);
      return mockTransactions;
    }
  },
  payment: {
    process: async (details: { 
      amount: number, 
      method: string, 
      description: string, 
      target?: string,
      type: 'PAYMENT' | 'DEPOSIT' | 'WITHDRAW' | 'RECHARGE'
    }) => {
      await sleep(1500);
      const transactionId = 'TXN-' + Math.random().toString(36).toUpperCase().substring(2, 10);
      
      const status = details.type === 'RECHARGE' ? 'PENDING' : 'SUCCESS';
      
      if (details.type === 'DEPOSIT') {
        currentBalance += details.amount;
      } else {
        if (currentBalance < details.amount) throw new Error('رصيد المحفظة غير كافٍ');
        currentBalance -= details.amount;
      }

      const newTx: Transaction = {
        id: transactionId,
        userId: 'u3', 
        userName: 'أحمد علي حسن',
        type: details.type === 'RECHARGE' ? 'RECHARGE' : (details.type === 'DEPOSIT' ? 'DEPOSIT' : 'PURCHASE'),
        amount: details.amount,
        status: status,
        description: details.description,
        targetNumber: details.target,
        createdAt: new Date().toISOString()
      };
      
      mockTransactions = [newTx, ...mockTransactions];

      return {
        success: true,
        transactionId,
        message: status === 'PENDING' ? 'تم استلام طلبك وهو قيد المراجعة' : 'تمت العملية بنجاح',
        status: status,
        newBalance: currentBalance
      };
    }
  },
  marketplace: {
    getProducts: async (): Promise<Product[]> => {
      await sleep(1000);
      return mockProducts;
    },
    addProduct: async (product: Partial<Product>) => {
      await sleep(1000);
      const newProduct = { 
        ...product, 
        id: Math.random().toString(36).substring(7), 
        available: true 
      } as Product;
      mockProducts = [newProduct, ...mockProducts];
      return newProduct;
    },
    updateProduct: async (id: string, updates: Partial<Product>) => {
      await sleep(500);
      mockProducts = mockProducts.map(p => p.id === id ? { ...p, ...updates } : p);
      return true;
    },
    deleteProduct: async (id: string) => {
      await sleep(500);
      mockProducts = mockProducts.filter(p => p.id !== id);
      return true;
    },
    checkout: async (cartItems: any[], total: number) => {
      return await api.payment.process({
        amount: total,
        method: 'WALLET',
        description: `شراء عدد ${cartItems.length} منتجات من المتجر`,
        type: 'PAYMENT'
      });
    }
  }
};
