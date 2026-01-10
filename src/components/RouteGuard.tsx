"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUserRole } from "@/lib/auth";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "user")[];
  redirectTo?: string;
}

export default function RouteGuard({
  children, 
  allowedRoles,
  redirectTo = "/dashboard",
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const userRole = getUserRole();

      // If no token, redirect to login
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const roleName = userRole === 0 ? "admin" : userRole === 1 ? "user" : null;

      // If route has specific role requirements
      if (allowedRoles && allowedRoles.length > 0) {
        
        if (!roleName || !allowedRoles.includes(roleName)) {
          // User doesn't have required role
          if (userRole === 1) {
            router.push("/complaints");
          } else {
            router.push(redirectTo);
          }
          return;
        }
      }

      // If no role but has token, user might not have role set yet
      if (userRole === null) {
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

