import axios from 'axios';

import { loadInterceptors } from './interceptors';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

const Api = loadInterceptors(axiosInstance);

export default Api;
