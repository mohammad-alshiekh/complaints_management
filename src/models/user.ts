export interface User {
  id: string;
  fullName: string;
  email: string;
  governmentEntityId: string;
  status?: "Active" | "Suspended";
}

export interface Agency {
  id: string;
  name: string;
}
