
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { expandUrl } from '@/utils/urlShortener';

const ShortUrl = () => {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (code) {
      const fullUrl = expandUrl(code);
      if (fullUrl) {
        // Redireciona para a URL completa
        window.location.href = fullUrl;
      } else {
        // Se não encontrar a URL, redireciona para a página inicial
        window.location.href = '/';
      }
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default ShortUrl;
