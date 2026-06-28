import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/lib/store/store';
import { setCurrentUser } from '@/lib/store/features/auth/authSlice';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
  } else {
    delete axiosClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
  }
};

// Restore token on page refresh
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('access_token');
  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const status = error.response && error.response.status
    switch (status) {
      case 401:
        localStorage.removeItem('access_token');
        delete axiosClient.defaults.headers.common['Authorization'];
        store.dispatch(setCurrentUser(null));
        window.location.replace('/login');
        break;
      case 400:
        // toast.error(error.response.data.message)
    }

    return Promise.reject(error.response);
  }
);

export default axiosClient;
