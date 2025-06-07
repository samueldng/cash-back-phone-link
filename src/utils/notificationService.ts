
import { toast } from '@/hooks/use-toast';
import { sendSMS } from './smsService';

const getTrackingUrl = (phone: string) => {
  const encodedPhone = encodeURIComponent(phone);
  return `${window.location.origin}/pontos/${encodedPhone}`;
};

export const sendCashbackNotification = async (phone: string, amount: number, type: 'earned' | 'redeemed') => {
  let message = '';
  const trackingUrl = getTrackingUrl(phone);
  
  if (type === 'earned') {
    message = `🎉 Parabéns! Você ganhou R$ ${amount.toFixed(2)} em cashback! Acompanhe seus pontos e veja produtos disponíveis: ${trackingUrl}`;
    
    toast({
      title: "Cashback Creditado! 🎉",
      description: `SMS enviado para ${phone}: R$ ${amount.toFixed(2)} em cashback creditado!`,
      duration: 5000,
    });
  } else {
    message = `✅ Seu cashback de R$ ${amount.toFixed(2)} foi resgatado com sucesso! Continue acumulando pontos: ${trackingUrl}`;
    
    toast({
      title: "Cashback Resgatado! ✅",
      description: `SMS enviado para ${phone}: R$ ${amount.toFixed(2)} resgatado!`,
      duration: 5000,
    });
  }

  // Enviar SMS real
  try {
    const success = await sendSMS(phone, message);
    if (!success) {
      console.warn('Falha no envio do SMS, mas transação foi processada');
    }
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
  }

  // Log para debug
  console.log(`📱 SMS para ${phone}:`, message);
};

export const sendWelcomeNotification = async (phone: string) => {
  const trackingUrl = getTrackingUrl(phone);
  const message = `🎯 Bem-vindo ao nosso programa de cashback! Ganhe 5% em acessórios. Acompanhe seus pontos: ${trackingUrl}`;
  
  toast({
    title: "Cliente Cadastrado! 🎯",
    description: `SMS de boas-vindas enviado para ${phone}`,
    duration: 3000,
  });

  // Enviar SMS real
  try {
    const success = await sendSMS(phone, message);
    if (!success) {
      console.warn('Falha no envio do SMS de boas-vindas, mas cliente foi cadastrado');
    }
  } catch (error) {
    console.error('Erro ao enviar SMS de boas-vindas:', error);
  }

  // Log para debug
  console.log(`📱 SMS de boas-vindas para ${phone}:`, message);
};
