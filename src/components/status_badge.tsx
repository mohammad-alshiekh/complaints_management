"use client";

const statusStyles = {
  New: "bg-blue-500 text-white",
  "In-Progress": "bg-yellow-500 text-black",
  Completed: "bg-green-600 text-white",
  Rejected: "bg-red-600 text-white",
};

const statusArabic = {
  New: "جديدة",
  "In-Progress": "قيد المعالجة",
  Completed: "مكتملة",
  Rejected: "مرفوضة",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-400 text-white";
  const label = statusArabic[status as keyof typeof statusArabic] || "غير معروف";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>
      {label}
    </span>
  );
}
