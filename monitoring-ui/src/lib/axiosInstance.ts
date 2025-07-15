import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8100/api/v1";

export const createAxiosInstanceWithToken = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
  });
};
