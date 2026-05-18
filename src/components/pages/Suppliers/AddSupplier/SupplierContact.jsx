import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import CustomInput from "../../../shared/CustomInput";
import { Button } from "../../../ui/button";
import { Plus, Trash2, User, Phone, Mail, MessageSquare } from "lucide-react";

export default function SupplierContact() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contact Persons</h3>
          <p className="text-sm text-slate-500">Manage multiple contacts for this supplier</p>
        </div>
        <Button
          type="button"
          onClick={() => append({ 
            name: "", position: "", email: "", phone: "", mobile: "", whatsapp: "", is_primary: false, receive_notifications: true 
          })}
          className="flex gap-2 items-center bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Contact
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
                label="Full Name"
                register={register}
                name={`contacts.${index}.name`}
                isRequired={true}
                placeholder="Enter contact name"
                icon={<User className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Position"
                register={register}
                name={`contacts.${index}.position`}
                placeholder="e.g. Sales Manager"
              />
              <CustomInput
                label="Email"
                type="email"
                register={register}
                name={`contacts.${index}.email`}
                placeholder="email@example.com"
                icon={<Mail className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Phone"
                register={register}
                name={`contacts.${index}.phone`}
                placeholder="+966..."
                icon={<Phone className="w-4 h-4 text-slate-400" />}
              />
              <CustomInput
                label="Mobile"
                register={register}
                name={`contacts.${index}.mobile`}
                placeholder="+966..."
              />
              <CustomInput
                label="WhatsApp"
                register={register}
                name={`contacts.${index}.whatsapp`}
                placeholder="+966..."
                icon={<MessageSquare className="w-4 h-4 text-slate-400" />}
              />

              <div className="flex items-center gap-6 pt-4 lg:col-span-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`primary-${index}`}
                    {...register(`contacts.${index}.is_primary`)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`primary-${index}`} className="text-sm font-medium text-slate-700">Primary Contact</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`notify-${index}`}
                    {...register(`contacts.${index}.receive_notifications`)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`notify-${index}`} className="text-sm font-medium text-slate-700">Receive Notifications</label>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {fields.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">No contacts added yet. Click "Add Contact" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
