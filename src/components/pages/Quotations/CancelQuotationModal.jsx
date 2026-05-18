import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { AlertCircle } from 'lucide-react'

export default function CancelQuotationModal({ open, onOpenChange, onConfirm, isLoading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      reason: ''
    }
  });

  const onSubmit = (data) => {
    onConfirm(data);
  };

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Cancel Quotation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("reason", { 
                required: "Reason is required",
                maxLength: { value: 2000, message: "Reason cannot exceed 2000 characters" }
              })}
              className="w-full min-h-[120px] p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              placeholder="Please provide a reason for cancelling this quotation..."
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
            )}
          </div>
          <p className="text-xs text-slate-500 italic">
            Note: This action will change the quotation status to cancelled and cannot be undone.
          </p>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 font-bold"
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
