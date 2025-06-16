
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { expandUrl } from '@/utils/urlShortener';

const ShortUrl = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('ShortUrl - código recebido:', code);
    
    if (code) {
      const fullUrl = expandUrl(code);
      console.log('ShortUrl - URL expandida:', fullUrl);
      
      if (fullUrl) {
        // Pequeno delay para melhor experiência do usuário
        setTimeout(() => {
          console.log('Redirecionando para:', fullUrl);
          window.location.href = fullUrl;
        }, 500);
      } else {
        console.error('URL não encontrada para o código:', code);
        setError(true);
        // Redireciona para home após 3 segundos se não encontrar
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } else {
      setError(true);
    }
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h1>
          <p className="text-gray-600 mb-4">
            Este link não foi encontrado ou pode ter expirado.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando para a página inicial em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Redirecionando para seus pontos...</p>
        <p className="text-sm text-gray-500">Código: {code}</p>
      </div>
    </div>
  );
};

export default ShortUrl;
