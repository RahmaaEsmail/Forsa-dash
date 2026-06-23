import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { DatePickerInput } from '../../../shared/CustomInputDate'
import SearchableAsyncSelect from '../../../shared/SearchableAsyncSelect'
import { handleGetAllSupplier, handleGetSupplierDetails } from '../../../../services/suppliers'
import { handleGetAllPaymentTerms } from '../../../../services/purchase-request'
import { useCurrencyFlags } from '../../../../hooks/useCurrencyFlags'
import { handleGetAllCustomers } from '../../../../services/customers'
import CustomSelect from '../../../shared/CustomSelect'
import CustomInput from '../../../shared/CustomInput'
import { Card, CardContent } from '../../../ui/card'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Star } from 'lucide-react'
import useListSettings from '../../../../hooks/Settings/useListSettings'
import useListPaymentTerms from '../../../../hooks/paymentTerms/useListPaymentTerms'

const getFirstCurrency = (currenciesObj) => {
  if (!currenciesObj) return null;
  const codes = Object.keys(currenciesObj);
  if (!codes.length) return null;
  const code = codes[0];
  return { code, ...currenciesObj[code] };
};

export default function RFQGeneralInfo({ prData , isEdit}) {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const { data: flagData } = useCurrencyFlags();
  const { data: settingsData } = useListSettings();
  const {data : payment_terms} = useListPaymentTerms();
  
  const paymentTermsOptions = payment_terms?.data?.map(item => ({label : `${item?.name?.en}-${item?.name?.ar}` , value : item?.id}))
  
  const supplierId = useWatch({ control, name: "supplier_id" });
  const rfqNumber = watch("rfq_number") || "New";

  // Pre-fill from PR data if provided
  React.useEffect(() => {
    if (prData?.data) {
      const pr = prData.data;
      if (pr.delivery_address) setValue("project_location", pr.delivery_address);
      if (pr.customer?.id) setValue("customer_id", pr.customer.id.toString());
      if (pr.pr_number) setValue("purchase_request", pr.pr_number);
    }
  }, [prData, setValue]);

  // Pre-fill VAT from settings
  React.useEffect(() => {
    if (settingsData?.data) {
      // Find VAT in settings. Assuming it's named 'vat' or similar
      const vatSetting = settingsData.data.find(s => s.key === 'vat' || s.key === 'vat_rate');
      if (vatSetting) {
        setValue("vat_value", vatSetting.value);
      }
    }
  }, [settingsData, setValue]);

  // Fetch Supplier Details
  const { data: supplierDetails } = useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => handleGetSupplierDetails({ id: supplierId }),
    enabled: !!supplierId
  });

  // Automatically set Supplier VAT if available
  React.useEffect(() => {
    if (supplierDetails?.data?.vat_number) {
      setValue("vat_no", supplierDetails.data.vat_number);
    }
  }, [supplierDetails, setValue]);

  // Build address options from the selected supplier's registered addresses
  const deliveryAddressOptions = useMemo(() => {
    const addrs = supplierDetails?.data?.addresses || [];
    return addrs.map(a => {
      const parts = [a.address_line_1, a.address_line_2, a.city, a.state, a.country].filter(Boolean);
      return {
        label: `${a.label || a.type || 'Address'} — ${parts.join(', ')}`,
        value: parts.join(', ')
      };
    });
  }, [supplierDetails]);

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



  return (
    <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
          <h2 className="text-secondary text-xl font-bold">
            Request for Quotation #{rfqNumber}
          </h2>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 border-primary text-primary hover:bg-primary/5 flex gap-2 items-center font-bold">
            <Mail className="w-4 h-4" />
            Send by E-mail
          </Button>
          <Button variant="outline" size="sm" className="h-9 px-4 border-primary text-primary hover:bg-primary/5 flex gap-2 items-center font-bold">
            <Printer className="w-4 h-4" />
            Print RFQ
          </Button>
        </div> */}
      </div>

      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-12">
          {!isEdit ? (
            <SearchableAsyncSelect
              control={control}
              name="supplier_id"
              label="Vendor"
              placeholder="Enter vendor name"
              isRequired={true}
              fetchFn={handleGetAllSupplier}
              queryKeyPrefix="suppliers"
            />
          ) : (
            <CustomInput
              register={register}
              name="supplier_name"
              label="Vendor"
              placeholder="—"
              disabled
            />
          )}

          {/* <CustomSelect 
            control={control} 
            name="currency_code" 
            label="Currency" 
            placeholder="SAR" 
            isRequired={true} 
            options={uniqueCurrencyOptions} 
            errors={errors?.currency_code} 
          /> */}

          {/* <CustomInput 
            register={register} 
            name="vat_no" 
            label="Vat NO." 
            placeholder="Enter vat registration number" 
          /> */}

          {/* <CustomInput 
            register={register} 
            name="purchase_request" 
            label="Purchase request" 
            placeholder="PR-1046"
            disabled 
          /> */}

          {/* <CustomInput 
            register={register} 
            name="project_location" 
            label="Project location" 
            placeholder="Choose the project location" 
          /> */}
{/* 
          <CustomSelect
            control={control}
            name="payment_request_id"
            label="Payment request"
            placeholder="Choose the payment request"
            options={[]}
          /> */}

          {!isEdit ? (
            paymentTermsOptions ? (
              <CustomSelect
                control={control}
                name="payment_term_id"
                label="Payment terms"
                placeholder="Choose the payment terms"
                isRequired={true}
                options={paymentTermsOptions}
              />
            ) : (
              <SearchableAsyncSelect
                control={control}
                name="payment_term_id"
                label="Payment terms"
                placeholder="Choose the payment terms"
                isRequired={true}
                fetchFn={handleGetAllPaymentTerms}
                queryKeyPrefix="payment-terms"
              />
            )
          ) : (
            <CustomInput
              register={register}
              name="payment_terms_text"
              label="Payment terms"
              placeholder="—"
              disabled
            />
          )}

          {/* <CustomSelect
            control={control}
            name="order_category_id"
            label="Order category"
            placeholder="Choose the category"
            options={[]}
          /> */}

          {/* <CustomInput 
            register={register} 
            name="vat_value" 
            label="Vat" 
            placeholder="Enter the vat value" 
            disabled
          /> */}

          {/* <SearchableAsyncSelect
            control={control}
            name="customer_id"
            label="Client"
            placeholder="Enter client name"
            fetchFn={handleGetAllCustomers}
            queryKeyPrefix="customers"
          /> */}

          {/* <DatePickerInput
            control={control}
            name="creation_date"
            label="Creation Date"
            placeholder="22/12/2025"
          /> */}

          {/* <DatePickerInput
            control={control}
            name="approval_date"
            label="Approval Date"
            placeholder="24/12/2025"
          /> */}

          <DatePickerInput
            control={control}
            name={isEdit ? "due_date" : "receipt_date"}
            label={isEdit ? "Due Date" : "Receipt Date"}
            placeholder="24/12/2025"
          />

          {/* Delivery / Warehouse Address — populated from supplier's registered addresses */}
          {deliveryAddressOptions.length > 0 ? (
            <CustomSelect
              control={control}
              name="delivery_address"
              label="Delivery / Warehouse Address"
              placeholder="Select receiving address..."
              options={deliveryAddressOptions}
            />
          ) : (
            <CustomInput
              register={register}
              name="delivery_address"
              label="Delivery / Warehouse Address"
              placeholder="Enter delivery address"
              icon={<MapPin className="w-4 h-4 text-slate-400" />}
            />
          )}
        </div>


      </CardContent>
    </Card>
  )
}

