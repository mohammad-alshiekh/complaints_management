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
