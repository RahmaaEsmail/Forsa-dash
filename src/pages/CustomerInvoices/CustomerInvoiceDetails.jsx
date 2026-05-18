import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  CreditCard,
  Layers,
  Info,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import CustomTable from '../../components/shared/CustomTable'
import Loading from '../../components/shared/Loading'
import { DeleteModal } from '../../components/shared/DeleteModal'
import useCustomerInvoiceDetails from '../../hooks/customer-invoices/useCustomerInvoiceDetails'
import useDeleteCustomerInvoice from '../../hooks/customer-invoices/useDeleteCustomerInvoice'
import useApproveCustomerInvoice from '../../hooks/customer-invoices/useApproveCustomerInvoice'
import useMarkPaidCustomerInvoice from '../../hooks/customer-invoices/useMarkPaidCustomerInvoice'
import useCancelCustomerInvoice from '../../hooks/customer-invoices/useCancelCustomerInvoice'
import CancelInvoiceModal from '../../components/pages/CustomerInvoices/CancelInvoiceModal'
import MarkPaidModal from '../../components/pages/CustomerInvoices/MarkPaidModal'

export default function CustomerInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: invoiceResponse, isLoading } = useCustomerInvoiceDetails(id);
  const deleteMutation = useDeleteCustomerInvoice();
  const approveMutation = useApproveCustomerInvoice();
  const markPaidMutation = useMarkPaidCustomerInvoice();
  const cancelMutation = useCancelCustomerInvoice();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);

  const invoice = invoiceResponse?.data;
  const isDraft = invoice?.status === 'draft';
  const isApproved = invoice?.status === 'approved';
  const isCancelled = invoice?.status === 'cancelled' || invoice?.status === 'canceled';
  const isPaid = invoice?.status === 'paid';

  const handleDelete = () => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        navigate('/customer-invoices');
      }
    });
  };

  const handleApprove = () => {
    approveMutation.mutate({ id });
  };

  const handleMarkPaid = (formData) => {
    markPaidMutation.mutate({ id, body: formData }, {
      onSuccess: () => {
        setMarkPaidModalOpen(false);
      }
    });
  };

  const handleCancel = (data) => {
    cancelMutation.mutate({ id, body: data }, {
      onSuccess: () => {
        setCancelModalOpen(false);
      }
    });
  };


  const columns = [
    {
      title: "Product / Description",
      className: "text-left px-6 py-4",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">
            {record.item_name || record.item?.name || 'N/A'}
          </span>
          {record.sku && (
            <span className="text-xs text-slate-400">SKU: {record.sku}</span>
          )}
        </div>
      )
    },
    {
      title: "Quantity",
      className: "text-center px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {Number(record.quantity || 0).toLocaleString()} {record.unit?.name || record.unit_name || ''}
        </span>
      )
    },
    {
      title: "Unit Price",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {Number(record.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    },
    {
      title: "Discount %",
      className: "text-center px-6 py-4",
      render: (_, record) => (
        <span className="font-semibold text-slate-600 text-sm">
          {Number(record.discount_percentage || 0)}%
        </span>
      )
    },
    {
      title: "Vat Amount",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-semibold text-slate-600 text-sm">
          {Number(record.vat_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    },
    {
      title: "Total Amount",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-extrabold text-primary text-sm">
          {Number(record.line_total || record.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">
              Invoice <span className="text-slate-400 font-normal">#{invoice?.invoice_number || `INV-${invoice?.id}`}</span>
            </h1>
            <Badge 
              className={`capitalize border-none font-bold px-3 py-1 rounded-xl text-xs ${
                isDraft 
                  ? "bg-slate-100 text-slate-600" 
                  : isApproved
                    ? "bg-blue-50 text-blue-600"
                    : isPaid
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
              }`}
            >
              {invoice?.status?.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Created on {invoice?.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={() => navigate('/customer-invoices')}
            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {isDraft && (
            <>
              <Button 
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-600/10 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>

              <Button 
                onClick={() => navigate(`/customer-invoices/${id}/edit`)}
                className="h-11 px-6 rounded-xl bg-blue-50 text-blue-600 font-bold gap-2 hover:bg-blue-100 border border-blue-100 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>

              <Button 
                onClick={() => setCancelModalOpen(true)}
                className="h-11 px-6 rounded-xl bg-orange-50 text-orange-600 font-bold gap-2 hover:bg-orange-100 border border-orange-100 transition-all"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </Button>

              <Button 
                onClick={() => setDeleteModalOpen(true)}
                className="h-11 px-6 rounded-xl bg-red-50 text-red-500 font-bold gap-2 hover:bg-red-100 border border-red-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </>
          )}

          {isApproved && (
            <>
              <Button 
                onClick={() => setMarkPaidModalOpen(true)}
                disabled={markPaidMutation.isPending}
                className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-600/10 transition-all"
              >
                <DollarSign className="w-4 h-4" />
                {markPaidMutation.isPending ? "Marking Paid..." : "Mark Paid"}
              </Button>

              <Button 
                onClick={() => setCancelModalOpen(true)}
                className="h-11 px-6 rounded-xl bg-orange-50 text-orange-600 font-bold gap-2 hover:bg-orange-100 border border-orange-100 transition-all"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details and Items Table */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Invoice Details Card */}
          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-slate-900 font-bold text-base">General Information</h2>
                <p className="text-slate-500 text-xs mt-0.5">Reference logs and basic specs</p>
              </div>
            </div>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Invoice Number</span>
                <span className="font-bold text-slate-800">#{invoice?.invoice_number}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Reference Number</span>
                <span className="font-bold text-slate-800">{invoice?.reference_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Creation Date</span>
                <span className="font-bold text-slate-800">{invoice?.creation_date || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Payment Term</span>
                <span className="font-bold text-slate-800">{invoice?.payment_term?.name || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Table */}
          <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base">Invoice Line Items</h3>
            </div>
            <div className="p-0">
              <CustomTable
                columns={columns}
                dataSource={invoice?.items || []}
                rowKey="id"
                className="border-none p-0"
                tableClassName="w-full border-separate border-spacing-0"
                headerClassName="bg-slate-50/80 text-slate-500 border-b uppercase text-[10px] tracking-wider font-bold py-3.5"
                rowClassName="border-b last:border-b-0"
              />
            </div>
          </Card>

          {/* Notes Card */}
          {invoice?.notes && (
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
                <Info className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-900 text-base">Notes / Terms</h3>
              </div>
              <CardContent className="p-6">
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Attachments / Payment Proof Card */}
          {invoice?.attachments && invoice.attachments.length > 0 && (
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden mt-6">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 text-base">Payment Proof / Attachments</h3>
              </div>
              <CardContent className="p-6 space-y-3">
                {invoice.attachments.map((att, idx) => (
                  <a 
                    key={idx} 
                    href={att.url || att.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">
                        {att.file_name || att.name || `Proof Attachment #${idx + 1}`}
                      </span>
                    </div>
                    <span className="text-xs text-primary font-bold group-hover:underline">
                      View Document
                    </span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Info Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Customer Details Card */}
          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-slate-900 font-bold text-base">Customer Details</h2>
                <p className="text-slate-500 text-xs mt-0.5">Target client profile</p>
              </div>
            </div>

            <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
              <div className="flex justify-between items-start py-2 border-b border-slate-50 gap-2">
                <span className="font-medium text-slate-400 shrink-0">Company</span>
                <span className="font-bold text-slate-800 text-right leading-snug">
                  {invoice?.customer?.company_name || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50 gap-2">
                <span className="font-medium text-slate-400 shrink-0">Email</span>
                <span className="font-semibold text-slate-700 text-right truncate">
                  {invoice?.customer?.email || 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Ref Details */}
          {invoice?.quotation && (
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base">Source Quotation</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Underlying agreement ref</p>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-medium text-slate-400">Quotation Code</span>
                  <span className="font-bold text-slate-800">#{invoice.quotation.quotation_number}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-slate-400">Quotation Status</span>
                  <Badge variant="outline" className="capitalize px-2 py-0.5 rounded-md text-[10px] bg-slate-50 text-slate-600 border-none font-semibold">
                    {invoice.quotation.status?.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial summary Card */}
          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-slate-900 font-bold text-base">Financial Summary</h2>
                <p className="text-slate-500 text-xs mt-0.5">Calculated invoice totals</p>
              </div>
            </div>

            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">
                  {Number(invoice?.financial_summary?.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Total Discount</span>
                <span className="font-semibold text-red-500">
                  -{Number(invoice?.financial_summary?.discount_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>VAT Amount</span>
                <span className="font-semibold text-slate-700">
                  {Number(invoice?.financial_summary?.vat_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-base">Grand Total</span>
                <span className="font-extrabold text-primary text-xl">
                  {Number(invoice?.financial_summary?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteModal 
        open={deleteModalOpen} 
        setOpen={setDeleteModalOpen}
        onDelete={handleDelete}
        isLoading={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        title={`Delete Customer Invoice #${invoice?.invoice_number || ''}`}
        desc="Are you sure you want to delete this customer invoice? This action cannot be undone."
      />

      <CancelInvoiceModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleCancel}
        isLoading={cancelMutation.isPending}
      />

      <MarkPaidModal
        open={markPaidModalOpen}
        onOpenChange={setMarkPaidModalOpen}
        onConfirm={handleMarkPaid}
        isLoading={markPaidMutation.isPending}
      />
    </div>
  )
}
