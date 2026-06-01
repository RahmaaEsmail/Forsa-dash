import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import CustomInput from '../../shared/CustomInput'
import { DatePickerInput } from '../../shared/CustomInputDate'
import SearchableAsyncSelect from '../../shared/SearchableAsyncSelect'
import { handleGetRFQs, handleGetRFQDetails } from '../../../services/rfqs'
import GRNItemsTable from './GRNItemsTable'
import { Card, CardContent } from '../../ui/card'

export default function GRNForm({ isEdit = false }) {
  const { control, setValue, watch } = useFormContext();
  const [rfqDetails, setRfqDetails] = React.useState(null);
  const rfq_id = watch("rfq_id");

  useEffect(() => {
    if (rfq_id && !isEdit) {
      handleGetRFQDetails({ id: rfq_id }).then(res => {
        if (res?.data) {
          setRfqDetails(res.data);
          if (res.data.items) {
            setValue("items", res.data.items.map(item => ({
              rfq_item_id: item.id,
              item_name: item.item_name,
              quantity_ordered: item.quantity,
              quantity_received: item.quantity, // Default to full quantity
              unit_name: item.unit?.name
            })));
          }
        }
      });
    }
  }, [rfq_id, isEdit, setValue]);

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchase Order / RFQ Reference</label>
            <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold">
              {rfqDetails?.rfq_number ? `#${rfqDetails.rfq_number}` : `ID: ${rfq_id}`}
            </div>
          </div>
          <DatePickerInput 
            control={control}
            name="received_date"
            label="Received Date"
            required
          />
          {/* Using a standard file input for supplier reference if needed, 
              but CustomInput might work if type="file" is passed */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supplier Reference (File)</label>
            <input 
              type="file"
              onChange={(e) => setValue("supplier_reference", e.target.files[0])}
              className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Received Items</h3>
         <GRNItemsTable />
      </div>
    </div>
  )
}
