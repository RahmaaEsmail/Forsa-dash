import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { FormProvider, useForm } from 'react-hook-form'
import RFQGeneralInfo from '../../components/pages/RFQs/RFQForm/RFQGeneralInfo'
import RFQItemsTable from '../../components/pages/RFQs/RFQForm/RFQItemsTable'
import RFQStatusTabs from '../../components/pages/RFQs/RFQStatusTabs'
import { handleGetRFQDetails, handleCreateRFQ, handleUpdateRFQ, handleChangeRFQStatus } from '../../services/rfqs'
import usePurchaseDetails from '../../hooks/purchaseRequest/usePurchaseDetails'
import Loading from '../../components/shared/Loading'
import { toast } from 'sonner'
import { format } from 'date-fns'
// import ActivityChatLog from '../../components/pages/PurchaseRequests/ActivityChatLog'
import CancelRFQModal from '../../components/pages/RFQs/CancelRFQModal'

export default function CreateRFQ() {
  const { prId, rfqId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!rfqId;
  
  const { mutate: fetchPR, data: prData, isPending: isPRLoading } = usePurchaseDetails();
  const [isLoadingRFQ, setIsLoadingRFQ] = useState(isEdit);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [rfqStatus, setRfqStatus] = useState("draft");
  const [rfqDetailsPrId, setRfqDetailsPrId] = useState(null);

  const methods = useForm({
    defaultValues: {
      supplier_id: "",
      currency_code: "SAR",
      payment_term_id: "",
      receipt_date: new Date(),
      creation_date: new Date(),
      approval_date: new Date(),
      due_date: new Date(),
      notes: "",
      items: []
    }
  });

  const items = methods.watch("items") || [];
  const hasPrices = items.some(item => Number(item.unit_price) > 0);

  useEffect(() => {
    if (prId) fetchPR({ id: prId });
  }, [prId, fetchPR]);

  const loadRFQDetails = useCallback(() => {
    if (!rfqId) return;
    setIsLoadingRFQ(true);
    handleGetRFQDetails({ id: rfqId })
      .then(res => {
        if (res?.data) {
          const data = res.data;
          console.log("editing data", data);
          setRfqStatus(data.status || "draft");
          if (data.purchase_request_id || data.purchase_request?.id) {
            setRfqDetailsPrId(data.purchase_request_id || data.purchase_request?.id);
          }
          methods.reset({
            supplier_id: data.supplier?.id?.toString(),
            currency_code: data.currency?.code,
            payment_term_id: data.payment_term?.id?.toString(),
            receipt_date: data.receipt_date ? new Date(data.receipt_date) : new Date(),
            creation_date: data.created_at ? new Date(data.created_at) : new Date(),
            approval_date: data.approved_at ? new Date(data.approved_at) : new Date(),
            due_date: data.due_date ? new Date(data.due_date) : new Date(),
            notes: data.notes || "",
            rfq_number: data.rfq_number,
            items: data.items?.map(item => ({
              id: item.id,
              purchase_request_item_id: item.purchase_request_item_id,
              item_name: item.item_name,
              quantity: item.quantity,
              unit_name: item.unit?.name,
              target_price: item.target_price || 0,
              unit_price: item.unit_price || 0,
              tax_rate: item.tax_rate || 15,
              selected: true
            })) || []
          });
        }
      })
      .finally(() => setIsLoadingRFQ(false));
  }, [rfqId, methods]);

  useEffect(() => {
    if (isEdit && rfqId) {
      loadRFQDetails();
    }
  }, [isEdit, rfqId, loadRFQDetails]);

  useEffect(() => {
    if (rfqDetailsPrId) {
      fetchPR({ id: rfqDetailsPrId });
    }
  }, [rfqDetailsPrId, fetchPR]);

  useEffect(() => {
    if (!isEdit && prData?.data) {
      const pr = prData.data;
      if (pr.items) {
        methods.setValue("items", pr.items.map(item => ({
          purchase_request_item_id: item.id,
          item_name: item.item_name || item.item?.name?.en,
          quantity: item.remaining_quantity || item.quantity,
          unit_name: item.unit?.name?.en,
          target_price: item.target_price || 0,
          unit_price: 0,
          tax_rate: 15,
          selected: true
        })));
      }
    }
  }, [isEdit, prData, methods]);

  const handleStatusChange = (status, reason = "") => {
    if (!rfqId) return;
    
    setIsUpdatingStatus(true);
    handleChangeRFQStatus({ 
      id: rfqId, 
      status: status,
      body: status === "cancel" ? { cancellation_reason: reason || "Discarded by user" } : {}
    })
      .then(res => {
        if (res?.success) {
          toast.success(`RFQ ${status === "cancel" ? "canceled" : "submitted"} successfully!`);
          setIsCancelModalOpen(false);
          loadRFQDetails();
          // Stay on details or go to details to see next action
          // if(prId) {

          //   navigate(`/purchase-requests/${prId}/rfqs`); 
          // }else {
          //   navigate(`/rfqs`)
          // }
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Failed to update status");
      })
      .finally(() => setIsUpdatingStatus(false));
  };

  const onSubmit = (values) => {
    let payload;
    
    if (isEdit) {
      // Structure based on user request for update
      payload = {
        due_date: values.due_date 
          ? (values.due_date instanceof Date ? format(values.due_date, "yyyy-MM-dd") : format(new Date(values.due_date), "yyyy-MM-dd"))
          : format(new Date(), "yyyy-MM-dd"),
        notes: values.notes || "",
        items: (values.items || []).map(item => ({
          id: item.id,
          supplier_id: Number(values.supplier_id),
          unit_price: Number(item.unit_price) || 0,
          target_price: Number(item.target_price) || 0,
          tax_rate: Number(item.tax_rate) || 15
        }))
      };
    } else {
      // Default structure for creation
      payload = {
        supplier_id: Number(values.supplier_id),
        currency_code: values.currency_code,
        payment_term_id: Number(values.payment_term_id),
        receipt_date: values.receipt_date ? format(values.receipt_date, "yyyy-MM-dd") : null,
        notes: values.notes,
        items: values.items
          .filter(item => item.selected)
          .map(item => ({
            purchase_request_item_id: item.purchase_request_item_id,
            quantity: Number(item.quantity)
          }))
      };
    }

    const action = isEdit 
      ? handleUpdateRFQ({ id: rfqId, body: payload })
      : handleCreateRFQ({ prId: prId, body: payload });

    action.then(res => {
      if (res?.success) {
        toast.success(res.message || `RFQ ${isEdit ? 'updated' : 'created'} successfully!`);
        const newRfqId = res.data?.id || rfqId;
        const redirectPrId = prId || rfqDetailsPrId;
        if(redirectPrId) {
            navigate(`/purchase-requests/${redirectPrId}/rfqs`); 
        } else {
            navigate(`/rfqs`)
        }
        // navigate(`/rfqs/${newRfqId}/details`);
      }
    }).catch(err => {
      toast.error(err.response?.data?.message  || err.response?.data?.error?.message|| "Something went wrong");
    });
  };

  if (isPRLoading || isLoadingRFQ) return <Loading />;

  return (
    <FormProvider {...methods}>
      <div className="flex h-full min-h-screen">
        <div className="flex-1 flex flex-col gap-6 pb-6 px-6 overflow-y-auto">
          <PageHeader 
            title="Request for Quotation" 
            subTitle={isEdit ? `Edit RFQ #${methods.watch("rfq_number")}` : "PR-1025/RFQ-1524242"}
          >
            <div className='flex gap-2 items-center'>
              <Button 
                variant="outline" 
                className="border-primary text-primary h-10 px-6 font-bold" 
                onClick={() => navigate(-1)}
              >
                Discard
              </Button>
              {/* <Button variant="outline" className="border-primary text-primary h-10 px-6 font-bold">Actions</Button> */}
              
              {isEdit && rfqStatus == 'draft' && hasPrices && (
                <Button 
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("submit")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Submitting..." : "Approve & Submit"}
                </Button>
              )}

              {isEdit && rfqStatus == 'rfq_sent' && (
                <Button 
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve to Buyer"}
                </Button>
              )}

              {isEdit && rfqStatus== 'buyer_approval' && (
                <Button 
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("price-gathering-approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve Price Gathering"}
                </Button>
              )}

              {isEdit && rfqStatus == 'price_gathering_approval' && (
                <Button 
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("po-approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve PO Commitment"}
                </Button>
              )}

              {isEdit && rfqStatus == 'po_approval' && (
                <Button 
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("purchase-order")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Issuing..." : "Issue Purchase Order"}
                </Button>
              )}

              <Button 
                className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold" 
                onClick={methods.handleSubmit(onSubmit)}
              >
                {isEdit ? "Save Changes" : "Save Request"}
              </Button>
            </div>
          </PageHeader>

          {isEdit && <RFQStatusTabs currentStatus={rfqStatus} />}

          <div className="space-y-6">
            <div className="relative">
              {/* {isEdit && rfqStatus !== 'purchase_ordered' && rfqStatus !== 'canceled' && (
                <div className="absolute top-6 right-8 z-10 flex gap-2">
                   <Button 
                     variant="outline" 
                     className="border-red-500 text-red-500 hover:bg-red-50 h-9 px-6 font-bold"
                     onClick={() => setIsCancelModalOpen(true)}
                   >
                     Cancel
                   </Button>
                   {rfqStatus !== 'draft' && (
                     <Button 
                       variant="outline" 
                       className="border-primary text-primary h-9 px-6 font-bold"
                       onClick={() => handleStatusChange("draft")}
                     >
                       Set to Draft
                     </Button>
                   )}
                </div>
              )} */}
              <RFQGeneralInfo isEdit={isEdit} prData={prData} />
            </div>
            <RFQItemsTable isEdit={isEdit} prData={prData} />
          </div>
        </div>

        {/* <ActivityChatLog /> */}

        <CancelRFQModal 
          open={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          isLoading={isUpdatingStatus}
          onConfirm={(reason) => handleStatusChange("cancel", reason)}
        />
      </div>
    </FormProvider>
  )
}



