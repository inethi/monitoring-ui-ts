import { createAxiosInstanceWithToken } from "./auth";

export const createNetwork = async (payload: any) => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.post("/networks/create/", payload);
      return response.data;
    } catch (error: any) {
      console.error("[networkEndpoints] createNetwork error:", error);
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...payload, id: Math.floor(Math.random() * 10000) };
  }
};

export const fetchNetworks = async () => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.get("/networks/");
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    const data = await import("../data/networks.json");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return data.default;
  }
};

export const editNetwork = async (id: number, payload: any) => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.put(`/networks/${id}/`, payload);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...payload, id };
  }
};

export const deleteNetwork = async (id: number) => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.delete(`/networks/${id}/`);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  }
};
