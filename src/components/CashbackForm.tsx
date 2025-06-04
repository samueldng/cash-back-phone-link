
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, ShoppingBag, Tag } from 'lucide-react';
import { Customer, Transaction } from '@/types/cashback';
import { getCustomerByPhone, saveCustomer, saveTransaction, getSettings } from '@/utils/cashbackStorage';
import { sendCashbackNotification, sendWelcomeNotification } from '@/utils/notificationService';
import { toast } from '@/hooks/use-toast';

interface CashbackFormProps {
  onTransactionAdded: () => void;
}

const CashbackForm = ({ onTransactionAdded }: CashbackFormProps) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !amount || !category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o telefone, valor da compra e categoria",
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
      const settings = getSettings();
      
      // Verifica se a categoria é elegível para cashback
      const isEligibleCategory = settings.eligibleCategories.includes(category);
      const cashbackEarned = isEligibleCategory ? (purchaseAmount * settings.cashbackPercentage) / 100 : 0;
      
      let customer = getCustomerByPhone(phone);
      const isNewCustomer = !customer;
      
      if (!customer) {
        customer = {
          phone,
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
        description: description || `Compra de ${category} - R$ ${purchaseAmount.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      };

      saveCustomer(customer);
      saveTransaction(transaction);

      if (isNewCustomer) {
        sendWelcomeNotification(phone);
      }
      
      if (cashbackEarned > 0) {
        sendCashbackNotification(phone, cashbackEarned, 'earned');
        toast({
          title: "Compra Registrada! 🛒",
          description: `Cashback de R$ ${cashbackEarned.toFixed(2)} creditado para ${phone}`,
        });
      } else {
        toast({
          title: "Compra Registrada! 🛒",
          description: `Compra registrada sem cashback (categoria não elegível)`,
        });
      }

      setPhone('');
      setAmount('');
      setCategory('');
      setDescription('');
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
          Registrar Compra
        </CardTitle>
        <CardDescription>
          Registre uma nova compra - cashback de 2% apenas em acessórios
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categoria do Produto
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acessorios">Acessórios (2% cashback)</SelectItem>
                <SelectItem value="roupas">Roupas (sem cashback)</SelectItem>
                <SelectItem value="calcados">Calçados (sem cashback)</SelectItem>
                <SelectItem value="outros">Outros (sem cashback)</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
