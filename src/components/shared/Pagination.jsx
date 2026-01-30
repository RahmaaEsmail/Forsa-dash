import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  per_page = 5,
  total = 0,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / per_page));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const from = total === 0 ? 0 : (safePage - 1) * per_page + 1;
  const to = total === 0 ? 0 : Math.min(safePage * per_page, total);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  const goPrev = () => {
    if (!canPrev) return;
    onPageChange?.(safePage - 1);
  };

  const goNext = () => {
    if (!canNext) return;
    onPageChange?.(safePage + 1);
  };

  const formatRange = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex justify-between items-center">
      <p className="text-secondary font-normal text-base">
        Showing {formatRange(from)}-{formatRange(to)} of {total}
      </p>

      <div className="bg-white px-3 flex justify-between items-center w-[129px] h-[33px] border border-[#E6EFF5] rounded-md">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev}
          className={[
            "inline-flex items-center justify-center",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          ].join(" ")}
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canNext}
          className={[
            "inline-flex items-center justify-center",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          ].join(" ")}
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
