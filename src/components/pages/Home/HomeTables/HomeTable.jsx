import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { DatePicker } from "./DatePicker";


const thBase =
  " py-4 text-[13px] border-none! font-semibold text-secondary whitespace-nowrap";
const tdBase =
  "py-4 text-sm font-normal text-secondary whitespace-nowrap";
const rowBase = "border-none! even:bg-[#F6F8FB]";

export default function HomeTable({
  title = "Top 5 supplier value",
  data = [],
  headerTitle,
  page = 1,
  perPage = 5,
  total, // لو مش مبعوتة هنحسبها من data.length
  onPageChange,
}) {
  const safeTotal = typeof total === "number" ? total : data.length;

  const totalPages = Math.max(1, Math.ceil(safeTotal / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const from = safeTotal === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = safeTotal === 0 ? 0 : Math.min(safePage * perPage, safeTotal);
  const rangeLabel = `${from}-${to}`;

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  return (
    <div className="bg-white rounded-main p-4 overflow-hidden border border-[#E6EFF5]">
      {/* Header */}
      <div className="flex ms-auto w-fit  items-center gap-3 text-secondary">
        <button
          type="button"
          onClick={() => canPrev && onPageChange?.(safePage - 1)}
          disabled={!canPrev}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-semibold">{rangeLabel}</span>

        <button
          type="button"
          onClick={() => canNext && onPageChange?.(safePage + 1)}
          disabled={!canNext}
          className="disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="pt-8 pb-4 flex items-center justify-between gap-6">
        <h2 className="font-bold  text-secondary text-large">{title}</h2>

        <div className="flex flex-col  gap-3">
          <DatePicker />
        </div>
      </div>

      {/* Table */}
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow className={"border-none! border-0!"}>
            <TableHead className={`${thBase} text-left`}>
              <span className="inline-flex items-center gap-2">
                {headerTitle}
              </span>
            </TableHead>

            <TableHead className={`${thBase} text-right`}>
              <span className="inline-flex items-center gap-2 justify-end w-full">
                <img
                  src="/images/streamline-logos_virustotal-logo-solid.svg"
                  className="w-4 h-4"
                  alt=""
                />
                <span>Total Amount</span>
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className={rowBase}>
              <TableCell className={`${tdBase} text-left`}>
                {row.vendor}
              </TableCell>

              <TableCell className={`${tdBase} text-right`}>
                {row.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
