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
import CustomInput from "../../shared/CustomInput"
import CustomSelect from "../../shared/CustomSelect"

export default function PaymentReceivedModal({ open, onOpenChange, onConfirm, isLoading }) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      payment_type: 'full_payment',
      amount: ''
    }
  });

  const paymentType = watch("payment_type");

  const onSubmit = (data) => {
    onConfirm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment Received</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomSelect
            control={control}
            name="payment_type"
            label="Payment Type"
            isRequired={true}
            options={[
              { value: 'full_payment', label: 'Full Payment' },
              { value: 'partial_payment', label: 'Partial Payment' },
              { value: 'on_credit', label: 'On Credit' }
            ]}
          />

          {paymentType === 'partial_payment' && (
            <CustomInput
              register={register}
              name="amount"
              label="Amount Paid"
              type="number"
              placeholder="Enter amount"
              isRequired={true}
              errors={errors.amount}
            />
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isLoading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isLoading ? "Recording..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
