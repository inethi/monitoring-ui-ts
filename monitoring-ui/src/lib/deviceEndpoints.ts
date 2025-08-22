import { createAxiosInstanceWithToken } from "./auth";
import { Device } from "./types";

export const createDevice = async (payload: any): Promise<Device> => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.post<Device>(
        "/hosts/create/",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...payload, id: Math.floor(Math.random() * 10000) } as Device;
  }
};

export const fetchDevices = async (): Promise<Device[]> => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.get<Device[]>("/hosts/");
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    const data = await import("../data/devices.json");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return data.default as Device[];
  }
};

export const deleteDevice = async (id: number): Promise<{ id: number }> => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      await axiosInstance.delete(`/hosts/${id}/`);
      return { id };
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  }
};

export const updateDevice = async (
  id: number,
  payload: any
): Promise<Device> => {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    try {
      const axiosInstance = createAxiosInstanceWithToken();
      const response = await axiosInstance.put<Device>(
        `/hosts/${id}/`,
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Network error");
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...payload, id } as Device;
  }
};
