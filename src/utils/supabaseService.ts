
import { supabase } from '@/integrations/supabase/client';
import { Customer, Transaction, CashbackSettings } from '@/types/cashback';

export const supabaseService = {
  // Customers
  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
    
    return data?.map(customer => ({
      phone: customer.phone,
      name: customer.name,
      totalCashback: customer.total_cashback,
      availableCashback: customer.available_cashback,
      usedCashback: customer.used_cashback,
      createdAt: customer.created_at,
    })) || [];
  },

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      phone: data.phone,
      name: data.name,
      totalCashback: data.total_cashback,
      availableCashback: data.available_cashback,
      usedCashback: data.used_cashback,
      createdAt: data.created_at,
    };
  },

  async saveCustomer(customer: Customer): Promise<void> {
    const dbCustomer = {
      phone: customer.phone,
      name: customer.name,
      total_cashback: customer.totalCashback,
      available_cashback: customer.availableCashback,
      used_cashback: customer.usedCashback,
    };

    const { error } = await supabase
      .from('customers')
      .upsert(dbCustomer, { onConflict: 'phone' });
    
    if (error) {
      console.error('Erro ao salvar cliente:', error);
      throw error;
    }
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
    
    return data?.map(transaction => ({
      id: transaction.id,
      phone: transaction.phone,
      amount: transaction.amount,
      cashbackEarned: transaction.cashback_earned,
      type: transaction.type as 'purchase' | 'redemption',
      category: transaction.category || undefined,
      description: transaction.description,
      timestamp: transaction.timestamp,
    })) || [];
  },

  async getTransactionsByPhone(phone: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('phone', phone)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações do cliente:', error);
      return [];
    }
    
    return data?.map(transaction => ({
      id: transaction.id,
      phone: transaction.phone,
      amount: transaction.amount,
      cashbackEarned: transaction.cashback_earned,
      type: transaction.type as 'purchase' | 'redemption',
      category: transaction.category || undefined,
      description: transaction.description,
      timestamp: transaction.timestamp,
    })) || [];
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    const dbTransaction = {
      id: transaction.id,
      phone: transaction.phone,
      amount: transaction.amount,
      cashback_earned: transaction.cashbackEarned,
      type: transaction.type,
      category: transaction.category || null,
      description: transaction.description,
    };

    const { error } = await supabase
      .from('transactions')
      .insert(dbTransaction);
    
    if (error) {
      console.error('Erro ao salvar transação:', error);
      throw error;
    }
  },

  // Settings
  async getSettings(): Promise<CashbackSettings> {
    const { data, error } = await supabase
      .from('cashback_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return {
        cashbackPercentage: 5,
        minimumRedemption: 15,
        eligibleCategories: ['acessorios']
      };
    }
    
    return data ? {
      cashbackPercentage: data.cashback_percentage,
      minimumRedemption: data.minimum_redemption,
      eligibleCategories: data.eligible_categories
    } : {
      cashbackPercentage: 5,
      minimumRedemption: 15,
      eligibleCategories: ['acessorios']
    };
  }
};
