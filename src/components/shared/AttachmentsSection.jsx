import React, { useRef, useState } from "react";
import { Upload, X, FileText, Trash2, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function AttachmentsSection({
  isReadOnly = false,
  isEdit = false,
  existingAttachments = [],
  onDeleteExisting,
  onUploadNew,
  isUploading = false,
  isDeleting = false
}) {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);

  // Watch create-time selected attachments from react-hook-form
  const newAttachments = watch("attachments") || [];

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (isEdit && onUploadNew) {
      // In edit mode: upload files immediately
      for (const file of files) {
        const formData = new FormData();
        formData.append("attachments[]", file);
        await onUploadNew(formData);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      // In create mode: store files in react-hook-form state
      const updated = [...newAttachments, ...files];
      // Deduplicate by name and size
      const deduped = updated.filter(
        (f, idx, arr) =>
          idx ===
          arr.findIndex((x) => x.name === f.name && x.size === f.size)
      );
      setValue("attachments", deduped);
    }
  };

  const removeNewFile = (index) => {
    const next = newAttachments.filter((_, i) => i !== index);
    setValue("attachments", next);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    if (isEdit && onUploadNew) {
      for (const file of files) {
        const formData = new FormData();
        formData.append("attachments[]", file);
        await onUploadNew(formData);
      }
    } else {
      const updated = [...newAttachments, ...files];
      const deduped = updated.filter(
        (f, idx, arr) =>
          idx ===
          arr.findIndex((x) => x.name === f.name && x.size === f.size)
      );
      setValue("attachments", deduped);
    }
  };

  const handleDeleteClick = async (docId) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      setDeletingId(docId);
      try {
        await onDeleteExisting(docId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatSize = (bytes = 0) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Existing Attachments (Edit & View Mode) */}
      {existingAttachments && existingAttachments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Existing Attachments ({existingAttachments.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingAttachments.map((file, idx) => {
              const fileName = file.name || file.file_name || file.path?.split("/").pop() || `Attachment ${idx + 1}`;
              const fileUrl = file.url || file.file_url || file.path;
              const isItemDeleting = deletingId === file.id;

              return (
                <div
                  key={file.id || idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl group hover:border-primary/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8.5 h-8.5 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[200px] md:max-w-[240px]">
                        {fileName}
                      </span>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-primary hover:underline font-semibold mt-0.5"
                      >
                        View Original
                      </a>
                    </div>
                  </div>

                  {!isReadOnly && isEdit && onDeleteExisting && (
                    <button
                      type="button"
                      disabled={isDeleting || isItemDeleting}
                      onClick={() => handleDeleteClick(file.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      {isItemDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Zone (Create & Edit Mode) */}
      {!isReadOnly && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            {isEdit ? "Upload Additional Attachments" : "Attachments"}
          </h4>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            {isUploading ? (
              <div className="bg-primary/10 p-3 rounded-2xl text-primary animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <Upload className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-700">
                {isUploading ? "Uploading attachment..." : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Any document or files up to 10MB
              </p>
            </div>
          </div>

          {/* Selected files to upload (Create Mode only) */}
          {!isEdit && newAttachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Files to Upload ({newAttachments.length})
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {newAttachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[180px] md:max-w-[220px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {formatSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
