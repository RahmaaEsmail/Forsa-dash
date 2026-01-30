import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CustomEmptyData from "../shared/CustomEmptyData";
import { Loader2 } from "lucide-react";

export default function CustomTable({
  columns = [],
  dataSource = [],
  rowKey = "id",
  loading = false,

  // styles
  className = "",
  containerClassName = "bg-white px-5! rounded-main overflow-hidden border border-border/60",
  headerRowClassName = "border-b border-border/60",
  headerCellClassName = "p-6 text-base font-bold text-secondary whitespace-nowrap",
  bodyRowClassName = "border-b border-border/60 last:border-b-0 hover:bg-black/[0.02]",
  bodyCellClassName = "p-6 text-base text-center font-normal text-placeholder whitespace-nowrap",

  // empty
  emptyProps = {
    title: "No Data",
    description: "Nothing to show here.",
  },

  // row hooks
  rowClassName,
  onRow,
}) {
  const colCount = columns?.length || 1;

  const getRowKey = (record, index) => {
    if (typeof rowKey === "function") return rowKey(record, index);
    return record?.[rowKey] ?? index;
  };

  const resolveRowClassName = (record, index) => {
    const extra =
      typeof rowClassName === "function" ? rowClassName(record, index) : rowClassName;
    return `${bodyRowClassName} ${extra || ""}`.trim();
  };

  const resolveRowProps = (record, index) => {
    const props = typeof onRow === "function" ? onRow(record, index) : {};
    return props || {};
  };

  return (
    <div className={`${containerClassName} ${className}`.trim()}>
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow className={headerRowClassName}>
            {columns?.map((col, idx) => (
              <TableHead
                key={col?.key ?? col?.dataIndex ?? idx}
                className={`${headerCellClassName} ${col?.className || ""}`}
                style={{
                  width: col?.width,
                  textAlign: col?.align || "center",
                  ...(col?.style || {}),
                }}
              >
                {col?.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow className="border-b-0">
              <TableCell colSpan={colCount} className="p-10">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : dataSource?.length > 0 ? (
            dataSource.map((record, rowIndex) => (
              <TableRow
                key={getRowKey(record, rowIndex)}
                className={resolveRowClassName(record, rowIndex)}
                {...resolveRowProps(record, rowIndex)}
              >
                {columns.map((col, colIndex) => {
                  const value = col?.dataIndex ? record?.[col.dataIndex] : undefined;

                  return (
                    <TableCell
                      key={(col?.key ?? col?.dataIndex ?? colIndex) + "_" + rowIndex}
                      className={`${bodyCellClassName} ${col?.cellClassName || ""}`}
                      style={{
                        textAlign: col?.align || "center",
                        ...(col?.cellStyle || {}),
                      }}
                    >
                      {typeof col?.render === "function"
                        ? col.render(value, record, rowIndex)
                        : value ?? col?.fallback ?? "---"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b-0">
              <TableCell colSpan={colCount} className="p-6">
                <CustomEmptyData {...emptyProps} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
