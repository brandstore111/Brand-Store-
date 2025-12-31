
export type UserType = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';

export interface User {
  id: string;
  fullName: string;
  nickname?: string;
  email: string;
  phone: string;
  type: UserType;
  status: UserStatus;
  walletBalance: number;
  avatar?: string;
  idFront?: string;
  idBack?: string;
  personalPhoto?: string;
}

export interface Product {
  id: string;
  name: string;
  wholesalePrice: number;
  retailPrice: number;
  quantity: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'RECHARGE' | 'BILL' | 'PURCHASE';
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  description: string;
  targetNumber?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  category: 'RECHARGE' | 'WALLET' | 'BANK' | 'BILL';
  provider: string;
  active: boolean;
}
