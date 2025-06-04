export interface Customer {
  phone: string;
  name: string;
  totalCashback: number;
  availableCashback: number;
  usedCashback: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  phone: string;
  amount: number;
  cashbackEarned: number;
  type: 'purchase' | 'redemption';
  category?: string;
  description: string;
  timestamp: string;
}

export interface CashbackSettings {
  cashbackPercentage: number;
  minimumRedemption: number;
  eligibleCategories: string[];
}
