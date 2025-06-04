
import { toast } from '@/hooks/use-toast';

export const sendCashbackNotification = (phone: string, amount: number, type: 'earned' | 'redeemed') => {
  // Simulação de envio de SMS
  console.log(`📱 SMS enviado para ${phone}:`);
  
  if (type === 'earned') {
    const message = `🎉 Parabéns! Você ganhou R$ ${amount.toFixed(2)} em cashback! Acumule mais e resgate na nossa loja.`;
    console.log(message);
    
    toast({
      title: "Cashback Creditado! 🎉",
      description: `SMS enviado para ${phone}: R$ ${amount.toFixed(2)} em cashback creditado!`,
      duration: 5000,
    });
  } else {
    const message = `✅ Seu cashback de R$ ${amount.toFixed(2)} foi resgatado com sucesso! Aproveite sua compra!`;
    console.log(message);
    
    toast({
      title: "Cashback Resgatado! ✅",
      description: `SMS enviado para ${phone}: R$ ${amount.toFixed(2)} resgatado!`,
      duration: 5000,
    });
  }
};

export const sendWelcomeNotification = (phone: string) => {
  const message = `🎯 Bem-vindo ao nosso programa de cashback! A cada compra você ganha 5% de volta. Acumule e resgate na loja!`;
  console.log(`📱 SMS de boas-vindas para ${phone}:`, message);
  
  toast({
    title: "Cliente Cadastrado! 🎯",
    description: `SMS de boas-vindas enviado para ${phone}`,
    duration: 3000,
  });
};
