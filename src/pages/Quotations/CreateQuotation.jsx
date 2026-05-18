import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'
import { FormProvider, useForm } from 'react-hook-form'
import { useCreateQuotation } from '../../hooks/quotations/useCreateQuotation'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, XCircle, ArrowLeft } from 'lucide-react'

export default function CreateQuotation() {
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();
  
  const methods = useForm({
    defaultValues: {
      rfq_id: "",
      supplier_id: "",
      currency_code: "SAR",
      quotation_date: new Date(),
      valid_until: new Date(new Date().setDate(new Date().getDate() + 30)),
      payment_days: 30,
      delivery_days: 7,
      notes: "",
      items: []
    },
  })

  function onSubmit(values) {
    const payload = {
      rfq_id: Number(values.rfq_id),
      supplier_id: Number(values.supplier_id),
      currency_id: 1,
      // currency_id: values.currency_code,
      quotation_date: format(values.quotation_date, "yyyy-MM-dd"),
      valid_until: format(values.valid_until, "yyyy-MM-dd"),
      payment_days: Number(values.payment_days),
      delivery_days: Number(values.delivery_days),
      notes: values.notes,
      items: values.items.map(item => ({
        rfq_item_id: Number(item.rfq_item_id),
        quantity: Number(item.quantity),
        selling_price: Number(item.selling_price),
        cost_price: Number(item.cost_price),
        tax_rate: Number(item.tax_rate),
        available: !!item.available
      }))
    };

    createQuotation.mutate(payload, {
      onSuccess: () => {
        navigate('/quotations');
      }
    });
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        <PageHeader 
            title="Create New Quotation" 
            subTitle="Submit a new quotation based on an existing RFQ"
        >
          <div className='flex gap-3 items-center'>
            <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/quotations')}
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>

            <Button 
                onClick={methods.handleSubmit(onSubmit)}
                disabled={createQuotation.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              {createQuotation.isPending ? "Creating..." : "Create Quotation"}
            </Button>
          </div>
        </PageHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
            <CreateQuotationForm />
        </form>
      </div>
    </FormProvider>
  )
}
