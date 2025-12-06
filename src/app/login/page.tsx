// "use client";

// export const dynamic = "force-dynamic"; // ⬅ Fixes useSearchParams prerender error

// import CustomButton from "@/components/CustomButton";
// import SectionTitle from "@/components/SectionTitle";

// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import apiClient from "@/app/lib/api";

// const isValidEmailAddressFormat = (input: string) => {
//   const regex = /^\S+@\S+\.\S+$/;
//   return regex.test(input);
// };

// const LoginPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const expired = searchParams.get("expired");
//     if (expired === "true") {
//       setError("Your session has expired. Please log in again.");
//       toast.error("Your session has expired. Please log in again.");
//     }
//   }, [router, searchParams]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const email = e.currentTarget[0] as HTMLInputElement;
//     const password = e.currentTarget[1] as HTMLInputElement;

//     if (!isValidEmailAddressFormat(email.value)) {
//       setError("Email is invalid");
//       toast.error("Email is invalid");
//       return;
//     }

//     if (!password.value || password.value.length < 8) {
//       setError("Password is invalid");
//       toast.error("Password is invalid");
//       return;
//     }

//     try {
//       await apiClient.login({ email: email.value, password: password.value });
//       setError("");
//       toast.success("Successful login");
//       router.push("/");
//     } catch (err: any) {
//       const message = err.message || "Invalid email or password";
//       setError(message);
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="bg-white">
//       <SectionTitle title="Login" path="Home | Login" />
//       <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <h2 className="mt-6 text-center text-2xl font-normal leading-9 tracking-tight text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>

//         <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
//           <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* email */}
//               <div>
//                 <label className="block text-sm font-medium leading-6 text-gray-900">
//                   Email address
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                   />
//                 </div>
//               </div>

//               {/* password */}
//               <div>
//                 <label className="block text-sm font-medium leading-6 text-gray-900">
//                   Password
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     required
//                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                   />
//                 </div>
//               </div>

//               {/* remember */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 rounded border-gray-300 text-black"
//                   />
//                   <label className="ml-3 block text-sm text-gray-900">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <a href="#" className="font-semibold text-black">
//                     Forgot password?
//                   </a>
//                 </div>
//               </div>

//               <div>
//                 <CustomButton
//                   buttonType="submit"
//                   text="Sign in"
//                   paddingX={3}
//                   paddingY={1.5}
//                   customWidth="full"
//                   textSize="sm"
//                 />
//               </div>
//             </form>

//             <p className="text-red-600 text-center text-[16px] my-4">
//               {error && error}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
export default function Page() {
  return <div>Events page</div>;
}
