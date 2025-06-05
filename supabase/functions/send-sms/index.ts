
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  phone: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message }: SMSRequest = await req.json();

    // Simular envio de SMS (você pode integrar com um provedor real como Twilio, etc.)
    console.log(`📱 SMS enviado para ${phone}:`);
    console.log(message);

    // Aqui você pode integrar com um provedor de SMS real como:
    // - Twilio
    // - AWS SNS
    // - Zenvia
    // - Total Voice
    // etc.

    // Por enquanto, vamos simular um sucesso
    const response = {
      success: true,
      phone,
      message,
      timestamp: new Date().toISOString(),
      provider: "simulated"
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar SMS:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
