"use client";

export const dynamic = "force-dynamic";  

import CustomButton from "@/components/CustomButton";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import apiClient from "@/app/lib/api";
import { setToken, setUser, setCredentials } from "@/lib/auth";

const isValidEmailAddressFormat = (input: string) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(input);
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const expired = searchParams.get("expired");
    if (expired === "true") {
      setError("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget[0] as HTMLInputElement;
    const password = e.currentTarget[1] as HTMLInputElement;

    if (!isValidEmailAddressFormat(email.value)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password.value || password.value.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    try {
      const response = await apiClient.login({ 
        email: email.value, 
        password: password.value 
      });
      
      if (response.success && response.token) {
        // Store token and user info
        setToken(response.token);
        setUser({
          userId: response.userId,
          email: response.email,
        });
        // Store credentials for token validation
        setCredentials(email.value, password.value);
        
        setError("");
        toast.success("Successful login");
        router.push("/");
      } else {
        setError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
      }
    } catch (err: any) {
      const message = err.message || "Invalid email or password";
      setError(message);
      toast.error(message);
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

            <div>
              <CustomButton
                buttonType="submit"
                text="LOGIN"
                paddingX={3}
                paddingY={3}
                customWidth="full"
                textSize="base"
               />
            </div>
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