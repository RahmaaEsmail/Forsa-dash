import React, { useEffect, useMemo, useState } from "react"
import { Card } from "../../ui/card"
import CustomInput from "../../shared/CustomInput"
import { useFormContext, useFieldArray } from "react-hook-form"
import { DatePickerInput } from "../../shared/CustomInputDate"
import SearchableAsyncSelect from "../../shared/SearchableAsyncSelect"
import { handleGetRFQs, handleGetRFQDetails } from "../../../services/rfqs"
import { useCurrencyFlags } from "../../../hooks/useCurrencyFlags"
import QuotationItemsTable from "./QuotationItemsTable"
import { Separator } from "../../ui/separator"
import { FileText, Calendar, Wallet, Truck, Clock } from 'lucide-react'
import { handleGetAllSupplier } from "../../../services/suppliers"
import CustomSelect from "../../shared/CustomSelect"

const getFirstCurrency = (currenciesObj) => {
  if (!currenciesObj) return null;
  const codes = Object.keys(currenciesObj);
  if (!codes.length) return null;
  const code = codes[0];
  return { code, ...currenciesObj[code] };
};

export default function CreateQuotationForm({ 
  isReadOnly = false, 
  isEdit = false,
  onUpdatePrices,
  isUpdatingPrices
}) {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext()
  const { replace } = useFieldArray({
    control,
    name: "items"
  });
  const { data: flagData } = useCurrencyFlags();
  
  const selectedRfqId = watch("rfq_id");
  const [items , setItems] = useState([]);

  useEffect(() => {
    if(selectedRfqId) {
      console.log("selected rfq id",selectedRfqId)
       handleGetRFQDetails({ id: selectedRfqId }).then(res => {
       console.log("res",res);
        if (res?.data) {
          const rfq = res.data;
          setItems(rfq?.items);
        }
      });
    }
  } ,[selectedRfqId])

  const uniqueCurrencyOptions = useMemo(() => {
    const currencyData = flagData?.data || [];
    const map = new Map();
    for (const item of currencyData) {
      const cur = getFirstCurrency(item?.currencies);
      if (!cur) continue;
      if (!map.has(cur.code)) {
        map.set(cur.code, {
          value: cur.code,
          textValue: `${cur.code} - ${cur.name}`,
          label: (
            <div className="flex items-center gap-2">
              <img src={item?.flags?.png} alt={item?.flags?.alt} className='w-5 h-4 rounded-sm' />
              <span className="text-slate-700 font-medium">{cur.code}</span>
            </div>
          ),
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.value.localeCompare(b.value));
  }, [flagData]);

  // Fetch RFQ details when RFQ is selected to populate items
  useEffect(() => {
    if (selectedRfqId && !isReadOnly && !isEdit) {
      handleGetRFQDetails({ id: selectedRfqId }).then(res => {
        if (res?.data) {
          const rfq = res.data;
          // Set initial items from RFQ
          const formattedItems = rfq.items?.map(item => ({
            rfq_item_id: item.id,
            item_name: item.item_name,
            unit_name: item.unit?.name || "",
            quantity: Number(item.quantity) || 0,
            cost_price: Number(item.unit_price) || Number(item.target_price) || 0,
            selling_price: (Number(item.unit_price) || Number(item.target_price) || 0) * 1.2, // Default 20% margin
            tax_rate: Number(item.vat_rate) || 15,
            available: true
          })) || [];
          
          replace(formattedItems);
          setValue("supplier_id", rfq.supplier?.id?.toString());
          setValue("currency_code", rfq.currency?.code);
        }
      });
    }
  }, [selectedRfqId, setValue, replace, isReadOnly, isEdit]);

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-0 border-none shadow-sm overflow-hidden bg-white rounded-2xl">
        <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h2 className="text-slate-900 font-bold text-lg">Quotation Information</h2>
                <p className="text-slate-500 text-xs mt-0.5">Fill in the basic details for the new quotation</p>
            </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* <SearchableAsyncSelect
              control={control}
              name="rfq_id"
              label="Select RFQ"
              placeholder="Search by RFQ number..."
              isRequired={true}
              disabled={isReadOnly}
              fetchFn={(params) => handleGetRFQs({ params: { ...params, status: 'rfq_sent' } })}
              queryKeyPrefix="rfqs"
              getOptionLabel={(option) => `#${option.rfq_number} - ${option.supplier?.company_name || 'No Supplier'}`}
              getOptionValue={(option) => option?.id?.toString()}
            /> */}

            {/* <SearchableAsyncSelect
              control={control}
              name="supplier_id"
              label="Supplier"
              placeholder="Select supplier..."
              isRequired={true}
              disabled={isReadOnly}
              fetchFn={handleGetAllSupplier}
              queryKeyPrefix="suppliers"
            /> */}

            {/* <CustomSelect 
                control={control} 
                name="currency_code" 
                label="Currency" 
                placeholder="Select Currency" 
                isRequired={true} 
                disabled={isReadOnly}
                options={uniqueCurrencyOptions} 
                errors={errors?.currency_code} 
            /> */}

            {/* <Separator className="col-span-full my-2 bg-slate-100" /> */}

            <DatePickerInput
              control={control}
              name="quotation_date"
              label="Quotation Date"
              placeholder="Select date"
              disabled={isReadOnly}
              icon={<Calendar className="w-4 h-4 text-slate-400" />}
            />

            <DatePickerInput
              control={control}
              name="valid_until"
              label="Valid Until"
              placeholder="Select date"
              disabled={isReadOnly}
              icon={<Clock className="w-4 h-4 text-slate-400" />}
            />

            <CustomInput
              register={register}
              name="payment_days"
              type="number"
              label="Payment Days"
              placeholder="e.g. 30"
              disabled={isReadOnly}
              icon={<Wallet className="w-4 h-4 text-slate-400" />}
            />

            <CustomInput
              register={register}
              name="delivery_days"
              type="number"
              label="Delivery Days"
              placeholder="e.g. 7"
              disabled={isReadOnly}
              icon={<Truck className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>
      </Card>

      <QuotationItemsTable 
        items={items} 
        isReadOnly={isReadOnly} 
        onUpdatePrices={onUpdatePrices}
        isUpdatingPrices={isUpdatingPrices}
      />
    </div>
  )
}
