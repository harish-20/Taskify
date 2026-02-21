import axios, { AxiosRequestConfig } from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export interface NominatimSearchParams {
  query: string;
  limit?: number;
}

export const searchAddress = async (
  { query, limit = 5 }: NominatimSearchParams,
  signal?: AbortSignal,
) => {
  const config: AxiosRequestConfig = {
    params: {
      q: query,
      format: "json",
      addressdetails: 1,
      limit,
    },
    signal,
  };

  const { data } = await axios.get(NOMINATIM_BASE_URL, config);

  return data;
};
