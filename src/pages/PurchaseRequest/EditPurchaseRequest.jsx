import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/PurchaseRequests/CreatePurchaseRequestForm'
import { FormProvider, useForm } from 'react-hook-form'
import PurchaseRequestsTabs from '../../components/pages/PurchaseRequests/PurchaseRequestsTabs'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import usePurchaseDetails from '../../hooks/purchaseRequest/usePurchaseDetails'
import useUpdatePurchaseRequest from '../../hooks/purchaseRequest/useUpdatePurchaseRequest'
import useChangePurchaseStatus from '../../hooks/purchaseRequest/useChangePurchaseStatus'
import Loading from '../../components/shared/Loading'
import ChangePurchaseStatusModal from '../../components/pages/PurchaseRequests/ChangePurchaseStatusModal'
import { useState } from 'react'
import { FilePlus } from 'lucide-react'

export default function EditPurchaseRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { mutate: fetchDetails, data: prData, isPending: isLoadingDetails } = usePurchaseDetails();
  const { mutate: updatePR, isPending: isUpdating } = useUpdatePurchaseRequest();
  
  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const method = useForm({
    defaultValues: {
      customer_id: "",
      requested_by: "",
      delivery_address: "",
      delivery_lat: "",
      delivery_lng: "",
      approval_date: new Date(),
      request_date: new Date(),
      notes: "",
      pr_number: "",
      items: []
    },
  })

  useEffect(() => {
    if (id) {
      fetchDetails({ id });
    }
  }, [id, fetchDetails]);

  useEffect(() => {
    if (prData?.data) {
      const pr = prData.data;
      method.reset({
        customer_id: pr.customer?.id?.toString() || "",
        requested_by: pr.requested_by || "",
        delivery_address: pr.delivery_address || "",
        delivery_lat: pr.delivery_lat || "",
        delivery_lng: pr.delivery_lng || "",
        approval_date: pr.approval_date ? new Date(pr.approval_date) : new Date(),
        request_date: pr.required_date ? new Date(pr.required_date) : new Date(),
        notes: pr.notes || "",
        pr_number: pr.pr_number || "",
        items: pr.items?.map(item => ({
          item_id: item.item?.id?.toString() || "",
          quantity: item.quantity || 0,
          unit_id: item.unit?.id?.toString() || "",
          target_price: item.target_price || 0,
          specifications: item.specifications || "",
          notes: item.notes || ""
        })) || []
      });
    }
  }, [prData, method]);

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
        required_date: values.request_date ? format(new Date(values.request_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        notes: values.notes || "", 
        items: values.items.map(item => ({
            item_id: Number(item.item_id),
            quantity: Number(item.quantity) || 0,
            unit_id: Number(item.unit_id),
            target_price: Number(item.target_price) || 0,
            specifications: item.specifications || null,
            notes: item.notes || null
        })).filter(item => item.item_id && item.quantity > 0)
    };
    
    if (payload.items.length === 0) {
        toast.error("Please add at least one product line.");
        return;
    }

    updatePR({ id, body: payload }, {
      onSuccess: (res) => {
        if(res?.success) {
          toast.success(res?.meta?.message ||"Purchase Request updated successfully!");
          navigate(`/purchase_request_details/${id}`);
        }
      },
      onError: (err) => {
        console.log("error",err);
        toast.error(err.response?.data?.error?.message || err.message || "Failed to update PR.");
      }
    });
  }

  if (isLoadingDetails) return <Loading />;

  return (
    <FormProvider {...method}>
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Edit Purchase Request"} subTitle={`Updating PR #${prData?.data?.pr_number || id}`}>
        <div className='flex gap-2 items-center'>
          {prData?.data?.status && prData?.data?.status?.toLowerCase() !== 'cancelled' && prData?.data?.status?.toLowerCase() !== 'rejected' && (
            <Button 
              type="button" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 font-bold" 
              onClick={() => setOpenChangeStatus(true)}
            >
              Change Status
            </Button>
          )}

          {['approved', 'completed'].includes(prData?.data?.status?.toLowerCase()) && (
            <Button
              type="button"
              onClick={() => navigate(`/purchase-requests/${id}/rfqs`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              RFQs & Quotations
            </Button>
          )}

          <Button 
            type="button"
            onClick={() => navigate("/purchaseRequest")}
            className={"bg-white hover:bg-primary hover:text-white border border-primary text-primary font-bold"}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="pr-form"
            disabled={isUpdating}
            className={"font-bold"}>
            {isUpdating ? "Updating..." : "Update Request"}
          </Button>
        </div>
      </PageHeader>
      <form id="pr-form" onSubmit={method.handleSubmit(onSubmit)}>
        <CreateQuotationForm/>
      </form>  

      <PurchaseRequestsTabs />
      
      <ChangePurchaseStatusModal 
        open={openChangeStatus}
        setOpen={setOpenChangeStatus} 
        currentStatus={prData?.data?.status}
        id={id}
        onSuccess={() => fetchDetails({ id })}
      /> 
    </div>
    </FormProvider>
  )
}
