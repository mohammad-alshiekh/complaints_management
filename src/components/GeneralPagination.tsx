"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  label?: string;
}

export function GeneralPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  label = "items",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <p className="text-sm text-slate-500 font-medium order-2 sm:order-1">
        Showing <span className="text-slate-900 font-bold">{startItem}-{endItem}</span> of <span className="text-slate-900 font-bold">{totalItems}</span> {label}
      </p>
      
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-9 p-0 rounded-xl border-slate-200 disabled:opacity-40 hover:bg-white hover:shadow-sm transition-all"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                currentPage === page 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-slate-500 hover:bg-white hover:shadow-sm"
              }`}
            >
              {page}
            </button>
          ))}
          
          {totalPages > 5 && getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              <span className="text-slate-400 px-1">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all text-slate-500 hover:bg-white hover:shadow-sm`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 w-9 p-0 rounded-xl border-slate-200 disabled:opacity-40 hover:bg-white hover:shadow-sm transition-all"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
