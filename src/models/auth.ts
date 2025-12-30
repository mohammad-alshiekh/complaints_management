export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  userRole: number; 
  success: boolean;
  message: string;
}

export interface User {
  userId: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}
