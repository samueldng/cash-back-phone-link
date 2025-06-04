
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/types/cashback';
import { getTransactions } from '@/utils/cashbackStorage';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(getTransactions().slice(0, 10)); // Últimas 10 transações
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <History className="h-5 w-5" />
          Histórico de Transações
        </CardTitle>
        <CardDescription>
          Últimas transações do sistema de cashback
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    {transaction.type === 'purchase' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{formatPhone(transaction.phone)}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === 'purchase' ? 'default' : 'secondary'}>
                      {transaction.type === 'purchase' ? 'Compra' : 'Resgate'}
                    </Badge>
                  </div>
                  <p className="font-bold text-lg">
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                  <p className={`text-sm ${transaction.type === 'purchase' ? 'text-green-600' : 'text-orange-600'}`}>
                    {transaction.type === 'purchase' ? '+' : '-'}R$ {Math.abs(transaction.cashbackEarned).toFixed(2)} cashback
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
