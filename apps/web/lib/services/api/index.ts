import axios from "axios";

import { customLocalStorage } from "../localStorage";

export const Api = axios.create({
  baseURL: process.env.API_ENDPOINT,
});

Api.interceptors.request.use((config) => {
  const accessToken = customLocalStorage.getValue("accessToken");

  config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";

  return config;
});

export default Api;
