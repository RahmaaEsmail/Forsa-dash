import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function MarkPaidModal({ open, onOpenChange, onConfirm, isLoading }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("attachments[]", file);
    });
    onConfirm(formData);
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 font-black">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Mark Invoice as Paid
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-500">
            Upload any payment proofs, bank receipts, or transaction records to attach to this invoice.
          </p>

          {/* Drag & Drop Zone */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5"
          >
            <input 
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, or Excel up to 10MB each</p>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected files ({selectedFiles.length})</p>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[280px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="w-7 h-7 hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            className="rounded-xl h-10 px-4" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl h-10 px-6 shadow-md shadow-primary/10"
          >
            {isLoading ? "Marking Paid..." : "Confirm & Mark Paid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
