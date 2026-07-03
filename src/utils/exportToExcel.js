import * as XLSX from 'xlsx';

/**
 * Exports an array of objects to an Excel (.xlsx) file and triggers download.
 *
 * @param {Object[]} data       - Array of row objects
 * @param {string}  filename    - Output filename without extension
 * @param {Object}  [colMap]    - Optional mapping { dataKey: 'Header Label' }
 *                                If omitted, uses the raw object keys as headers.
 */
export function exportToExcel(data = [], filename = 'export', colMap = null) {
  if (!data.length) return;

  let rows;

  if (colMap) {
    // Map to human-readable headers
    rows = data.map((row) => {
      const out = {};
      Object.entries(colMap).forEach(([key, label]) => {
        const val = key.split('.').reduce((acc, k) => acc?.[k], row);
        out[label] = val ?? '';
      });
      return out;
    });
  } else {
    // Strip React elements — keep only serialisable primitives
    rows = data.map((row) => {
      const out = {};
      Object.entries(row).forEach(([k, v]) => {
        if (v === null || v === undefined) {
          out[k] = '';
        } else if (typeof v === 'object') {
          // Flatten one level (e.g. name.en)
          out[k] = JSON.stringify(v);
        } else {
          out[k] = v;
        }
      });
      return out;
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
