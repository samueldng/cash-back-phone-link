import { Customer, Transaction, CashbackSettings } from '@/types/cashback';

const CUSTOMERS_KEY = 'cashback_customers';
const TRANSACTIONS_KEY = 'cashback_transactions';
const SETTINGS_KEY = 'cashback_settings';

export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem(CUSTOMERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getSettings = (): CashbackSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : {
    cashbackPercentage: 2,
    minimumRedemption: 20,
    eligibleCategories: ['acessorios']
  };
};

export const saveCustomer = (customer: Customer) => {
  const customers = getCustomers();
  const existingIndex = customers.findIndex(c => c.phone === customer.phone);
  
  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers.push(customer);
  }
  
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const saveTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getCustomerByPhone = (phone: string): Customer | null => {
  const customers = getCustomers();
  return customers.find(c => c.phone === phone) || null;
};

export const getTransactionsByPhone = (phone: string): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter(t => t.phone === phone);
};
