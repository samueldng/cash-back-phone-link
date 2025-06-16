
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

const loadStoredUrls = () => {
  if (urlMap.size === 0) {
    try {
      const stored = localStorage.getItem('urlMap');
      if (stored) {
        const entries = JSON.parse(stored);
        entries.forEach(([key, value]: [string, string]) => {
          urlMap.set(key, value);
        });
        // Atualiza o counter baseado no maior código existente
        if (entries.length > 0) {
          counter = Math.max(counter, entries.length + 1000);
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar URLs do localStorage:', error);
    }
  }
};

const saveToStorage = () => {
  try {
    localStorage.setItem('urlMap', JSON.stringify(Array.from(urlMap.entries())));
  } catch (error) {
    console.warn('Erro ao salvar URLs no localStorage:', error);
  }
};

export const shortenUrl = (fullUrl: string): string => {
  loadStoredUrls();
  
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
  saveToStorage();
  
  console.log(`URL encurtada: ${fullUrl} -> ${shortCode}`);
  
  return `${window.location.origin}/s/${shortCode}`;
};

export const expandUrl = (shortCode: string): string | null => {
  loadStoredUrls();
  
  const fullUrl = urlMap.get(shortCode);
  console.log(`Expandindo código ${shortCode} para: ${fullUrl || 'não encontrado'}`);
  
  return fullUrl || null;
};
