
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Gift } from 'lucide-react';
import { supabaseService } from '@/utils/supabaseService';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSales: 0,
    totalCashbackGiven: 0,
    totalCashbackRedeemed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [customers, transactions] = await Promise.all([
          supabaseService.getCustomers(),
          supabaseService.getTransactions()
        ]);

        const purchaseTransactions = transactions.filter(t => t.type === 'purchase');
        const redemptionTransactions = transactions.filter(t => t.type === 'redemption');

        const totalSales = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalCashbackGiven = purchaseTransactions.reduce((sum, t) => sum + t.cashbackEarned, 0);
        const totalCashbackRedeemed = redemptionTransactions.reduce((sum, t) => sum + t.amount, 0);

        setStats({
          totalCustomers: customers.length,
          totalSales,
          totalCashbackGiven,
          totalCashbackRedeemed,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">Carregando...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            Total de clientes cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {stats.totalSales.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Volume total de vendas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cashback Concedido</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ {stats.totalCashbackGiven.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total em cashback gerado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cashback Resgatado</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">R$ {stats.totalCashbackRedeemed.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total em resgates realizados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
