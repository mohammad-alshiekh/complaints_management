"use client";
import React, { useEffect, useState } from "react";
import StatusBadge from "@/components/status_badge";

type ComplaintResponse = {
  status: string;
};

export default function StatusTestPage() {
  const [data, setData] = useState<ComplaintResponse | null>(null);

  useEffect(() => {
    async function load() {
    //   const result = await getComplaintStatus(12);
    //   setData(result);
    }

    load();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold mb-4">Complaint Status</h1>

        {data ? (
          <StatusBadge status={data.status} />
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}


