export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://prof-ia-backend.onrender.com';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl.replace(/\/$/, '')}${cleanEndpoint}`;
};
