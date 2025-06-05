
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, ShoppingBag, User } from 'lucide-react';
import { Customer, Transaction } from '@/types/cashback';
import { supabaseService } from '@/utils/supabaseService';
import { sendCashbackNotification, sendWelcomeNotification } from '@/utils/notificationService';
import { toast } from '@/hooks/use-toast';

interface CashbackFormProps {
  onTransactionAdded: () => void;
}

const CashbackForm = ({ onTransactionAdded }: CashbackFormProps) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    
    if (formatted.length >= 14) {
      try {
        const customer = await supabaseService.getCustomerByPhone(formatted);
        if (customer) {
          setExistingCustomer(customer);
          setIsNewCustomer(false);
          setName(customer.name);
        } else {
          setExistingCustomer(null);
          setIsNewCustomer(true);
          setName('');
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !amount) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o telefone e valor da compra",
        variant: "destructive",
      });
      return;
    }

    if (isNewCustomer && !name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome do cliente",
        variant: "destructive",
      });
      return;
    }

    const purchaseAmount = parseFloat(amount);
    if (purchaseAmount <= 0) {
      toast({
        title: "Erro",
        description: "O valor da compra deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const settings = await supabaseService.getSettings();
      
      const category = 'acessorios';
      const cashbackEarned = (purchaseAmount * settings.cashbackPercentage) / 100;
      
      let customer = existingCustomer;
      
      if (!customer) {
        customer = {
          phone,
          name: name.trim(),
          totalCashback: cashbackEarned,
          availableCashback: cashbackEarned,
          usedCashback: 0,
          createdAt: new Date().toISOString(),
        };
      } else {
        customer.totalCashback += cashbackEarned;
        customer.availableCashback += cashbackEarned;
      }

      const transaction: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        phone,
        amount: purchaseAmount,
        cashbackEarned,
        type: 'purchase',
        category,
        description: description || `Compra de acessórios - R$ ${purchaseAmount.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };

      await supabaseService.saveCustomer(customer);
      await supabaseService.saveTransaction(transaction);

      if (isNewCustomer) {
        sendWelcomeNotification(phone);
      }
      
      sendCashbackNotification(phone, cashbackEarned, 'earned');
      toast({
        title: "Compra Registrada! 🛒",
        description: `Cashback de R$ ${cashbackEarned.toFixed(2)} creditado para ${existingCustomer ? existingCustomer.name : name}`,
      });

      setPhone('');
      setName('');
      setAmount('');
      setDescription('');
      setIsNewCustomer(false);
      setExistingCustomer(null);
      onTransactionAdded();

    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a compra. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="cashback-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <ShoppingBag className="h-5 w-5" />
          Registrar Compra de Acessórios
        </CardTitle>
        <CardDescription>
          Registre uma nova compra de acessórios - 5% de cashback automático
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone do Cliente
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              required
            />
            {existingCustomer && (
              <p className="text-sm text-green-600">
                ✅ Cliente encontrado: {existingCustomer.name}
              </p>
            )}
          </div>

          {isNewCustomer && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Cliente
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do cliente"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Valor da Compra (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da compra..."
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full cashback-gradient hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Registrar Compra'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CashbackForm;
