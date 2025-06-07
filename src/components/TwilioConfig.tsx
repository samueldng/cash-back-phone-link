
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

const TwilioConfig = () => {
  const [phoneNumber, setPhoneNumber] = useState('+18106925141');

  const handleSave = () => {
    toast({
      title: "Configuração Salva",
      description: `Número do Twilio atualizado para: ${phoneNumber}`,
      duration: 3000,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configuração do Twilio</CardTitle>
        <CardDescription>
          Atualize o número de telefone do Twilio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Número do Twilio</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+18106925141"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Salvar Configuração
        </Button>
        <div className="text-sm text-gray-600">
          <p><strong>Número atual:</strong> +18777804236</p>
          <p><strong>Novo número:</strong> {phoneNumber}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwilioConfig;
