import { Upload, X, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ProductAttachementInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const accept =
    ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg";

  const formatSize = (bytes = 0) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const iconFor = (file) => {
    const type = (file?.type || "").toLowerCase();
    if (type.includes("image")) return <ImageIcon className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-normal text-secondary">
        Attach datasheets, test certificates, or any other supporting documents.
      </p>

      <Controller
        control={control}
        name="attachment" // خليه Array: File[]
        defaultValue={[]} // مهم
        render={({ field }) => {
          const files = Array.isArray(field.value) ? field.value : [];

          const removeFile = (index) => {
            const next = files.filter((_, i) => i !== index);
            field.onChange(next);
          };

          const clearAll = () => field.onChange([]);

          return (
            <>
              <label htmlFor="attachment_file" className="cursor-pointer">
                <div className="w-full flex flex-col gap-2 rounded-main justify-center items-center h-50 border border-dashed border-primary">
                  <Upload className="w-10 h-10 font-bold" />
                  <div className="flex flex-col gap-2 items-center text-center">
                    <h5 className="text-xl">
                      Drag & drop files here or click to browse
                    </h5>

                    {files.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Selected: {files.length} file{files.length > 1 ? "s" : ""}
                      </p>
                    ) : null}
                  </div>
                </div>

                <input
                  id="attachment_file"
                  type="file"
                  multiple
                  className="hidden"
                  accept={accept}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const selected = Array.from(e.target.files || []);
                    if (selected.length === 0) return;

                    // ✅ merge مع القديم (ولو عايز replace بس: field.onChange(selected))
                    const merged = [...files, ...selected];

                    // ✅ منع الدوبلكيت بالاسم+الحجم (اختياري)
                    const deduped = merged.filter(
                      (f, idx, arr) =>
                        idx ===
                        arr.findIndex(
                          (x) => x.name === f.name && x.size === f.size
                        )
                    );

                    field.onChange(deduped);

                    // مهم عشان تقدر تختار نفس الملف تاني
                    e.target.value = "";
                  }}
                />
              </label>

              {/* Errors */}
              {errors?.attachment?.message ? (
                <p className="text-sm text-red-500">{errors.attachment.message}</p>
              ) : null}

              {/* Files List */}
              {files.length > 0 ? (
                <div className="mt-2 rounded-main border border-border/60 bg-white">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                    <p className="text-sm font-medium text-secondary">
                      Attachments
                    </p>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear all
                    </button>
                  </div>

                  <div className="divide-y divide-border/60">
                    {files.map((file, i) => (
                      <div
                        key={`${file.name}-${file.size}-${i}`}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-input-bg flex items-center justify-center">
                            {iconFor(file)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-secondary">
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {file.type || "unknown"} • {formatSize(file.size)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-black/[0.05]"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          );
        }}
      />
    </div>
  );
}
