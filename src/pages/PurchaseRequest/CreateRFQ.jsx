import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { FormProvider, useForm } from 'react-hook-form'
import RFQGeneralInfo from '../../components/pages/RFQs/RFQForm/RFQGeneralInfo'
import RFQItemsTable from '../../components/pages/RFQs/RFQForm/RFQItemsTable'
import RFQSummary from '../../components/pages/RFQs/RFQForm/RFQSummary'
import RFQStatusTabs from '../../components/pages/RFQs/RFQStatusTabs'
import { handleGetRFQDetails, handleCreateRFQ, handleUpdateRFQ, handleChangeRFQStatus } from '../../services/rfqs'
import usePurchaseDetails from '../../hooks/purchaseRequest/usePurchaseDetails'
import Loading from '../../components/shared/Loading'
import { toast } from 'sonner'
import { format } from 'date-fns'
import CancelRFQModal from '../../components/pages/RFQs/CancelRFQModal'
import ActivityLog from '../../layout/ActivityLog/ActivityLog'
import { Printer, MessageSquare, AlertCircle, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

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
  const [showChat, setShowChat] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, title: '', message: '' });

  const methods = useForm({
    defaultValues: {
      supplier_id: "",
      supplier_name: "",
      currency_code: "SAR",
      payment_term_id: "",
      payment_terms_text: "",
      receipt_date: new Date(),
      creation_date: new Date(),
      approval_date: new Date(),
      due_date: new Date(),
      notes: "",
      terms_and_conditions: "",
      delivery_address: "",
      supplier_address_id: "",
      items: []
    }
  });

  const items = methods.watch("items") || [];
  const { isDirty } = methods.formState;
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
          setRfqStatus(data.status || "draft");
          if (data.purchase_request_id || data.purchase_request?.id) {
            setRfqDetailsPrId(data.purchase_request_id || data.purchase_request?.id);
          }
          methods.reset({
            supplier_id: data.supplier?.id?.toString(),
            supplier_name: data.supplier?.company_name || data.supplier?.contact_name || "",
            currency_code: data.currency?.code,
            payment_term_id: data.payment_term?.id?.toString(),
            payment_terms_text: data.payment_terms_text || "",
            receipt_date: data.receipt_date ? new Date(data.receipt_date) : new Date(),
            creation_date: data.created_at ? new Date(data.created_at) : new Date(),
            approval_date: data.approved_at ? new Date(data.approved_at) : new Date(),
            due_date: data.due_date ? new Date(data.due_date) : new Date(),
            notes: data.notes || "",
            terms_and_conditions: data.terms_and_conditions || "",
            delivery_address: data.delivery_address || "",
            supplier_address_id: data.supplier_address_id ?? "",
            rfq_number: data.rfq_number,
            items: data.items?.map(item => ({
              id: item.id,
              purchase_request_item_id: item.purchase_request_item_id,
              item_name: item.item_name || item.item?.name?.en,
              quantity: item.quantity,
              unit_name: item.unit?.name?.en || item.unit?.name,
              target_price: item.target_price || 0,
              unit_price: Number(item.unit_price) || 0,
              tax_rate: item.tax_rate || 15,
              selected: true,
              is_custom: false
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
          selected: true,
          is_custom: false
        })));
      }
    }
  }, [isEdit, prData, methods]);

  const showErrorPopup = (title, message) => {
    setErrorDialog({ open: true, title, message });
  };

  const saveRFQChanges = (values) => {
    let payload;

    if (isEdit) {
      payload = {
        due_date: values.due_date
          ? (values.due_date instanceof Date ? format(values.due_date, "yyyy-MM-dd") : format(new Date(values.due_date), "yyyy-MM-dd"))
          : format(new Date(), "yyyy-MM-dd"),
        notes: values.notes || "",
        terms_and_conditions: values.terms_and_conditions || "",
        delivery_address: values.delivery_address || "",
        items: (values.items || []).map(item => {
          if (item.is_custom && !item.id) {
            return {
              item_name: item.item_name,
              unit_name: item.unit_name,
              supplier_id: Number(values.supplier_id),
              unit_price: Number(item.unit_price) || 0,
              target_price: Number(item.target_price) || 0,
              tax_rate: Number(item.tax_rate) || 15
            };
          }
          return {
            id: item.id,
            supplier_id: Number(values.supplier_id),
            unit_price: Number(item.unit_price) || 0,
            target_price: Number(item.target_price) || 0,
            tax_rate: Number(item.tax_rate) || 15
          };
        })
      };
    } else {
      payload = {
        supplier_id: Number(values.supplier_id),
        currency_code: values.currency_code,
        payment_term_id: Number(values.payment_term_id),
        receipt_date: values.receipt_date ? format(values.receipt_date, "yyyy-MM-dd") : null,
        notes: values.notes,
        delivery_address: values.delivery_address || "",
        ...(values.supplier_address_id ? { supplier_address_id: Number(values.supplier_address_id) } : {}),
        items: values.items
          .filter(item => item.selected)
          .map(item => {
            if (item.is_custom) {
              return {
                item_name: item.item_name,
                unit_name: item.unit_name,
                quantity: Number(item.quantity)
              };
            }
            return {
              purchase_request_item_id: item.purchase_request_item_id,
              quantity: Number(item.quantity)
            };
          })
      };
    }

    const action = isEdit
      ? handleUpdateRFQ({ id: rfqId, body: payload })
      : handleCreateRFQ({ prId: prId, body: payload });

    return action.then(res => {
      if (res?.success) {
        toast.success(res.message || `RFQ ${isEdit ? 'updated' : 'created'} successfully!`);
        if (isEdit) {
          loadRFQDetails();
        } else {
          const newRfqId = res.data?.id || res.data?.rfq?.id || res.rfq?.id;
          if (newRfqId) {
            navigate(`/rfqs/${newRfqId}/edit`);
          } else {
            const redirectPrId = prId || rfqDetailsPrId;
            if (redirectPrId) navigate(`/purchase-requests/${redirectPrId}/rfqs`);
            else navigate(`/rfqs`);
          }
        }
        return res;
      }
      throw new Error(res?.message || "Failed to save RFQ");
    });
  };

  const handleStatusChange = (status, reason = "") => {
    if (!rfqId) return;

    const performStatusChange = (values) => {
      setIsUpdatingStatus(true);
      const currentItems = values.items || [];
      const currentHasPrices = currentItems.some(item => Number(item.unit_price) > 0);

      const priceRequiredStatuses = ["approve", "price-gathering-approve", "po-approve", "purchase-order"];
      if (priceRequiredStatuses.includes(status) && !currentHasPrices) {
        showErrorPopup(
          "Prices Required",
          "At least one item must have a unit price set before proceeding to the next stage. Please enter prices for the received quotations."
        );
        setIsUpdatingStatus(false);
        return;
      }

      return handleChangeRFQStatus({
        id: rfqId,
        status: status,
        body: status === "cancel" ? { cancellation_reason: reason || "Discarded by user" } : {}
      })
        .then(statusRes => {
          if (statusRes?.success) {
            toast.success(`RFQ ${status === "cancel" ? "canceled" : "status updated"} successfully!`);
            setIsCancelModalOpen(false);
            loadRFQDetails();
          }
        })
        .catch(err => {
          const message = err.response?.data?.message || err.response?.data?.error?.message || err.message || "Failed to update RFQ status.";
          showErrorPopup("Status Change Failed", message);
        })
        .finally(() => setIsUpdatingStatus(false));
    };

    if (isEdit && rfqStatus === 'draft' && methods.formState.isDirty) {
      methods.handleSubmit((values) => {
        setIsUpdatingStatus(true);
        saveRFQChanges(values)
          .then((res) => {
            if (res?.success) {
              return performStatusChange(values);
            }
          })
          .catch(err => {
            const message = err.response?.data?.message || err.response?.data?.error?.message || err.message || "Failed to save RFQ.";
            showErrorPopup("Save Failed", message);
            setIsUpdatingStatus(false);
          });
      })();
    } else {
      performStatusChange(methods.getValues());
    }
  };

  const onSubmit = (values) => {
    saveRFQChanges(values).catch(err => {
      toast.error(err.response?.data?.message || err.response?.data?.error?.message || err.message || "Something went wrong");
    });
  };

  if (isPRLoading || isLoadingRFQ) return <Loading />;

  return (
    <FormProvider {...methods}>
      <div className="flex h-full min-h-screen">
        <div className="flex-1 flex flex-col gap-6 pb-6 px-6 overflow-y-auto">
          <PageHeader
            title="Request for Quotation"
            subTitle={isEdit ? `Edit RFQ #${methods.watch("rfq_number")}` : `PR #${prData?.data?.pr_number || prId}`}
          >
            <div className='flex gap-2 items-center'>
              {isEdit ? (
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 h-10 px-6 font-bold"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-primary text-primary h-10 px-6 font-bold"
                  onClick={() => navigate(-1)}
                >
                  Discard
                </Button>
              )}

              {isEdit && (
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-600 h-10 px-4 font-bold gap-2"
                  onClick={() => navigate(`/rfqs/${rfqId}/details`)}
                  title="Print / View PDF"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              )}

              {isEdit && (
                <Button
                  variant="outline"
                  className={`h-10 px-4 font-bold gap-2 ${showChat ? 'bg-primary/10 border-primary text-primary' : 'border-slate-300 text-slate-600'}`}
                  onClick={() => setShowChat(v => !v)}
                  title="Activity Chat Log"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}

              {/* Draft → RFQ Sent: no price required */}
              {isEdit && rfqStatus === 'draft' && (
                <Button
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("submit")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Submitting..." : "Approve & Submit"}
                </Button>
              )}

              {/* RFQ Sent → Buyer Approval: price required */}
              {isEdit && rfqStatus === 'rfq_sent' && (
                <Button
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve to Buyer"}
                </Button>
              )}

              {isEdit && rfqStatus === 'buyer_approval' && (
                <Button
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("price-gathering-approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve Price Gathering"}
                </Button>
              )}

              {isEdit && rfqStatus === 'price_gathering_approval' && (
                <Button
                  className="bg-primary hover:bg-primary/90 h-10 px-6 font-bold"
                  onClick={() => handleStatusChange("po-approve")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Approving..." : "Approve PO Commitment"}
                </Button>
              )}

              {isEdit && rfqStatus === 'po_approval' && (
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
            <RFQGeneralInfo isEdit={isEdit} prData={prData} />
            <RFQItemsTable isEdit={isEdit} prData={prData} />
            {/* <RFQSummary /> */}
          </div>
        </div>

        {isEdit && showChat && rfqId && (
          <ActivityLog
            modelType="rfq"
            modelId={rfqId}
            onClose={() => setShowChat(false)}
          />
        )}

        <CancelRFQModal
          open={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          isLoading={isUpdatingStatus}
          onConfirm={(reason) => handleStatusChange("cancel", reason)}
        />

        {/* Error Dialog */}
        <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(d => ({ ...d, open }))}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                {errorDialog.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-600 leading-relaxed">{errorDialog.message}</p>
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setErrorDialog(d => ({ ...d, open: false }))}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </FormProvider>
  )
}
