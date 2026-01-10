import React from "react";

export const TableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-100 rounded" />
            <div className="w-48 h-3 bg-gray-50 rounded" />
          </div>
        </div>
        <div className="w-20 h-6 bg-gray-50 rounded-full" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-50 rounded-lg" />
          <div className="w-8 h-8 bg-gray-50 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-80 animate-pulse bg-gray-50/50 rounded-2xl flex flex-col p-6 space-y-4">
    <div className="flex justify-between items-end h-full w-full gap-4">
      <div className="w-full h-[40%] bg-gray-100 rounded-t-lg" />
      <div className="w-full h-[70%] bg-gray-200 rounded-t-lg" />
      <div className="w-full h-[55%] bg-gray-100 rounded-t-lg" />
      <div className="w-full h-[85%] bg-gray-200 rounded-t-lg" />
      <div className="w-full h-[45%] bg-gray-100 rounded-t-lg" />
      <div className="w-full h-[65%] bg-gray-200 rounded-t-lg" />
      <div className="w-full h-[50%] bg-gray-100 rounded-t-lg" />
    </div>
    <div className="h-4 w-full bg-gray-100 rounded" />
  </div>
);

export const PieChartSkeleton = () => (
  <div className="w-full h-80 animate-pulse bg-gray-50/50 rounded-2xl flex flex-col items-center justify-center p-6 space-y-6">
    <div className="relative w-48 h-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-[16px] border-gray-200 border-t-transparent border-r-transparent rotate-45" />
    </div>
    <div className="grid grid-cols-2 gap-4 w-full px-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-100" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-100" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

export const AgencySkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="w-full h-12 bg-gray-100 rounded-lg" />
    ))}
  </div>
);

export const ComplaintTableSkeleton = () => (
  <div className="w-full animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="h-16 border-b border-gray-50 bg-gray-50/50 px-6 flex items-center gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
      ))}
    </div>
    <div className="divide-y divide-gray-50">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-6">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-4 flex-[2] bg-gray-100 rounded" />
          <div className="h-6 w-24 bg-gray-50 rounded-full" />
          <div className="h-4 flex-1 bg-gray-50 rounded" />
          <div className="h-4 w-16 bg-gray-50 rounded" />
          <div className="h-4 w-24 bg-gray-50 rounded" />
          <div className="h-4 w-24 bg-gray-50 rounded" />
          <div className="h-8 w-24 bg-gray-100 rounded-full" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-8 w-20 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
