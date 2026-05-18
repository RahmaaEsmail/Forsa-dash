import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import CustomInput from "../../../shared/CustomInput";
import CustomSelect from "../../../shared/CustomSelect";
import { Button } from "../../../ui/button";
import { Plus, Trash2, Landmark, User, Hash, Globe, MapPin } from "lucide-react";
import useCurrencies from "../../../../hooks/currencies/useCurrencies";

export default function SupplierBankAccounts() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bank_accounts",
  });

  const { data: currenciesResponse, isLoading: isCurrenciesLoading } = useCurrencies();
  const currenciesOptions = React.useMemo(() => {
    return currenciesResponse?.data?.map(curr => ({
      label: `${curr.code} - ${curr.name}`,
      value: curr.code
    })) || [];
  }, [currenciesResponse]);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Bank Accounts</h3>
          <p className="text-sm text-slate-500">Manage bank details for payments</p>
        </div>
        <Button
          type="button"
          onClick={() => append({ 
            bank_name: "", account_holder_name: "", account_number: "", iban: "", swift_code: "", branch: "", currency: "SAR", is_primary: true 
          })}
          className="flex gap-2 items-center bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Bank Account
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
              <CustomInput
                label="Bank Name"
                register={register}
                name={`bank_accounts.${index}.bank_name`}
                isRequired={true}
                placeholder="e.g. Al Rajhi Bank"
                icon={<Landmark className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Account Holder"
                register={register}
                name={`bank_accounts.${index}.account_holder_name`}
                isRequired={true}
                placeholder="Enter holder name"
                icon={<User className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Account Number"
                register={register}
                name={`bank_accounts.${index}.account_number`}
                isRequired={true}
                placeholder="Enter account number"
                icon={<Hash className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="IBAN"
                register={register}
                name={`bank_accounts.${index}.iban`}
                isRequired={true}
                placeholder="SA..."
              />
              <CustomInput
                label="SWIFT / BIC"
                register={register}
                name={`bank_accounts.${index}.swift_code`}
                placeholder="Enter SWIFT code"
              />
              <CustomInput
                label="Branch"
                register={register}
                name={`bank_accounts.${index}.branch`}
                placeholder="Enter branch name"
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
              <CustomSelect
                label="Currency"
                control={control}
                name={`bank_accounts.${index}.currency`}
                options={currenciesOptions}
                isRequired={true}
                isLoading={isCurrenciesLoading}
                placeholder="Select Currency"
                icon={<Globe className="w-4 h-4 text-slate-400" />}
              />

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id={`bank-primary-${index}`}
                  {...register(`bank_accounts.${index}.is_primary`)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`bank-primary-${index}`} className="text-sm font-medium text-slate-700">Primary Bank Account</label>
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">No bank accounts added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
