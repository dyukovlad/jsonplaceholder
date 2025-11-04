export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'My App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  cache: {
    staleTime: Number(import.meta.env.VITE_CACHE_STALE_TIME) || 1000 * 60 * 5, // 5 minutes
    gcTime: Number(import.meta.env.VITE_CACHE_GC_TIME) || 1000 * 60 * 10, // 10 minutes
  },
}
