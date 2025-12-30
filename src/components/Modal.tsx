"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, children, onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-[#1E293B] text-lg tracking-tight">{title}</h3>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-200/50 rounded-xl transition-all text-gray-400 hover:text-gray-600"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  </div>
);
