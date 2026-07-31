export const getApiUrl = (endpoint?: string) => {
  const baseUrl = 'https://prof-ia-backend.onrender.com';
  
  // Se o endpoint vier vazio, nulo ou indefinido, retorna apenas a URL base do Render
  if (!endpoint || typeof endpoint !== 'string') {
    return baseUrl;
  }
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
