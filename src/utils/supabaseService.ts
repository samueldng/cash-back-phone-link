
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
    
    return data || [];
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
    
    return data;
  },

  async saveCustomer(customer: Customer): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .upsert(customer, { onConflict: 'phone' });
    
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
    
    return data || [];
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
    
    return data || [];
  },

  async saveTransaction(transaction: Transaction): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .insert(transaction);
    
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
