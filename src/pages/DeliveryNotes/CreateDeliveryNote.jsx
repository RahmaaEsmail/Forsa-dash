import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import DeliveryNoteForm from '../../components/pages/DeliveryNotes/DeliveryNoteForm'
import { FormProvider, useForm } from 'react-hook-form'
import useCreateDeliveryNote from '../../hooks/delivery-notes/useCreateDeliveryNote'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, ArrowLeft } from 'lucide-react'

export default function CreateDeliveryNote() {
  const navigate = useNavigate();
  const createDeliveryNote = useCreateDeliveryNote();
  
  const methods = useForm({
    defaultValues: {
      quotation_id: "",
      customer_id: "",
      delivery_date: new Date(),
      delivery_address: "",
      location_link: "",
      contact_info: "",
      notes: "",
      delivery_type_id: "",
      items: []
    },
  })

  function onSubmit(values) {
    const payload = {
      quotation_id: Number(values.quotation_id),
      delivery_date: format(values.delivery_date, "yyyy-MM-dd"),
      notes: values.notes,
      items: values.items.map(item => ({
        quotation_item_id: Number(item.quotation_item_id),
        quantity: Number(item.quantity)
      }))
    };

    createDeliveryNote.mutate({ body: payload }, {
      onSuccess: () => {
        navigate('/delivery-notes');
      }
    });
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        <PageHeader 
            title="Create Delivery Note" 
            subTitle="Prepare a new delivery note for shipment"
        >
          <div className='flex gap-3 items-center'>
            <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/delivery-notes')}
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button 
                onClick={methods.handleSubmit(onSubmit)}
                disabled={createDeliveryNote.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              {createDeliveryNote.isPending ? "Creating..." : "Save Delivery Note"}
            </Button>
          </div>
        </PageHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
            <DeliveryNoteForm />
        </form>
      </div>
    </FormProvider>
  )
}
