"use client";

export const dynamic = "force-dynamic";  

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { setToken, setUser, setCredentials, setUserRole } from "@/lib/auth";

const isValidEmailAddressFormat = (input: string) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const expired = searchParams.get("expired");
    if (expired === "true") {
      setError("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const email = e.currentTarget[0] as HTMLInputElement;
    const password = e.currentTarget[1] as HTMLInputElement;

    if (!isValidEmailAddressFormat(email.value)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      setIsLoading(false);
      return;
    }

    if (!password.value || password.value.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.login({ 
        email: email.value, 
        password: password.value 
      });
      
      if (response.success && response.token) {

         if (response.userRole !== 0 && response.userRole !== 1) {
          toast.error("You are not authorized to access this system");
          setIsLoading(false);
          return;
        }
      
         setToken(response.token);
      
         setUser({
          userId: response.userId,
          email: response.email,
        });
      
         setUserRole(response.userRole);
      
         setCredentials(email.value, password.value);
      
        toast.success("Successful login");
        
        // Redirect based on role
        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.push(redirect);
        } else if (response.userRole === 1) {
          // Employee role -> redirect to standalone complaints page
          router.push("/complaints");
        } else {
          // Admin role (or others) -> redirect to dashboard
          router.push("/dashboard");
        }
      }
      else {
        setError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
        setIsLoading(false);
      }
    } catch (err: any) {
      // Handle different types of errors
      let message = "An error occurred during login";
      
      if (err.status === 0) {
        // Network error (CORS, connection refused, etc.)
        message = err.message || "Unable to connect to the server. Please check your internet connection.";
        
        // Log error details for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
          console.error("Login Error Details:", {
            message: err.message,
            details: err.details,
            url: err.details?.url,
          });
        }
      } else if (err.status === 401) {
        message = "Invalid email or password";
      } else if (err.status === 400) {
        message = err.message || "Invalid request. Please check your credentials.";
      } else if (err.status >= 500) {
        message = "Server error. Please try again later.";
      } else {
        message = err.message || "Login failed. Please try again.";
      }
      
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: Blue background with title and illustrations */}
      <div className="flex-1 bg-blue-600 flex flex-col justify-center items-center p-8 relative overflow-hidden">
        {/* Curved white overlay for right edge effect */}
        <div className="absolute right-0 top-0 bottom-0   bg-white rounded-l-full opacity-10"></div>
        
        <div className="text-center z-2 relative max-w-md">
          {/* Logo */}
          <div className="text-6xl font-serif text-blue-300 mb-4">SCGS</div>
          
          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-2">SMART CMS</h1>
          
          {/* Subtitle */}
          <p className="text-xl text-white opacity-90 mb-2">Automating Complaints Intelligently</p>
          
          {/* Placeholder for illustrations (gears, charts, people) - replace with actual SVGs/images if available */}
          <img 
            src="/ssss.png" 
            alt="Gears, charts, and people illustrations" 
            className="max-w-md mx-auto mb-8"
          />
        </div>
      </div>

      {/* Right side: White form area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 pr-10"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <input
                    id="show-password"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Forgot link */}
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Forget Username / Password?
            </a>
          </div>

          {/* Error message */}
          <p className="text-red-600 text-center text-sm mt-4">
            {error}
          </p>

       
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex bg-white">
        <div className="flex-1 bg-blue-600"></div>
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;