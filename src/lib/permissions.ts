export const ROLES = {
  ADMIN: 0,
  EMPLOYEE: 1,
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ALLOWED_PATHS: Record<Role, string[]> = {
  [ROLES.ADMIN]: [
    "/dashboard",
    "/list/complaints",
    "/list/users",
    "/list/employee",
    "/list/agencies",
    "/list/setting",
    "/profile",
    "/logout"
  ],
  [ROLES.EMPLOYEE]: [
    "/dashboard",
    "/list/complaints",
    "/profile",
    "/logout"
  ],
};

export function isPathAllowed(role: number | null, pathname: string): boolean {
  if (role === null) return false;
  
  // Admin has access to everything under dashboard
  if (role === ROLES.ADMIN) return true;
  
  const allowedPaths = ALLOWED_PATHS[role as Role] || [];
  
  return allowedPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );
}
