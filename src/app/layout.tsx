// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
 
// const inter = Inter({ 
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["system-ui", "arial"],
// });

// export const metadata: Metadata = {
//   title: " Management Dashboard",
//   description: "  Management System",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";
 
 
export const metadata = {
  title: "Complaint Management System",
  description: "Admin dashboard for managing complaints",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={" bg-[#E6ECF5]"}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
