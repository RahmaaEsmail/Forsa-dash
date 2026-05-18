import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';

export default function CancelRFQModal({ open, onOpenChange, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-secondary text-center">Cancel RFQ</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Please enter the reason for canceling this Request for Quotation.
          </p>
          <Textarea 
            placeholder="Enter cancellation reason here..." 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] bg-input-bg border-none rounded-xl"
          />
        </div>
        <DialogFooter className="flex justify-center gap-3 sm:justify-center">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-primary text-primary hover:bg-primary/5 px-8"
          >
            Go Back
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            {isLoading ? "Canceling..." : "Confirm Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
