
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Gift, AlertCircle } from 'lucide-react';
import { Customer, Transaction } from '@/types/cashback';
import { getCustomerByPhone, saveCustomer, saveTransaction, getSettings } from '@/utils/cashbackStorage';
import { sendCashbackNotification } from '@/utils/notificationService';
import { toast } from '@/hooks/use-toast';

interface RedeemCashbackProps {
  onRedemption: () => void;
}

const RedeemCashback = ({ onRedemption }: RedeemCashbackProps) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    
    if (formatted.length >= 14) {
      const foundCustomer = getCustomerByPhone(formatted);
      setCustomer(foundCustomer);
    } else {
      setCustomer(null);
    }
  };

  const handleMaxRedeem = () => {
    if (customer) {
      setAmount(customer.availableCashback.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) {
      toast({
        title: "Erro",
        description: "Cliente não encontrado",
        variant: "destructive",
      });
      return;
    }

    const redeemAmount = parseFloat(amount);
    const settings = getSettings();

    if (redeemAmount <= 0) {
      toast({
        title: "Erro",
        description: "O valor do resgate deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (redeemAmount < settings.minimumRedemption) {
      toast({
        title: "Erro",
        description: `Valor mínimo para resgate é R$ ${settings.minimumRedemption.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    if (redeemAmount > customer.availableCashback) {
      toast({
        title: "Erro",
        description: "Saldo insuficiente para resgate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedCustomer = {
        ...customer,
        availableCashback: customer.availableCashback - redeemAmount,
        usedCashback: customer.usedCashback + redeemAmount,
      };

      const transaction: Transaction = {
        id: `rd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        phone: customer.phone,
        amount: redeemAmount,
        cashbackEarned: -redeemAmount,
        type: 'redemption',
        description: `Resgate de cashback - R$ ${redeemAmount.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };

      saveCustomer(updatedCustomer);
      saveTransaction(transaction);
      sendCashbackNotification(phone, redeemAmount, 'redeemed');

      toast({
        title: "Resgate Realizado! 🎁",
        description: `R$ ${redeemAmount.toFixed(2)} resgatado com sucesso!`,
      });

      setPhone('');
      setAmount('');
      setCustomer(null);
      onRedemption();

    } catch (error) {
      console.error('Erro ao resgatar cashback:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar resgate. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const settings = getSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Gift className="h-5 w-5" />
          Resgatar Cashback
        </CardTitle>
        <CardDescription>
          Resgate o cashback acumulado do cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="redeem-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone do Cliente
            </Label>
            <Input
              id="redeem-phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              required
            />
          </div>

          {customer && (
            <>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Saldo Disponível</h4>
                <p className="text-2xl font-bold text-green-600">
                  R$ {customer.availableCashback.toFixed(2)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleMaxRedeem}
                  className="mt-2"
                >
                  Resgatar Tudo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="redeem-amount">Valor a Resgatar (R$)</Label>
                <Input
                  id="redeem-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={customer.availableCashback}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Valor mínimo para resgate: R$ {settings.minimumRedemption.toFixed(2)}</p>
                  <p>O cashback será descontado do saldo do cliente.</p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full cashback-gradient hover:opacity-90 transition-opacity"
                disabled={isLoading || !amount || parseFloat(amount || '0') < settings.minimumRedemption}
              >
                {isLoading ? 'Processando...' : 'Resgatar Cashback'}
              </Button>
            </>
          )}

          {phone && !customer && phone.length >= 14 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                Cliente não encontrado ou sem cashback disponível.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default RedeemCashback;
