import React from "react"
import { Card } from "../../ui/card"
import CustomInput from "../../shared/CustomInput"
import CustomSelect from "../../shared/CustomSelect"
import { useForm, useFormContext } from "react-hook-form"
import { DatePickerInput } from "../../shared/CustomInputDate"
import SearchableAsyncSelect from "../../shared/SearchableAsyncSelect"
import CreateCustomerModal from "./CreateCustomerModal"
import { handleGetAllCustomers } from "../../../services/customers"
import { useState } from "react"
import LocationMapModal from "./LocationMapModal"
import { MapPin } from "lucide-react"

export default function CreatePurchaseRequestForm() {
  const {register ,handleSubmit, control , setValue, watch, formState :{errors}} = useFormContext()
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  
  const delivery_address = watch("delivery_address");
  const delivery_lat = watch("delivery_lat");
  const delivery_lng = watch("delivery_lng");
  
  const pr_number = watch("pr_number");

  return (
    <Card className="px-5">
      <h2 className="text-secondary text-large font-bold">
        Request Reference {pr_number ? `#${pr_number}` : "#New"}
      </h2>

      <div className="flex flex-col gap-3 mt-4">
        <div className="grid grid-cols-2 gap-8">
          <SearchableAsyncSelect
            control={control}
            name="customer_id"
            label="Client"
            placeholder="Search e.g Forsa Company"
            isRequired={true}
            fetchFn={handleGetAllCustomers}
            queryKeyPrefix="customers"
            onCreateNew={(search) => {
              setNewCustomerName(search);
              setIsCustomerModalOpen(true);
            }}
            createLabel="Create New Client"
          />

          {/* <CustomInput
            register={register}
            name="requested_by"
            placeholder="e.g shahd"
            label="Requested by"
          /> */}

          <div className="flex flex-col gap-2">
             <label className="font-normal text-secondary text-lg">Project Location</label>
             <div 
               onClick={() => setIsMapModalOpen(true)}
               className="w-full flex items-center justify-between cursor-pointer rounded-lg bg-input-bg p-6 border border-transparent hover:border-primary/20 transition-all"
             >
                <div className="flex items-center gap-2 overflow-hidden">
                   <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                   <span className={delivery_address ? "text-slate-700 truncate" : "text-[#858B9E]"}>
                     {delivery_address || "Select location on map"}
                   </span>
                </div>
                {delivery_lat && (
                   <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0">
                     {Number(delivery_lat).toFixed(4)}, {Number(delivery_lng).toFixed(4)}
                   </span>
                )}
             </div>
          </div>

          {/* <DatePickerInput
            control={control}
            name="approval_date"
            placeholder="June 01, 2025"
            label="Approval Date"
            required
          /> */}

          <DatePickerInput
            control={control}
            name="request_date"
            placeholder="June 01, 2025"
            label="Request Date"
          />

          <div className="col-span-2">
            <label className="font-normal text-secondary text-lg mb-2 block">General Notes</label>
            <textarea
              {...register("notes")}
              className="w-full bg-input-bg rounded-lg p-4 min-h-[100px] border border-transparent focus:border-primary/20 outline-none transition-all"
              placeholder="Enter any additional information or requirements..."
            />
          </div>
        </div>
      </div>
      
      <CreateCustomerModal 
        open={isCustomerModalOpen} 
        onOpenChange={setIsCustomerModalOpen}
        initialName={newCustomerName}
        onCreated={(id) => {
           setValue("customer_id", id.toString());
        }}
      />

      <LocationMapModal 
        open={isMapModalOpen}
        onOpenChange={setIsMapModalOpen}
        initialLocation={{ address: delivery_address, lat: delivery_lat, lng: delivery_lng }}
        onLocationSelected={(loc) => {
            setValue("delivery_address", loc.address);
            setValue("delivery_lat", loc.lat);
            setValue("delivery_lng", loc.lng);
        }}
      />
    </Card>
  )
}
