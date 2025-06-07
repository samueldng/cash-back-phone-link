
// Serviço simples de encurtamento de URL usando uma tabela hash
const urlMap = new Map<string, string>();
let counter = 1000;

const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let num = counter++;
  
  while (num > 0) {
    result = chars[num % chars.length] + result;
    num = Math.floor(num / chars.length);
  }
  
  return result || 'a';
};

export const shortenUrl = (fullUrl: string): string => {
  // Verifica se a URL já foi encurtada
  for (const [shortCode, url] of urlMap.entries()) {
    if (url === fullUrl) {
      return `${window.location.origin}/s/${shortCode}`;
    }
  }
  
  // Cria um novo código curto
  const shortCode = generateShortCode();
  urlMap.set(shortCode, fullUrl);
  
  // Salva no localStorage para persistir entre sessões
  localStorage.setItem('urlMap', JSON.stringify(Array.from(urlMap.entries())));
  
  return `${window.location.origin}/s/${shortCode}`;
};

export const expandUrl = (shortCode: string): string | null => {
  // Carrega do localStorage se necessário
  if (urlMap.size === 0) {
    const stored = localStorage.getItem('urlMap');
    if (stored) {
      const entries = JSON.parse(stored);
      entries.forEach(([key, value]: [string, string]) => {
        urlMap.set(key, value);
      });
    }
  }
  
  return urlMap.get(shortCode) || null;
};
