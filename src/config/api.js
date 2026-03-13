const DEFAULT_API_BASE_URL = "http://127.0.0.1:1234";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;

export const buildApiUrl = (path = "") => {
  const normalizedPath = String(path).startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

