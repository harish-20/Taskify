import { AxiosInstance } from 'axios';

import { customLocalStorage } from '../localStorage';

const NEXT_PUBLIC_API_STALE_TIME = process.env.NEXT_PUBLIC_API_STALE_TIME;

export const loadInterceptors = (Api: AxiosInstance) => {
  Api.interceptors.request.use((config) => {
    const accessToken = customLocalStorage.getValue('accessToken');

    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';

    if (NEXT_PUBLIC_API_STALE_TIME) {
      config.params = { ...config.params, staleTime: NEXT_PUBLIC_API_STALE_TIME };
    }

    return config;
  });

  Api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';

      return Promise.reject({
        status: error.response?.status,
        message,
        data: error.response?.data,
      });
    },
  );

  return Api;
};
