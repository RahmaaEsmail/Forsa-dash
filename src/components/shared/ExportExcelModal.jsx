import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { exportToExcel } from "../../utils/exportToExcel";
import { Search, FileSpreadsheet } from "lucide-react";

export default function ExportExcelModal({
  open,
  onOpenChange,
  data = [],
  selectedRowKeys = [],
  columnMap = {},
  filename = "export",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportRange, setExportRange] = useState("all");

  const columns = Object.entries(columnMap).map(([key, label]) => ({
    key,
    label,
  }));

  useEffect(() => {
    if (open) {
      setSelectedColumns(Object.keys(columnMap));
      if (selectedRowKeys.length > 0) {
        setExportRange("selected");
      } else {
        setExportRange("all");
      }
    }
  }, [open, columnMap, selectedRowKeys]);

  const filteredColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleColumn = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(Object.keys(columnMap));
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  const handleDownload = () => {
    let rowsToExport = data;
    if (exportRange === "selected" && selectedRowKeys.length > 0) {
      rowsToExport = data.filter((item) => selectedRowKeys.includes(item.id));
    }

    const filteredColumnMap = {};
    selectedColumns.forEach((key) => {
      filteredColumnMap[key] = columnMap[key];
    });

    exportToExcel(rowsToExport, filename, filteredColumnMap);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl gap-6 overflow-hidden">
        <DialogHeader className="gap-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Excel Export Configuration
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Customize the rows and columns you want to include in your downloaded Excel sheet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {selectedRowKeys.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Export Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportRange("selected")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                    exportRange === "selected"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-205 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="font-bold text-sm">Selected Rows Only</span>
                  <span className="text-xs opacity-80">({selectedRowKeys.length} items)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportRange("all")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                    exportRange === "all"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-205 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="font-bold text-sm">All Rows</span>
                  <span className="text-xs opacity-80">({data.length} items)</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Choose Columns
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-primary font-bold hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleSelectNone}
                  className="text-slate-500 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
              />
            </div>

            <div className="max-h-[220px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 p-1 bg-slate-50/50 space-y-0.5">
              {filteredColumns.length > 0 ? (
                filteredColumns.map((col) => {
                  const isChecked = selectedColumns.includes(col.key);
                  return (
                    <label
                      key={col.key}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white cursor-pointer select-none transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleColumn(col.key)}
                        className="h-4 w-4 rounded border-gray-305 text-primary focus:ring-primary cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {col.label}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No columns match your search.
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-200 text-slate-650 h-11 px-5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={selectedColumns.length === 0}
            className="rounded-xl bg-primary hover:bg-primary/90 font-bold h-11 px-6 shadow-md shadow-primary/10"
          >
            Download Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
