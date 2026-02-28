import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import CustomSelect from '../../shared/CustomSelect';
import { useForm } from 'react-hook-form';
import useChangePurchaseStatus from '../../../hooks/purchaseRequest/useChangePurchaseStatus';
import { toast } from 'sonner';

const status_options = [
  {
    label: "Approved",
    value: "approve",
  },
  {
    label: "Submitted",
    value: "submit",
  },
  {
    label: "Reject",
    value: "reject",
  },
  {
    label: "Cancel",
    value: "cancel",
  },
  {
    label: "Draft",
    value: "revert-to-draft"
  }
];

export default function ChangePurchaseStatusModal({ open, setOpen, currentStatus, id, onSuccess }) {
  const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: "",
      reason: "",
    }
  });

  const selectedStatus = watch("status");
  
  const { mutate, isPending, isSuccess, isError, error } = useChangePurchaseStatus();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        status: "",
        reason: "",
      });
    }
  }, [open, reset]);

  // Handle success/error side effects
  useEffect(() => {
    if (isSuccess) {
      toast.success('Status updated successfully');
      setOpen(false);
      if (onSuccess) onSuccess();
    }
  }, [isSuccess, setOpen, onSuccess]);


  // Handle form submission
  const handleFormSubmit = (values) => {
    // Prepare the request body based on status
    let body = {};
    
    if (values.status === 'reject' && values.reason) {
      body = { rejection_reason: values.reason };
    } else if (values.status === 'cancel' && values.reason) {
      body = { cancellation_reason: values.reason };
    }
    
    // If no reason needed, body remains empty object {}
    
    mutate({ 
      id, 
      status: values.status,
      body 
    });
  };

  // Get status label for display
  const getStatusLabel = (statusValue) => {
    const option = status_options.find(opt => opt.value === statusValue);
    return option ? option.label : "None selected";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Purchase Request Status</DialogTitle>
          <DialogDescription>
            Current status: <span className="font-semibold">{currentStatus || "Unknown"}</span>
            {selectedStatus && (
              <span className="block mt-1 text-sm">
                New status: <span className="font-semibold text-primary">{getStatusLabel(selectedStatus)}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Status Selector */}
          <div className="mb-4">
            <CustomSelect
              options={status_options}
              control={control}
              isRequired={true}
              name="status"
              label="Choose New Status"
              placeholder="Select a status"
              errors={errors}
            />
          </div>

          {/* Conditional Reason Input (appears only for "reject" or "cancel") */}
          {(selectedStatus === "reject" || selectedStatus === "cancel") && (
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium mb-1">
                Reason <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("reason", { 
                  required: selectedStatus === "reject" || selectedStatus === "cancel" 
                    ? "Reason is required"
                    : false 
                })}
                id="reason"
                placeholder={`Enter reason for ${getStatusLabel(selectedStatus)}`}
                className="w-full"
                disabled={isPending}
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button 
                type="button" 
                onClick={() => setOpen(false)} 
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              variant="default"
              disabled={!selectedStatus || isPending}
            >
              {isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}