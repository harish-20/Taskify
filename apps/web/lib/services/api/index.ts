import axios from "axios";

import { customLocalStorage } from "../localStorage";

export const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

Api.interceptors.request.use((config) => {
  const accessToken = customLocalStorage.getValue("accessToken");

  config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";

  return config;
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default Api;
