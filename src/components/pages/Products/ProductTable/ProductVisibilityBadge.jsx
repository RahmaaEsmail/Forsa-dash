import React from 'react'

export default function ProductVisibilityBadge({ value }) {
  const v = String(value || "").toLowerCase();
  const isPublished = v === "published";

  return (
    <span
      className={[
        "inline-flex items-center justify-center gap-2",
        "h-5 px-3 rounded-[4px]! border",
        "text-[11px] font-semibold leading-5",
        isPublished
          ? "bg-success/15 border-success/30 text-success"
          : "bg-danger/15 border-danger/30 text-danger",
      ].join(" ")}
    >
      <span
        className={[
          "w-1 h-1 rounded-full",
          isPublished ? "bg-success" : "bg-danger",
        ].join(" ")}
      />
      {value}
    </span>
  );
}
