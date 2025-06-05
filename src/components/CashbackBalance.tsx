
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Wallet, Search } from 'lucide-react';
import { supabaseService } from '@/utils/supabaseService';
import { Customer } from '@/types/cashback';

const CashbackBalance = () => {
  const [phone, setPhone] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notFound, setNotFound] = useState(false);
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
    setNotFound(false);
  };

  const handleSearch = async () => {
    if (!phone) return;
    
    setIsLoading(true);
    try {
      const foundCustomer = await supabaseService.getCustomerByPhone(phone);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        setNotFound(false);
      } else {
        setCustomer(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      setCustomer(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Wallet className="h-5 w-5" />
          Consultar Saldo
        </CardTitle>
        <CardDescription>
          Consulte o saldo de cashback disponível
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone do Cliente
            </Label>
            <Input
              id="search-phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={!phone || isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {customer && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3">Saldo do Cliente: {customer.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  R$ {customer.availableCashback.toFixed(2)}
                </p>
                <p className="text-sm text-green-700">Disponível</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  R$ {customer.totalCashback.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">Total Ganho</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  R$ {customer.usedCashback.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">Já Utilizado</p>
              </div>
            </div>
          </div>
        )}

        {notFound && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              Cliente não encontrado. Registre uma compra primeiro para criar a conta de cashback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CashbackBalance;
