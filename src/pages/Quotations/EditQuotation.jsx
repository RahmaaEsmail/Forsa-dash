import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import CreateQuotationForm from "../../components/pages/Quotations/CreateQuotationForm";
import { FormProvider, useForm } from "react-hook-form";
import { useUpdateQuotation } from "../../hooks/quotations/useUpdateQuotation";
import { useQuotationDetails } from "../../hooks/quotations/useQuotationDetails";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  Send,
  FileCheck,
  CreditCard,
  XCircle,
  CheckCircle2,
  FileText,
  Package,
  Truck,
  Download,
  ChevronRight,
  Undo,
} from "lucide-react";
import Loading from "../../components/shared/Loading";
import { useUpdateQuotationStatus } from "../../hooks/quotations/useUpdateQuotationStatus";
import { useUpdateQuotationPrices } from "../../hooks/quotations/useUpdateQuotationPrices";
import useListSettings from "../../hooks/Settings/useListSettings";
import usePermission from "../../hooks/usePermission";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import QuotationStatusTabs from "../../components/pages/Quotations/QuotationStatusTabs";
import PaymentReceivedModal from "../../components/pages/Quotations/PaymentReceivedModal";
import CancelQuotationModal from "../../components/pages/Quotations/CancelQuotationModal";

export default function EditQuotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const updateQuotation = useUpdateQuotation();
  const updatePrices = useUpdateQuotationPrices();
  const updateStatus = useUpdateQuotationStatus();
  const { data: quotationResponse, isLoading } = useQuotationDetails(id);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: settingsData } = useListSettings();
  const defaultTaxSetting = useMemo(() => {
    const setting = settingsData?.data?.find(
      (s) => s.key === "default_tax" || s.key === "vat",
    );
    return setting?.value !== undefined && setting?.value !== null
      ? Number(setting.value)
      : 15;
  }, [settingsData]);

  const handleStatusAction = (status, body = {}, onSuccess) => {
    updateStatus.mutate(
      { id, status, body },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

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
      delivery_address: "",
      items: [],
    },
  });

  const quotation = quotationResponse?.data;
  const rfqId = quotation?.purchase_request?.id;
  const rfqNumber = quotation?.purchase_request?.display_number || quotation?.purchase_request?.rfq_number;
  const prId =
    quotation?.purchase_request?.id ||
    quotation?.purchase_request?.purchase_request_id ||
    quotation?.purchase_request?.purchase_request?.id;
  const prNumber =
    quotation?.purchase_request?.pr_number ||
    quotation?.purchase_request?.purchase_request?.pr_number;

  console.log("quotation", quotation);
  useEffect(() => {
    if (quotation) {
      methods.reset({
        rfq_id: quotation.purchase_request?.id?.toString(),
        supplier_id: quotation.supplier?.id?.toString(),
        currency_code: quotation.currency?.code,
        quotation_date: quotation.quotation_date
          ? new Date(quotation.quotation_date)
          : new Date(),
        valid_until: quotation.valid_until
          ? new Date(quotation.valid_until)
          : new Date(),
        payment_days: quotation.payment_days || 0,
        delivery_days: quotation.delivery_days || 0,
        notes: quotation.notes || "",
        delivery_address: quotation.delivery_address || "",
        items:
          quotation.items?.map((item) => ({
            id: item.id,
            rfq_item_id: item.rfq_item_id,
            item_name: item.item_name || item.item?.name,
            quantity: item.quantity,
            cost_price: item.cost_price,
            selling_price: item.selling_price !== undefined && item.selling_price !== null ? item.selling_price : item.cost_price,
            tax_rate:
              item.tax_rate !== undefined && item.tax_rate !== null
                ? item.tax_rate
                : defaultTaxSetting,
            available: item.available,
            unit_name: item.unit?.name,
          })) || [],
      });
    }
  }, [quotation, methods, defaultTaxSetting]);

  function onSubmit(values) {
    const payload = {
      valid_until: values.valid_until
        ? format(values.valid_until, "yyyy-MM-dd")
        : null,
      payment_days: Number(values.payment_days) || 0,
      delivery_days: Number(values.delivery_days) || 0,
      notes: values.notes || "",
      delivery_address: values.delivery_address || "",
      items: (values.items || []).map((item) => ({
        id: item.id || null,
        rfq_item_id: Number(item.rfq_item_id),
        quantity: Number(item.quantity),
        selling_price: Number(item.selling_price) || 0,
        cost_price: Number(item.cost_price) || 0,
        tax_rate: Number(item.tax_rate) || 0,
        available: !!item.available,
      })),
    };

    updateQuotation.mutate(
      { id, body: payload },
      {
        onSuccess: () => {
          navigate("/quotations");
        },
      },
    );
  }

  function handleUpdatePrices() {
    const values = methods.getValues();
    const payload = {
      items: (values.items || []).map((item) => ({
        id: item.id,
        selling_price: Number(item.selling_price) || 0,
        tax_rate: Number(item.tax_rate) || 0,
        available: !!item.available,
      })),
    };

    updatePrices.mutate({ id, body: payload });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate("/quotations")}
          >
            Quotations
          </span>
          {prNumber && prId && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => navigate(`/purchase_request_details/${prId}`)}
              >
                PR #{prNumber}
              </span>
            </>
          )}
          {rfqNumber && rfqId && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => navigate(`/rfqs/${rfqId}/details`)}
              >
                RFQ #{rfqNumber}
              </span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate(`/quotations/${id}/details`)}
          >
            Quotation #{quotation?.quotation_number}
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Edit</span>
        </div>

        <PageHeader
          title={`Edit Quotation #${quotation?.quotation_number}`}
          subTitle="Modify quotation details"
        >
          <div className="flex gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/quotations")}
              className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>

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

        {quotation?.purchase_request && prNumber && prId && (
          <div className="flex gap-2 items-center mt-3 bg-slate-50 border border-slate-100 rounded-lg p-2 w-fit">
            <span className="text-xs font-medium text-slate-500">PR Connection:</span>
            <span
              onClick={() => navigate(`/purchase_request_details/${prId}`)}
              className="cursor-pointer text-xs font-bold text-primary hover:underline hover:text-primary/85 flex items-center gap-1.5"
            >
              #{prNumber}
              <Badge variant="outline" className="bg-white text-[9px] py-0 px-1 uppercase border-slate-200">
                {quotation?.purchase_request?.status}
              </Badge>
            </span>
          </div>
        )}

        {/* Status Stepper */}
        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden px-8 py-4 mt-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Current Status:
              </span>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-none rounded-md px-2 uppercase text-[10px]"
              >
                {quotation?.status === "client_approval"
                  ? "Client Approval"
                  : quotation?.status === "sales_manager_approval"
                    ? "Manager Approval"
                    : quotation?.status?.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <QuotationStatusTabs currentStatus={quotation?.status} />
        </Card>

        {/* Action Bar */}
        <div className="flex flex-wrap justify-end items-center gap-3 py-4 mt-4 bg-slate-50/50 px-6 rounded-2xl border border-slate-100">
          <span className="mr-auto text-xs font-bold text-slate-500 uppercase tracking-wider">
            Update Status:
          </span>

          {quotation?.status !== "draft" &&
            hasPermission("edit_quotations") && (
              <Button
                variant="outline"
                type="button"
                onClick={() => handleStatusAction("step-back")}
                disabled={updateStatus.isPending}
                className="h-11 px-6 rounded-xl border-amber-200 text-amber-700 font-bold hover:bg-amber-50 gap-2"
              >
                <Undo className="w-4 h-4" /> Step Back
              </Button>
            )}

          {quotation?.status !== "cancelled" &&
            quotation?.status !== "delivered" && (
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={updateStatus.isPending}
                className="h-11 px-6 rounded-xl border-red-200 text-primary font-bold hover:bg-red-50 gap-2"
              >
                <XCircle className="w-4 h-4" /> Cancel Quotation
              </Button>
            )}

          {quotation?.status === "draft" && (
            <Button
              type="button"
              onClick={() => handleStatusAction("manager-approve")}
              disabled={updateStatus.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Send className="w-4 h-4" />
              {updateStatus.isPending ? "Sending..." : "Send to Manager"}
            </Button>
          )}

          {quotation?.status === "sales_manager_approval" && (
            <Button
              type="button"
              onClick={() => handleStatusAction("client-approve")}
              disabled={updateStatus.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Send className="w-4 h-4" />
              {updateStatus.isPending ? "Sending..." : "Send to Client"}
            </Button>
          )}

          {quotation?.status === "client_approval" && (
            <Button
              type="button"
              onClick={() => handleStatusAction("proforma")}
              disabled={updateStatus.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <FileText className="w-4 h-4" />
              {updateStatus.isPending ? "Generating..." : "Generate Proforma"}
            </Button>
          )}

          {quotation?.status === "proforma_invoice" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  window.open(
                    `/quotations/${id}/details?download=true`,
                    "_blank",
                  )
                }
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-500" /> Proforma Details
              </Button>
              <Button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <CreditCard className="w-4 h-4" />
                {updateStatus.isPending ? "Processing..." : "Record Payment"}
              </Button>
            </>
          )}

          {(quotation?.status === "paid_payment" ||
            quotation?.status === "delivered") && (
            <Button
              type="button"
              onClick={() => navigate(`/create-delivery-note/${id}`)}
              className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-600/20"
            >
              <Truck className="w-4 h-4" />
              Create Delivery Note
            </Button>
          )}

          {quotation?.status === "paid_payment" && (
            <Button
              type="button"
              onClick={() => handleStatusAction("deliver")}
              disabled={updateStatus.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Package className="w-4 h-4" />
              {updateStatus.isPending ? "Marking..." : "Mark as Delivered"}
            </Button>
          )}

          {quotation?.status === "delivered" && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 text-xs">
              <CheckCircle2 className="w-4 h-4" /> Completed & Delivered
            </div>
          )}
        </div>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
          <CreateQuotationForm
            isEdit={true}
            onUpdatePrices={handleUpdatePrices}
            isUpdatingPrices={updatePrices.isPending}
          />
        </form>
      </div>

      <PaymentReceivedModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        isLoading={updateStatus.isPending}
        onConfirm={(data) =>
          handleStatusAction("payment-received", data, () =>
            setIsPaymentModalOpen(false),
          )
        }
      />

      <CancelQuotationModal
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        isLoading={updateStatus.isPending}
        onConfirm={(data) =>
          handleStatusAction("cancel", data, () => setIsCancelModalOpen(false))
        }
      />
    </FormProvider>
  );
}
