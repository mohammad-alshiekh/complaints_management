import { LoginResponse,  Credentials, UserSession } from "@/models/auth";

export const setUserRole = (role: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("userRole", role.toString());
};

export const getUserRole = (): number | null => {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem("userRole");
  return role ? Number(role) : null;
};
 export const removeUserRole = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userRole");
};

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
  localStorage.removeItem("userRole");

};

export const getUser = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: UserSession): void => {
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

