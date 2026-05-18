import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Printer, 
  ChevronRight,
  Save,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Package,
  CreditCard,
  FileText,
  XCircle,
  Trash2
} from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { useQuotationDetails } from '../../hooks/quotations/useQuotationDetails'
import { useUpdateQuotationStatus } from '../../hooks/quotations/useUpdateQuotationStatus'
import { useDeleteQuotation } from '../../hooks/quotations/useDeleteQuotation'
import Loading from '../../components/shared/Loading'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { DeleteModal } from '../../components/shared/DeleteModal'
import { toast } from 'sonner'
import { format } from 'date-fns'

// Components
import QuotationStatusTabs from '../../components/pages/Quotations/QuotationStatusTabs'
import PaymentReceivedModal from '../../components/pages/Quotations/PaymentReceivedModal'
import CancelQuotationModal from '../../components/pages/Quotations/CancelQuotationModal'
import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: quotationResponse, isLoading } = useQuotationDetails(id);
  const updateStatus = useUpdateQuotationStatus();
  const deleteQuotation = useDeleteQuotation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const quotation = quotationResponse?.data;

  const methods = useForm({
    defaultValues: {
      items: []
    }
  });

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
          rfq_item_id: item.rfq_item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          cost_price: item.cost_price,
          selling_price: item.selling_price,
          tax_rate: item.tax_rate,
          available: item.available,
          unit_name: item.unit_name
        })) || []
      });
    }
  }, [quotation, methods]);

  const handleStatusAction = (status, body = {}, onSuccess) => {
    updateStatus.mutate({ id, status, body }, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      }
    });
  };

  const handleDelete = () => {
    deleteQuotation.mutate(id, {
      onSuccess: () => {
        navigate('/quotations');
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/quotations')}>Quotations</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Quotation Details</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 Quotation <span className="text-slate-400 font-normal text-lg">#{quotation?.quotation_number}</span>
                 <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2 uppercase text-[10px]">
                   {quotation?.status?.replace('_', ' ')}
                 </Badge>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Created on {quotation?.created_at ? format(new Date(quotation.created_at), "PPP") : 'N/A'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleteQuotation.isPending}
                className="rounded-xl border-red-200 text-red-600 gap-2 font-bold hover:bg-red-50 h-11 px-6"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
                onClick={() => navigate('/quotations')}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              {/* <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6">
                <Printer className="w-4 h-4" /> Print
              </Button> */}
            </div>
          </div>

          <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden px-8 py-4">
             <QuotationStatusTabs currentStatus={quotation?.status} />
          </Card>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-end items-center gap-3 py-2">
            {quotation?.status !== 'cancelled' && quotation?.status !== 'delivered' && (
              <Button 
                variant="outline"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={updateStatus.isPending}
                className="h-11 px-6 rounded-xl border-red-200 text-red-600 font-bold hover:bg-red-50 gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Quotation
              </Button>
            )}

            {quotation?.status === 'draft' && (
              <Button 
                onClick={() => handleStatusAction('client-approve')} 
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
                {updateStatus.isPending ? "Sending..." : "Send to Client"}
              </Button>
            )}

            {quotation?.status === 'client_approval' && (
              <Button 
                onClick={() => handleStatusAction('manager-approve')} 
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {updateStatus.isPending ? "Approving..." : "Approve as Manager"}
              </Button>
            )}

            {quotation?.status === 'sales_manager_approval' && (
              <Button 
                onClick={() => handleStatusAction('proforma')} 
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <FileText className="w-4 h-4" />
                {updateStatus.isPending ? "Generating..." : "Generate Proforma"}
              </Button>
            )}

            {quotation?.status === 'proforma_invoice' && (
              <Button 
                onClick={() => setIsPaymentModalOpen(true)} 
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <CreditCard className="w-4 h-4" />
                {updateStatus.isPending ? "Processing..." : "Record Payment"}
              </Button>
            )}

            {quotation?.status === 'paid_payment' && (
              <Button 
                onClick={() => handleStatusAction('deliver')} 
                disabled={updateStatus.isPending}
                className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <Package className="w-4 h-4" />
                {updateStatus.isPending ? "Marking..." : "Mark as Delivered"}
              </Button>
            )}

            {quotation?.status === 'delivered' && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
                Completed & Delivered
              </div>
            )}
          </div>

          <div className="space-y-6 pointer-events-none opacity-90">
             <CreateQuotationForm isReadOnly={true} />
          </div>
        </div>
      </div>
      
      <PaymentReceivedModal 
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        isLoading={updateStatus.isPending}
        onConfirm={(data) => handleStatusAction('payment-received', data, () => setIsPaymentModalOpen(false))}
      />

      <CancelQuotationModal 
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        isLoading={updateStatus.isPending}
        onConfirm={(data) => handleStatusAction('cancel', data, () => setIsCancelModalOpen(false))}
      />

      <DeleteModal 
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        title="Delete Quotation"
        desc="Are you sure you want to delete this quotation? This action cannot be undone."
        isLoading={deleteQuotation.isPending}
        isSuccess={deleteQuotation.isSuccess}
        onDelete={handleDelete}
      />
    </FormProvider>
  )
}
