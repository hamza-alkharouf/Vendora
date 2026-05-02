import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request Interceptor for Auth & i18n
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ar' : 'ar';
  const storeId = typeof window !== 'undefined' ? localStorage.getItem('storeId') : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['accept-language'] = lang;
  
  if (storeId) {
    config.headers['x-store-id'] = storeId;
  }

  return config;
});

export const auth = {
  requestOtp: (phone: string) => api.post('/auth/request-otp', { phone }),
  verifyOtp: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  getMe: () => api.get('/customer/me'),
};

export * from './types';
export default api;
