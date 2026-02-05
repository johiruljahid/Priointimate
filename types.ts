
// types.ts

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'bKash' | 'Nagad';
  number: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: Date;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  amount: number;
  credits: number;
  method: 'bKash';
  number: string;
  trxId: string;
  appliedCoupon?: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: Date;
}

export interface VaultItem {
  id: string; // Added: Unique ID for each vault item
  url: string;
  teaser: string; 
  type: 'image' | 'video';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  referralCode: string; 
  balance: number; 
  referralEarnings: number; 
  totalCommissionPaid?: number; 
  referredBy: string | null;
  withdrawalRequests: WithdrawRequest[];
  credits?: number;
  totalSpent?: number;
  couponCode?: string;
  unlockedItems?: string[]; // Added: Array of vault item IDs that are unlocked
}

export interface Coupon {
  code: string;
  discount: number;
  generatedFor: string;
  isActive: boolean;
}

export interface GirlProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  profilePic: string;
  gallery: string[];
  exclusiveVault: VaultItem[];
  exclusiveContentPrice: number; 
  exclusiveCta?: string; 
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  tagline: string;
  credits: number;
  price: number;
  level: 'BASIC' | 'POPULAR' | 'PREMIUM';
  color: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  type: 'text' | 'image' | 'audio';
  text?: string;
  mediaUrl?: string;
  timestamp: Date;
}

export type AppView = 'home' | 'profile' | 'chat' | 'models' | 'subscription' | 'admin' | 'modelDetail' | 'checkout';
