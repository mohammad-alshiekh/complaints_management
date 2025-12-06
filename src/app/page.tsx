"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getCredentials, setToken, setUser, removeToken, removeCredentials } from "@/lib/auth";
import apiClient from "@/app/lib/api";

const Homepage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
            router.push("/admin");
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
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <div className=""></div>;
};

export default Homepage;
