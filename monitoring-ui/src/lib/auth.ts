// Authentication utility functions for login, registration, and axios instance management
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8100/api/v1";
const TOKEN_KEY = "auth_token";

type AuthResponse = { token: string };

// Helper to clean [ErrorDetail(string='...', code='...')] to just the message
function cleanErrorDetail(detail: string): string {
  return detail.replace(
    /\[ErrorDetail\(string='([^']+)', code='[^']+'\)\]/g,
    "$1"
  );
}

export const loginUser = async (
  username: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/accounts/login/`,
      {
        username,
        password,
      }
    );
    // Store the correct token
    const { local_token, cloud_token, token } = response.data as any;
    if (local_token) {
      localStorage.setItem(TOKEN_KEY, local_token);
      return local_token;
    } else if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } else if (cloud_token) {
      localStorage.setItem(TOKEN_KEY, cloud_token);
      return cloud_token;
    }
    return "";
  } catch (error: any) {
    let message = "Login failed. Please try again.";
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === "string") {
        message = data;
      } else if (
        data.details &&
        data.details.detail &&
        Array.isArray(data.details.detail) &&
        data.details.detail.length > 0
      ) {
        if (data.error && typeof data.error === "string") {
          message = `${data.error}: ${cleanErrorDetail(
            data.details.detail[0]
          )}`;
        } else {
          message = cleanErrorDetail(data.details.detail[0]);
        }
      } else if (
        data.non_field_errors &&
        Array.isArray(data.non_field_errors)
      ) {
        message = cleanErrorDetail(data.non_field_errors[0]);
      } else if (data.username && Array.isArray(data.username)) {
        message = cleanErrorDetail(data.username[0]);
      } else if (data.password && Array.isArray(data.password)) {
        message = cleanErrorDetail(data.password[0]);
      } else if (data.error && typeof data.error === "string") {
        message = data.error;
      } else if (data.detail) {
        message = cleanErrorDetail(data.detail);
      }
    } else if (error.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export const registerUser = async (
  username: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/accounts/register/`,
      {
        username,
        password,
      }
    );
    // Store the correct token
    const { local_token, cloud_token, token } = response.data as any;
    if (local_token) {
      localStorage.setItem(TOKEN_KEY, local_token);
      return local_token;
    } else if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } else if (cloud_token) {
      localStorage.setItem(TOKEN_KEY, cloud_token);
      return cloud_token;
    }
    return "";
  } catch (error: any) {
    let message = "Registration failed. Please try again.";
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === "string") {
        message = data;
      } else if (
        data.details &&
        data.details.detail &&
        Array.isArray(data.details.detail) &&
        data.details.detail.length > 0
      ) {
        if (data.error && typeof data.error === "string") {
          message = `${data.error}: ${cleanErrorDetail(
            data.details.detail[0]
          )}`;
        } else {
          message = cleanErrorDetail(data.details.detail[0]);
        }
      } else if (
        data.non_field_errors &&
        Array.isArray(data.non_field_errors)
      ) {
        message = cleanErrorDetail(data.non_field_errors[0]);
      } else if (data.username && Array.isArray(data.username)) {
        message = cleanErrorDetail(data.username[0]);
      } else if (data.password && Array.isArray(data.password)) {
        message = cleanErrorDetail(data.password[0]);
      } else if (data.error && typeof data.error === "string") {
        message = data.error;
      } else if (data.detail) {
        message = cleanErrorDetail(data.detail);
      }
    } else if (error.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export const createAxiosInstanceWithToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
};

export const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
  });
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const logoutUser = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
