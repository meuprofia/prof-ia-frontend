/**
 * API configuration for Meu Prof IA
 * Base URL defaults to current relative path (same-origin),
 * or can be overridden via VITE_API_BASE_URL environment variable.
 */
export const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Builds a full API URL using the backend base URL or relative route.
 * Example: getApiUrl('/api/gemini/chat') -> '/api/gemini/chat'
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

