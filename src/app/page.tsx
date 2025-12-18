"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, getCredentials, setToken, setUser, removeToken, removeCredentials } from "@/lib/auth";
import apiClient from "@/app/lib/api";

const Homepage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      // If no token, redirect to login
      if (!token) {
        router.push("/login");
        return;
      }

      // If token exists, validate it by making a POST request to login endpoint
      const credentials = getCredentials();
      if (credentials) {
        try {
          // Validate token by attempting to login again
          const response = await apiClient.validateToken({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.success && response.token) {
            // Token is valid, update token and user info
            setToken(response.token);
            setUser({
              userId: response.userId,
              email: response.email,
            });
            // Redirect to dashboard
            const redirect = searchParams.get("redirect");
            router.push(redirect || "/dashboard");
          } else {
            // Login failed, clear token and redirect to login
            removeToken();
            removeCredentials();
            router.push("/login?expired=true");
          }
        } catch (error) {
          // Login failed, clear token and redirect to login
          removeToken();
          removeCredentials();
          router.push("/login?expired=true");
        }
      } else {
        // No credentials stored, redirect to login
        removeToken();
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
};

export default Homepage;
