import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import DeliveryNoteForm from '../../components/pages/DeliveryNotes/DeliveryNoteForm'
import { FormProvider, useForm } from 'react-hook-form'
import useEditDeliveryNote from '../../hooks/delivery-notes/useEditDeliveryNote'
import useDeliveryNoteDetails from '../../hooks/delivery-notes/useDeliveryNoteDetails'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, ArrowLeft } from 'lucide-react'
import Loading from '../../components/shared/Loading'

export default function EditDeliveryNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editDeliveryNote = useEditDeliveryNote();
  
  const { data: deliveryNoteResponse, isLoading } = useDeliveryNoteDetails(id);

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

  const deliveryNote = deliveryNoteResponse?.data;

  useEffect(() => {
    if (deliveryNote) {
      methods.reset({
        quotation_id: deliveryNote.quotation?.id?.toString() || deliveryNote.quotation_id?.toString(),
        customer_id: deliveryNote.customer_id?.toString(),
        delivery_date: deliveryNote.delivery_date ? new Date(deliveryNote.delivery_date) : new Date(),
        delivery_address: deliveryNote.delivery_address || "",
        location_link: deliveryNote.location_link || "",
        contact_info: deliveryNote.contact_info || "",
        notes: deliveryNote.notes || "",
        delivery_type_id: deliveryNote.delivery_type_id?.toString() || "",
        items: deliveryNote.items?.map(item => ({
          quotation_item_id: item.quotation_item_id,
          item_name: item.item?.name || item.item_name,
          unit_name: item.unit?.name,
          quantity: item.quantity,
          quantity_delivered: item.quantity_delivered
        })) || []
      });
    }
  }, [deliveryNote, methods]);

  function onSubmit(values) {
    const payload = {
      delivery_date: format(values.delivery_date, "yyyy-MM-dd"),
      notes: values.notes,
    };

    editDeliveryNote.mutate({ id, body: payload }, {
      onSuccess: () => {
        navigate('/delivery-notes');
      }
    });
  }

  const isReadOnly = location.pathname.includes('details');

  if (isLoading) return <Loading />;

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        <PageHeader 
            title={isReadOnly ? `Delivery Note #${deliveryNote?.do_number || id}` : `Edit Delivery Note #${deliveryNote?.do_number || id}`} 
            subTitle={isReadOnly ? "View delivery record details" : "Update delivery information"}
        >
          <div className='flex gap-3 items-center'>
            <Button 
                type="button"
                variant="outline" 
                onClick={() => navigate('/delivery-notes')}
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {isReadOnly ? "Back to List" : "Back"}
            </Button>

            {!isReadOnly && (
              <Button 
                  onClick={methods.handleSubmit(onSubmit)}
                  disabled={editDeliveryNote.isPending}
                  className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" />
                {editDeliveryNote.isPending ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </PageHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
            <DeliveryNoteForm isEdit={!isReadOnly} isReadOnly={isReadOnly} />
        </form>
      </div>
    </FormProvider>
  )
}
