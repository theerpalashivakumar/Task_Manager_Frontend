import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (!totalPages || totalPages <= 1) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-100">
      <div className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{startRecord}</span> to{' '}
        <span className="font-semibold text-slate-700">{endRecord}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-md text-slate-700">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
