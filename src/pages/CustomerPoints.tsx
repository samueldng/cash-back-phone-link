
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Gift, Phone, Clock } from 'lucide-react';
import { supabaseService } from '@/utils/supabaseService';
import { Customer, Transaction } from '@/types/cashback';

const products = [
  {
    id: 1,
    name: "Capinha ou Película",
    price: 15,
    description: "Proteção básica para seu dispositivo",
    icon: "📱"
  },
  {
    id: 2,
    name: "Película Hidrogel Transparente",
    price: 20,
    description: "Proteção premium transparente",
    icon: "🛡️"
  },
  {
    id: 3,
    name: "Fone de Ouvido, Cabo ou Fonte para iPhone",
    price: 40,
    description: "Acessórios essenciais para iPhone",
    icon: "🎧"
  },
  {
    id: 4,
    name: "Kit Carregador",
    price: 100,
    description: "Kit completo de carregamento",
    icon: "🔌"
  },
  {
    id: 5,
    name: "Garrafa DAKO",
    price: 160,
    description: "Garrafa térmica premium DAKO",
    icon: "🍶"
  }
];

const CustomerPoints = () => {
  const { phone } = useParams<{ phone: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadCustomerData = async () => {
      if (!phone) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const decodedPhone = decodeURIComponent(phone);
        const customerData = await supabaseService.getCustomerByPhone(decodedPhone);
        
        if (customerData) {
          setCustomer(customerData);
          const customerTransactions = await supabaseService.getTransactionsByPhone(decodedPhone);
          setTransactions(customerTransactions);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [phone]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus pontos...</p>
        </div>
      </div>
    );
  }

  if (notFound || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center pt-6">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cliente não encontrado</h2>
            <p className="text-gray-600">
              Não foi possível encontrar dados para este número de telefone.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seus Pontos de <span className="text-green-600">Cashback</span>
          </h1>
          <p className="text-lg text-gray-600">Olá, {customer.name}!</p>
        </div>

        {/* Saldo atual */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Wallet className="h-5 w-5" />
              Seu Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  R$ {customer.availableCashback.toFixed(2)}
                </p>
                <p className="text-sm text-green-700">Disponível para resgate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  R$ {customer.totalCashback.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">Total ganho</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  R$ {customer.usedCashback.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">Já utilizado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Produtos disponíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Gift className="h-5 w-5" />
              Produtos Disponíveis para Resgate
            </CardTitle>
            <CardDescription>
              Use seus pontos para resgatar produtos incríveis!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border ${
                    customer.availableCashback >= product.price
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  } transition-colors`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{product.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {customer.availableCashback >= product.price ? (
                        <Badge variant="default" className="bg-green-600">
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Insuficiente
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>💡 Dica:</strong> Para resgatar seus pontos, visite nossa loja física e apresente esta tela.
                Nossos atendentes irão processar seu resgate na hora!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Histórico recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Clock className="h-5 w-5" />
              Histórico Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type === 'purchase' ? '🎉 Cashback Ganho' : '✅ Cashback Resgatado'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'purchase' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'purchase' ? '+' : '-'}R$ {transaction.cashbackEarned.toFixed(2)}
                      </p>
                      {transaction.type === 'purchase' && (
                        <p className="text-xs text-gray-500">
                          Compra: R$ {transaction.amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>💚 Obrigado por participar do nosso programa de cashback!</p>
        </footer>
      </div>
    </div>
  );
};

export default CustomerPoints;
