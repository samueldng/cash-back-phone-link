
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CashbackForm from '@/components/CashbackForm';
import CashbackBalance from '@/components/CashbackBalance';
import RedeemCashback from '@/components/RedeemCashback';
import TransactionHistory from '@/components/TransactionHistory';
import StatsCards from '@/components/StatsCards';

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de <span className="text-green-600">Cashback</span>
          </h1>
          <p className="text-lg text-gray-600">
            Fidelize seus clientes com cashback automático a cada compra
          </p>
        </div>

        <div className="mb-8" key={refreshKey}>
          <StatsCards />
        </div>

        <Tabs defaultValue="register" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="register">Registrar Compra</TabsTrigger>
            <TabsTrigger value="balance">Consultar Saldo</TabsTrigger>
            <TabsTrigger value="redeem">Resgatar</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CashbackForm onTransactionAdded={handleDataChange} />
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-3">Como Funciona</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• O cliente ganha 5% de cashback em compras de acessórios</li>
                    <li>• Valor mínimo para resgate: R$ 20,00</li>
                    <li>• SMS automático enviado a cada transação</li>
                    <li>• Cashback pode ser usado em futuras compras</li>
                  </ul>
                </div>
                <TransactionHistory key={refreshKey} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="balance">
            <CashbackBalance key={refreshKey} />
          </TabsContent>

          <TabsContent value="redeem">
            <RedeemCashback onRedemption={handleDataChange} />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory key={refreshKey} />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Sistema de Cashback - Fidelize seus clientes automaticamente</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
