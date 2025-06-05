
import { supabase } from '@/integrations/supabase/client';

export const sendSMS = async (phone: string, message: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        phone,
        message
      }
    });

    if (error) {
      console.error('Erro ao enviar SMS:', error);
      return false;
    }

    console.log('SMS enviado com sucesso:', data);
    return data?.success || false;
  } catch (error) {
    console.error('Erro na chamada do serviço de SMS:', error);
    return false;
  }
};
