import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { useCreateGRN } from '../../hooks/grns/useGRNs'
import GRNForm from '../../components/pages/GRNs/GRNForm'
import { format } from 'date-fns'

export default function CreateGRN() {
  const navigate = useNavigate();
  const createGRN = useCreateGRN();

  const methods = useForm({
    defaultValues: {
      rfq_id: "",
      received_date: new Date(),
      supplier_reference: null,
      items: []
    }
  });

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("rfq_id", values.rfq_id);
    formData.append("received_date", format(values.received_date, "yyyy-MM-dd"));
    if (values.supplier_reference) {
      formData.append("supplier_reference", values.supplier_reference);
    }
    
    values.items.forEach((item, index) => {
      formData.append(`items[${index}][rfq_item_id]`, item.rfq_item_id);
      formData.append(`items[${index}][quantity_received]`, item.quantity_received);
    });

    createGRN.mutate({ body: formData }, {
      onSuccess: () => {
        navigate('/grns');
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
        <PageHeader title="Create GRN" subTitle="Register new goods received from a supplier.">
          <div className='flex gap-3 items-center'>
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button 
              onClick={methods.handleSubmit(onSubmit)}
              disabled={createGRN.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              {createGRN.isPending ? "Creating..." : "Save GRN"}
            </Button>
          </div>
        </PageHeader>

        <GRNForm />
      </div>
    </FormProvider>
  )
}
