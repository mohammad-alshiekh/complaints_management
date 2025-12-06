// Token management utilities

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  success: boolean;
  message: string;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = (): { userId: string; email: string } | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: { userId: string; email: string }): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
};

export const getCredentials = (): { email: string; password: string } | null => {
  if (typeof window === "undefined") return null;
  const credsStr = localStorage.getItem("credentials");
  if (!credsStr) return null;
  try {
    return JSON.parse(credsStr);
  } catch {
    return null;
  }
};

export const setCredentials = (email: string, password: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("credentials", JSON.stringify({ email, password }));
};

export const removeCredentials = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("credentials");
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

