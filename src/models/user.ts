export interface User {
  id: string;
  fullName: string;
  email: string;
  governmentEntityId: string;
  role?: string;
  department?: string;
  phoneNumber?: string;
  status?: "Active" | "Suspended" | "Inactive";
  createdAt?: string;
}

export interface Agency {
  id: string;
  name: string;
  code?: string;
  address?: string;
}
