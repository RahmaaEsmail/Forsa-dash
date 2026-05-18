import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'
import { FormProvider, useForm } from 'react-hook-form'
import { useUpdateQuotation } from '../../hooks/quotations/useUpdateQuotation'
import { useQuotationDetails } from '../../hooks/quotations/useQuotationDetails'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, ArrowLeft, CheckCircle, Send, FileCheck, CreditCard } from 'lucide-react'
import Loading from '../../components/shared/Loading'
import { useUpdateQuotationStatus } from '../../hooks/quotations/useUpdateQuotationStatus'
import { useUpdateQuotationPrices } from '../../hooks/quotations/useUpdateQuotationPrices'

export default function EditQuotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateQuotation = useUpdateQuotation();
  const updatePrices = useUpdateQuotationPrices();
  const updateStatus = useUpdateQuotationStatus();
  const { data: quotationResponse, isLoading } = useQuotationDetails(id);
   
  const methods = useForm({
    defaultValues: {
      rfq_id: "",
      supplier_id: "",
      currency_code: "SAR",
      quotation_date: new Date(),
      valid_until: new Date(),
      payment_days: 30,
      delivery_days: 7,
      notes: "",
      items: []
    },
  })

  const quotation = quotationResponse?.data;
  
  console.log("quotation",quotation);
  useEffect(() => {
    if (quotation) {
      methods.reset({
        rfq_id: quotation.purchase_request?.id?.toString(),
        supplier_id: quotation.supplier?.id?.toString(),
        currency_code: quotation.currency?.code,
        quotation_date: quotation.quotation_date ? new Date(quotation.quotation_date) : new Date(),
        valid_until: quotation.valid_until ? new Date(quotation.valid_until) : new Date(),
        payment_days: quotation.payment_days || 0,
        delivery_days: quotation.delivery_days || 0,
        notes: quotation.notes || "",
        items: quotation.items?.map(item => ({
          id: item.id,
          rfq_item_id: item.rfq_item_id,
          item_name: item.item_name || item.item?.name,
          quantity: item.quantity,
          cost_price: item.cost_price,
          selling_price: item.selling_price,
          tax_rate: item.tax_rate,
          available: item.available,
          unit_name: item.unit?.name
        })) || []
      });
    }
  }, [quotation, methods]);

  function onSubmit(values) {
    const payload = {
      valid_until: values.valid_until ? format(values.valid_until, "yyyy-MM-dd") : null,
      payment_days: Number(values.payment_days) || 0,
      delivery_days: Number(values.delivery_days) || 0,
      notes: values.notes || "",
    };

    updateQuotation.mutate({ id, body: payload }, {
      onSuccess: () => {
        navigate('/quotations');
      }
    });
  }

  function handleUpdatePrices() {
    const values = methods.getValues();
    const payload = {
      items: (values.items || []).map(item => ({
        id: item.id,
        selling_price: Number(item.selling_price) || 0,
        tax_rate: Number(item.tax_rate) || 0
      }))
    };

    updatePrices.mutate({ id, body: payload });
  }

  if (isLoading) {
    return <Loading />
  };

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        <PageHeader 
            title={`Edit Quotation #${quotation?.quotation_number}`} 
            subTitle="Modify quotation details"
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

            {/* {quotation?.status === 'draft' && (
              <Button 
                variant="outline"
                onClick={() => updateStatus.mutate({ id, status: 'client-approve' })}
                disabled={updateStatus.isPending}
                className="h-11 px-6 rounded-xl border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50 gap-2"
              >
                <FileCheck className="w-4 h-4" />
                Client Approve
              </Button>
            )} */}

            <Button 
                onClick={methods.handleSubmit(onSubmit)}
                disabled={updateQuotation.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              {updateQuotation.isPending ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </PageHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
            <CreateQuotationForm 
              isEdit={true} 
              onUpdatePrices={handleUpdatePrices}
              isUpdatingPrices={updatePrices.isPending}
            />
        </form>
      </div>
    </FormProvider>
  )
}

