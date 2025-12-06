"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4);
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-full bg-[#f7fbfa] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-900/5 flex items-center justify-center text-2xl">
          👋
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          You are signed out
        </h1>
        <p className="text-sm text-gray-500">
          We cleared your local session. You will be redirected to the login
          page in {countdown} seconds.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800"
        >
          Go to login now
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;

