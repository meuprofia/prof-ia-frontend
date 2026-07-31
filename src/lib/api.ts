export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = 'https://prof-ia-backend.onrender.com';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
