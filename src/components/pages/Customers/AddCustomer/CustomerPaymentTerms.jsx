import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import CustomInput from "../../../shared/CustomInput";
import CustomSelect from "../../../shared/CustomSelect";
import { Button } from "../../../ui/button";
import { Plus, Trash2, CreditCard, Clock, ShieldCheck } from "lucide-react";
import useListPaymentTerms from "../../../../hooks/paymentTerms/useListPaymentTerms";

export default function CustomerPaymentTerms() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms",
  });

  const { data: termsResponse, isLoading } = useListPaymentTerms();
  const termsOptions = React.useMemo(() => {
    return termsResponse?.data?.map(term => ({
      label: term?.name?.en || `Term #${term.id}`,
      value: term.id.toString()
    })) || [];
  }, [termsResponse]);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Payment Terms</h3>
          <p className="text-sm text-slate-500">Configure credit limits and payment conditions</p>
        </div>
        <Button
          type="button"
          onClick={() => append({ 
            payment_term_id: "", credit_limit: "", credit_days: "", credit_status: "approved", is_default: true 
          })}
          className="flex gap-2 items-center bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Payment Term
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative group animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <CustomSelect
                label="Payment Term"
                control={control}
                name={`payment_terms.${index}.payment_term_id`}
                options={termsOptions}
                isRequired={true}
                isLoading={isLoading}
                placeholder="Select payment term"
              />
              <CustomInput
                label="Credit Limit"
                register={register}
                name={`payment_terms.${index}.credit_limit`}
                type="number"
                placeholder="e.g. 100000"
                icon={<CreditCard className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Credit Days"
                register={register}
                name={`payment_terms.${index}.credit_days`}
                type="number"
                placeholder="e.g. 30"
                icon={<Clock className="w-4 h-4 text-slate-400" />}
              />
              <CustomSelect
                label="Credit Status"
                control={control}
                name={`payment_terms.${index}.credit_status`}
                options={[
                  { label: "Approved", value: "approved" },
                  { label: "Pending", value: "pending" },
                  { label: "On Hold", value: "on_hold" },
                ]}
                icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
              />

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id={`term-default-${index}`}
                  {...register(`payment_terms.${index}.is_default`)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`term-default-${index}`} className="text-sm font-medium text-slate-700">Default Payment Term</label>
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">No payment terms added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
