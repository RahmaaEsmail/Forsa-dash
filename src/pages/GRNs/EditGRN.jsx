import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { useGRNDetails, useUpdateGRN } from '../../hooks/grns/useGRNs'
import GRNForm from '../../components/pages/GRNs/GRNForm'
import { format } from 'date-fns'
import Loading from '../../components/shared/Loading'

export default function EditGRN() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: grnResponse, isLoading } = useGRNDetails(id);
  const updateGRN = useUpdateGRN();

  const methods = useForm({
    defaultValues: {
      rfq_id: "",
      received_date: new Date(),
      supplier_reference: null,
      items: []
    }
  });

  useEffect(() => {
    if (grnResponse?.data) {
      const data = grnResponse.data;
      methods.reset({
        rfq_id: data.rfq?.id?.toString(),
        received_date: data.received_date ? new Date(data.received_date) : new Date(),
        items: data.items?.map(item => ({
          id: item.id,
          rfq_item_id: item.rfq_item_id,
          item_name: item.item?.name || item.item_name || 'Item',
          quantity_ordered: item.quantity_expected,
          quantity_received: item.quantity_received,
          unit_name: item.unit?.name
        })) || []
      });
    }
  }, [grnResponse, methods]);

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("received_date", format(values.received_date, "yyyy-MM-dd"));
    if (values.supplier_reference instanceof File) {
      formData.append("supplier_reference", values.supplier_reference);
    }
    
    values.items.forEach((item, index) => {
      formData.append(`items[${index}][rfq_item_id]`, item.rfq_item_id);
      formData.append(`items[${index}][quantity_received]`, item.quantity_received);
    });

    updateGRN.mutate({ id, body: formData }, {
      onSuccess: () => {
        navigate('/grns');
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
        <PageHeader title="Edit GRN" subTitle={`Editing GRN #${grnResponse?.data?.grn_number || id}`}>
          <div className='flex gap-3 items-center'>
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button 
              onClick={methods.handleSubmit(onSubmit)}
              disabled={updateGRN.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              {updateGRN.isPending ? "Updating..." : "Update GRN"}
            </Button>
          </div>
        </PageHeader>

        <GRNForm isEdit={true} />
      </div>
    </FormProvider>
  )
}
