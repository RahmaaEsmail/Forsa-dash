import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/PurchaseRequests/CreatePurchaseRequestForm'
import { FormProvider, useForm } from 'react-hook-form'
import PurchaseRequestsTabs from '../../components/pages/PurchaseRequests/PurchaseRequestsTabs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleAddPurchaseRequest } from '../../services/purchase-request'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function CreatePurchaseRequest() {
  const queryClient = useQueryClient();
  const method = useForm({
    defaultValues: {
      customer_id: "",
      requested_by: "",
      delivery_address: "Riyadh Industrial Area, Saudi Arabia",
      delivery_lat: 24.7136,
      delivery_lng: 46.6753,
      approval_date: new Date(),
      request_date: new Date(),
      items: [
        {
          item_id: "",
          quantity: 1,
          unit_id: "",
          target_price: "",
          specifications: "",
          notes: ""
        }
      ]
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddPurchaseRequest,
    onSuccess: () => {
      toast.success("Purchase Request created successfully!");
      queryClient.invalidateQueries(["purchase-requests"]);
      method.reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to create PR.");
    }
  });


  function onSubmit(values) {
    if (!values.customer_id) {
        toast.error("Please select a client.");
        return;
    }

    const payload = {
        customer_id: Number(values.customer_id),
        delivery_lat: Number(values.delivery_lat) || 24.7136,
        delivery_lng: Number(values.delivery_lng) || 46.6753,
        delivery_address: values.delivery_address || "",
        required_date: values.request_date ? format(values.request_date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        notes: "Customer needs materials", 
        items: values.items.map(item => ({
            item_id: Number(item.item_id),
            quantity: Number(item.quantity) || 0,
            unit_id: Number(item.unit_id),
            target_price: Number(item.target_price) || 0,
            specifications: item.specifications || null,
            notes: item.notes || null
        })).filter(item => item.item_id && item.quantity > 0)
    };
    
    // Check if at least one product is added
    if (payload.items.length === 0) {
        toast.error("Please add at least one product line.");
        return;
    }

    mutate({ body: payload });
  }

  return (
    <FormProvider {...method}>
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Purchase Request"} subTitle={"Create and manage PR forms"}>
        <div className='flex gap-2 items-center'>
          <Button className={"bg-white hover:bg-primary hover:text-white border border-primary text-primary font-bold"}>
            Discard
          </Button>

          <Button
            type="submit"
            form="pr-form"
            disabled={isPending}
            className={"font-bold"}>
            {isPending ? "Saving..." : "Save Request"}
          </Button>
        </div>
      </PageHeader>
      <form id="pr-form" onSubmit={method.handleSubmit(onSubmit)}>
      <CreateQuotationForm/>
      </form>  

      <PurchaseRequestsTabs />
    </div>
    </FormProvider>
  )
}
