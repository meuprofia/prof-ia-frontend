/**
 * API configuration for Meu Prof IA
 * Base URL defaults to production backend on Render (https://prof-ia-backend.onrender.com)
 * can be overridden via VITE_API_BASE_URL environment variable.
 */
export const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL || 'https://prof-ia-backend.onrender.com').replace(/\/+$/, '');

/**
 * Builds a full API URL using the production backend base URL.
 * Example: getApiUrl('/api/gemini/chat') -> 'https://prof-ia-backend.onrender.com/api/gemini/chat'
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
