import RouteGuard from "@/components/RouteGuard";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["admin"]} redirectTo="/dashboard">
      {children}
    </RouteGuard>
  );
}
