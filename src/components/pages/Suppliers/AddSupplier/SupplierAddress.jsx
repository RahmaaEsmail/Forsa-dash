import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import CustomInput from "../../../shared/CustomInput";
import CustomSelect from "../../../shared/CustomSelect";
import { Button } from "../../../ui/button";
import { Plus, Trash2, MapPin, Globe, Building2 } from "lucide-react";

export default function SupplierAddress() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Addresses</h3>
          <p className="text-sm text-slate-500">Add physical and billing addresses</p>
        </div>
        <Button
          type="button"
          onClick={() => append({ 
            type: "both", label: "", address_line_1: "", address_line_2: "", city: "", state: "", postal_code: "", country: "Saudi Arabia", is_default: true 
          })}
          className="flex gap-2 items-center bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Address
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
                label="Address Type"
                control={control}
                name={`addresses.${index}.type`}
                options={[
                  { label: "Both", value: "both" },
                  { label: "Shipping", value: "shipping" },
                  { label: "Billing", value: "billing" },
                ]}
                errors={errors?.addresses?.[index]?.type}
              />
              <CustomInput
                label="Label"
                register={register}
                name={`addresses.${index}.label`}
                placeholder="e.g. Main Office, Warehouse"
                icon={<Building2 className="w-4 h-4 text-slate-400" />}
                errors={errors}
              />
              <CustomInput
                label="Address Line 1"
                register={register}
                name={`addresses.${index}.address_line_1`}
                isRequired={false}
                placeholder="Street, Building No."
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                errors={errors}
              />
              <CustomInput
                label="Address Line 2"
                register={register}
                name={`addresses.${index}.address_line_2`}
                placeholder="District, Suite"
                errors={errors}
              />
              <CustomInput
                label="City"
                register={register}
                name={`addresses.${index}.city`}
                isRequired={true}
                placeholder="Enter City"
                errors={errors}
              />
              <CustomInput
                label="State / Province"
                register={register}
                name={`addresses.${index}.state`}
                placeholder="Enter State"
                errors={errors}
              />
              <CustomInput
                label="Postal Code"
                register={register}
                name={`addresses.${index}.postal_code`}
                placeholder="12345"
                errors={errors}
              />
              <CustomInput
                label="Country"
                register={register}
                name={`addresses.${index}.country`}
                isRequired={false}
                placeholder="Saudi Arabia"
                icon={<Globe className="w-4 h-4 text-slate-400" />}
                errors={errors}
              />

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id={`addr-default-${index}`}
                  {...register(`addresses.${index}.is_default`)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`addr-default-${index}`} className="text-sm font-medium text-slate-700">Set as Default Address</label>
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">No addresses added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
