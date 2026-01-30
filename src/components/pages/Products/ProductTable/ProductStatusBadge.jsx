import React from 'react'

export default function ProductStatusBadge({ value }) {
  const v = String(value || "").toLowerCase();
  const isActive = v?.toLowerCase() === "active"?.toLowerCase();

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-5 px-4 rounded-[4px]",
        "text-[11px] font-semibold leading-5",
        isActive ? "bg-success text-white" : "bg-danger text-white",
      ].join(" ")}
    >
      {value}
    </span>
  );
}