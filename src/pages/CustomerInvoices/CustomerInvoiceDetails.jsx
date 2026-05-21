// import React, { useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { 
//   ArrowLeft, 
//   Edit, 
//   Trash2, 
//   FileText, 
//   Calendar, 
//   User, 
//   CreditCard,
//   Layers,
//   Info,
//   CheckCircle,
//   XCircle,
//   DollarSign
// } from 'lucide-react'
// import { Badge } from '../../components/ui/badge'
// import { Button } from '../../components/ui/button'
// import { Card, CardContent } from '../../components/ui/card'
// import CustomTable from '../../components/shared/CustomTable'
// import Loading from '../../components/shared/Loading'
// import { DeleteModal } from '../../components/shared/DeleteModal'
// import useCustomerInvoiceDetails from '../../hooks/customer-invoices/useCustomerInvoiceDetails'
// import useDeleteCustomerInvoice from '../../hooks/customer-invoices/useDeleteCustomerInvoice'
// import useApproveCustomerInvoice from '../../hooks/customer-invoices/useApproveCustomerInvoice'
// import useMarkPaidCustomerInvoice from '../../hooks/customer-invoices/useMarkPaidCustomerInvoice'
// import useCancelCustomerInvoice from '../../hooks/customer-invoices/useCancelCustomerInvoice'
// import CancelInvoiceModal from '../../components/pages/CustomerInvoices/CancelInvoiceModal'
// import MarkPaidModal from '../../components/pages/CustomerInvoices/MarkPaidModal'

// export default function CustomerInvoiceDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const { data: invoiceResponse, isLoading } = useCustomerInvoiceDetails(id);
//   const deleteMutation = useDeleteCustomerInvoice();
//   const approveMutation = useApproveCustomerInvoice();
//   const markPaidMutation = useMarkPaidCustomerInvoice();
//   const cancelMutation = useCancelCustomerInvoice();

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [cancelModalOpen, setCancelModalOpen] = useState(false);
//   const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);

//   const invoice = invoiceResponse?.data;
//   const isDraft = invoice?.status === 'draft';
//   const isApproved = invoice?.status === 'approved';
//   const isCancelled = invoice?.status === 'cancelled' || invoice?.status === 'canceled';
//   const isPaid = invoice?.status === 'paid';

//   const handleDelete = () => {
//     deleteMutation.mutate({ id }, {
//       onSuccess: () => {
//         navigate('/customer-invoices');
//       }
//     });
//   };

//   const handleApprove = () => {
//     approveMutation.mutate({ id });
//   };

//   const handleMarkPaid = (formData) => {
//     markPaidMutation.mutate({ id, body: formData }, {
//       onSuccess: () => {
//         setMarkPaidModalOpen(false);
//       }
//     });
//   };

//   const handleCancel = (data) => {
//     cancelMutation.mutate({ id, body: data }, {
//       onSuccess: () => {
//         setCancelModalOpen(false);
//       }
//     });
//   };


//   const columns = [
//     {
//       title: "Product / Description",
//       className: "text-left px-6 py-4",
//       render: (_, record) => (
//         <div className="flex flex-col">
//           <span className="font-semibold text-slate-800 text-sm">
//             {record.item_name || record.item?.name || 'N/A'}
//           </span>
//           {record.sku && (
//             <span className="text-xs text-slate-400">SKU: {record.sku}</span>
//           )}
//         </div>
//       )
//     },
//     {
//       title: "Quantity",
//       className: "text-center px-6 py-4",
//       render: (_, record) => (
//         <span className="font-bold text-slate-700 text-sm">
//           {Number(record.quantity || 0).toLocaleString()} {record.unit?.name || record.unit_name || ''}
//         </span>
//       )
//     },
//     {
//       title: "Unit Price",
//       className: "text-right px-6 py-4",
//       render: (_, record) => (
//         <span className="font-bold text-slate-700 text-sm">
//           {Number(record.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//         </span>
//       )
//     },
//     {
//       title: "Discount %",
//       className: "text-center px-6 py-4",
//       render: (_, record) => (
//         <span className="font-semibold text-slate-600 text-sm">
//           {Number(record.discount_percentage || 0)}%
//         </span>
//       )
//     },
//     {
//       title: "Vat Amount",
//       className: "text-right px-6 py-4",
//       render: (_, record) => (
//         <span className="font-semibold text-slate-600 text-sm">
//           {Number(record.vat_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//         </span>
//       )
//     },
//     {
//       title: "Total Amount",
//       className: "text-right px-6 py-4",
//       render: (_, record) => (
//         <span className="font-extrabold text-primary text-sm">
//           {Number(record.line_total || record.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//         </span>
//       )
//     }
//   ];

//   if (isLoading) return <Loading />;

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 pb-16">
      
//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-black text-slate-900">
//               Invoice <span className="text-slate-400 font-normal">#{invoice?.invoice_number || `INV-${invoice?.id}`}</span>
//             </h1>
//             <Badge 
//               className={`capitalize border-none font-bold px-3 py-1 rounded-xl text-xs ${
//                 isDraft 
//                   ? "bg-slate-100 text-slate-600" 
//                   : isApproved
//                     ? "bg-blue-50 text-blue-600"
//                     : isPaid
//                       ? "bg-emerald-50 text-emerald-600"
//                       : "bg-red-50 text-red-600"
//               }`}
//             >
//               {invoice?.status?.replace('_', ' ')}
//             </Badge>
//           </div>
//           <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
//             <Calendar className="w-4 h-4 text-slate-400" />
//             Created on {invoice?.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
//           </p>
//         </div>

//         <div className="flex gap-3 flex-wrap">
//           <Button 
//             variant="outline" 
//             onClick={() => navigate('/customer-invoices')}
//             className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 transition-all"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>

//           {isDraft && (
//             <>
//               <Button 
//                 onClick={handleApprove}
//                 disabled={approveMutation.isPending}
//                 className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-600/10 transition-all"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {approveMutation.isPending ? "Approving..." : "Approve"}
//               </Button>

//               <Button 
//                 onClick={() => navigate(`/customer-invoices/${id}/edit`)}
//                 className="h-11 px-6 rounded-xl bg-blue-50 text-blue-600 font-bold gap-2 hover:bg-blue-100 border border-blue-100 transition-all"
//               >
//                 <Edit className="w-4 h-4" />
//                 Edit
//               </Button>

//               <Button 
//                 onClick={() => setCancelModalOpen(true)}
//                 className="h-11 px-6 rounded-xl bg-orange-50 text-orange-600 font-bold gap-2 hover:bg-orange-100 border border-orange-100 transition-all"
//               >
//                 <XCircle className="w-4 h-4" />
//                 Cancel
//               </Button>

//               <Button 
//                 onClick={() => setDeleteModalOpen(true)}
//                 className="h-11 px-6 rounded-xl bg-red-50 text-red-500 font-bold gap-2 hover:bg-red-100 border border-red-100 transition-all"
//               >
//                 <Trash2 className="w-4 h-4" />
//                 Delete
//               </Button>
//             </>
//           )}

//           {isApproved && (
//             <>
//               <Button 
//                 onClick={() => setMarkPaidModalOpen(true)}
//                 disabled={markPaidMutation.isPending}
//                 className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-600/10 transition-all"
//               >
//                 <DollarSign className="w-4 h-4" />
//                 {markPaidMutation.isPending ? "Marking Paid..." : "Mark Paid"}
//               </Button>

//               <Button 
//                 onClick={() => setCancelModalOpen(true)}
//                 className="h-11 px-6 rounded-xl bg-orange-50 text-orange-600 font-bold gap-2 hover:bg-orange-100 border border-orange-100 transition-all"
//               >
//                 <XCircle className="w-4 h-4" />
//                 Cancel
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Main Details and Items Table */}
//         <div className="lg:col-span-2 flex flex-col gap-8">
          
//           {/* Invoice Details Card */}
//           <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//             <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
//               <div className="bg-primary/10 p-2 rounded-xl text-primary">
//                 <FileText className="w-5 h-5" />
//               </div>
//               <div>
//                 <h2 className="text-slate-900 font-bold text-base">General Information</h2>
//                 <p className="text-slate-500 text-xs mt-0.5">Reference logs and basic specs</p>
//               </div>
//             </div>

//             <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
//               <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
//                 <span className="font-semibold text-slate-400">Invoice Number</span>
//                 <span className="font-bold text-slate-800">#{invoice?.invoice_number}</span>
//               </div>
//               <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
//                 <span className="font-semibold text-slate-400">Reference Number</span>
//                 <span className="font-bold text-slate-800">{invoice?.reference_number || 'N/A'}</span>
//               </div>
//               <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
//                 <span className="font-semibold text-slate-400">Creation Date</span>
//                 <span className="font-bold text-slate-800">{invoice?.creation_date || 'N/A'}</span>
//               </div>
//               <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
//                 <span className="font-semibold text-slate-400">Payment Term</span>
//                 <span className="font-bold text-slate-800">{invoice?.payment_term?.name || 'N/A'}</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Line Items Table */}
//           <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//             <div className="p-5 border-b bg-slate-50/50">
//               <h3 className="font-bold text-slate-900 text-base">Invoice Line Items</h3>
//             </div>
//             <div className="p-0">
//               <CustomTable
//                 columns={columns}
//                 dataSource={invoice?.items || []}
//                 rowKey="id"
//                 className="border-none p-0"
//                 tableClassName="w-full border-separate border-spacing-0"
//                 headerClassName="bg-slate-50/80 text-slate-500 border-b uppercase text-[10px] tracking-wider font-bold py-3.5"
//                 rowClassName="border-b last:border-b-0"
//               />
//             </div>
//           </Card>

//           {/* Notes Card */}
//           {invoice?.notes && (
//             <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//               <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
//                 <Info className="w-5 h-5 text-slate-400" />
//                 <h3 className="font-bold text-slate-900 text-base">Notes / Terms</h3>
//               </div>
//               <CardContent className="p-6">
//                 <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
//                   {invoice.notes}
//                 </p>
//               </CardContent>
//             </Card>
//           )}

//           {/* Attachments / Payment Proof Card */}
//           {invoice?.attachments && invoice.attachments.length > 0 && (
//             <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden mt-6">
//               <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-emerald-500" />
//                 <h3 className="font-bold text-slate-900 text-base">Payment Proof / Attachments</h3>
//               </div>
//               <CardContent className="p-6 space-y-3">
//                 {invoice.attachments.map((att, idx) => (
//                   <a 
//                     key={idx} 
//                     href={att.url || att.file_url} 
//                     target="_blank" 
//                     rel="noreferrer"
//                     className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 rounded-xl transition-all group"
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
//                       <span className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">
//                         {att.file_name || att.name || `Proof Attachment #${idx + 1}`}
//                       </span>
//                     </div>
//                     <span className="text-xs text-primary font-bold group-hover:underline">
//                       View Document
//                     </span>
//                   </a>
//                 ))}
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Right Info Sidebar */}
//         <div className="lg:col-span-1 flex flex-col gap-8">
          
//           {/* Customer Details Card */}
//           <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//             <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
//               <div className="bg-primary/10 p-2 rounded-xl text-primary">
//                 <User className="w-5 h-5" />
//               </div>
//               <div>
//                 <h2 className="text-slate-900 font-bold text-base">Customer Details</h2>
//                 <p className="text-slate-500 text-xs mt-0.5">Target client profile</p>
//               </div>
//             </div>

//             <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
//               <div className="flex justify-between items-start py-2 border-b border-slate-50 gap-2">
//                 <span className="font-medium text-slate-400 shrink-0">Company</span>
//                 <span className="font-bold text-slate-800 text-right leading-snug">
//                   {invoice?.customer?.company_name || 'N/A'}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-slate-50 gap-2">
//                 <span className="font-medium text-slate-400 shrink-0">Email</span>
//                 <span className="font-semibold text-slate-700 text-right truncate">
//                   {invoice?.customer?.email || 'N/A'}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quotation Ref Details */}
//           {invoice?.quotation && (
//             <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//               <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
//                 <div className="bg-primary/10 p-2 rounded-xl text-primary">
//                   <FileText className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <h2 className="text-slate-900 font-bold text-base">Source Quotation</h2>
//                   <p className="text-slate-500 text-xs mt-0.5">Underlying agreement ref</p>
//                 </div>
//               </div>

//               <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
//                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
//                   <span className="font-medium text-slate-400">Quotation Code</span>
//                   <span className="font-bold text-slate-800">#{invoice.quotation.quotation_number}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="font-medium text-slate-400">Quotation Status</span>
//                   <Badge variant="outline" className="capitalize px-2 py-0.5 rounded-md text-[10px] bg-slate-50 text-slate-600 border-none font-semibold">
//                     {invoice.quotation.status?.replace(/_/g, ' ')}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Financial summary Card */}
//           <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
//             <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
//               <div className="bg-primary/10 p-2 rounded-xl text-primary">
//                 <Layers className="w-5 h-5" />
//               </div>
//               <div>
//                 <h2 className="text-slate-900 font-bold text-base">Financial Summary</h2>
//                 <p className="text-slate-500 text-xs mt-0.5">Calculated invoice totals</p>
//               </div>
//             </div>

//             <CardContent className="p-6 flex flex-col gap-4">
//               <div className="flex justify-between items-center text-sm text-slate-500">
//                 <span>Subtotal</span>
//                 <span className="font-semibold text-slate-700">
//                   {Number(invoice?.financial_summary?.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center text-sm text-slate-500">
//                 <span>Total Discount</span>
//                 <span className="font-semibold text-red-500">
//                   -{Number(invoice?.financial_summary?.discount_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center text-sm text-slate-500">
//                 <span>VAT Amount</span>
//                 <span className="font-semibold text-slate-700">
//                   {Number(invoice?.financial_summary?.vat_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//                 </span>
//               </div>

//               <div className="border-t border-slate-100 my-2"></div>

//               <div className="flex justify-between items-center">
//                 <span className="font-bold text-slate-800 text-base">Grand Total</span>
//                 <span className="font-extrabold text-primary text-xl">
//                   {Number(invoice?.financial_summary?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <DeleteModal 
//         open={deleteModalOpen} 
//         setOpen={setDeleteModalOpen}
//         onDelete={handleDelete}
//         isLoading={deleteMutation.isPending}
//         isSuccess={deleteMutation.isSuccess}
//         title={`Delete Customer Invoice #${invoice?.invoice_number || ''}`}
//         desc="Are you sure you want to delete this customer invoice? This action cannot be undone."
//       />

//       <CancelInvoiceModal
//         open={cancelModalOpen}
//         onOpenChange={setCancelModalOpen}
//         onConfirm={handleCancel}
//         isLoading={cancelMutation.isPending}
//       />

//       <MarkPaidModal
//         open={markPaidModalOpen}
//         onOpenChange={setMarkPaidModalOpen}
//         onConfirm={handleMarkPaid}
//         isLoading={markPaidMutation.isPending}
//       />
//     </div>
//   )
// }


import React, { useState, useRef } from 'react'
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
  DollarSign,
  AlertTriangle,
  UserCheck,
  CalendarCheck2,
  Printer
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
import useListSettings from '../../hooks/Settings/useListSettings'
import MarkPaidModal from '../../components/pages/CustomerInvoices/MarkPaidModal'

export default function CustomerInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  
  const { data: invoiceResponse, isLoading } = useCustomerInvoiceDetails(id);
  const deleteMutation = useDeleteCustomerInvoice();
  const approveMutation = useApproveCustomerInvoice();
  const markPaidMutation = useMarkPaidCustomerInvoice();
  const cancelMutation = useCancelCustomerInvoice();

  const { data: settingsData } = useListSettings();
  const getSetting = (key) => settingsData?.data?.find(s => s.key === key)?.value;

  const companyPhone = getSetting('phone') || getSetting('company_phone') || '+966 55 598 0730';
  const companyEmail = getSetting('email') || getSetting('company_email') || 'Sales@forsageneraltrading.com';
  const companyVat = getSetting('vat') || getSetting('vat_number') || '300123456700003';
  const companyAddress = getSetting('address') || getSetting('company_address') || 'King Fahd Road, Olaya District, Riyadh 12211';

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);

  const invoice = invoiceResponse?.data;
  const isDraft = invoice?.status === 'draft';
  const isApproved = invoice?.status === 'approved';
  const isCancelled = invoice?.status === 'cancelled' || invoice?.status === 'canceled';
  const isPaid = invoice?.status === 'paid';

  const handlePrint = () => {
    window.print();
  };

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

  // Safe formatting utilities matching API decimal strings
  const formatAmount = (val) => parseFloat(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatNumber = (val) => parseFloat(val || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

  const columns = [
    {
      title: "Product / Description",
      className: "text-left px-6 py-4",
      render: (_, record) => {
        const displayName = record.item_name || record.item?.name || 'N/A';
        const arabicName = record.item?.name && record.item_name !== record.item?.name ? record.item.name : null;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 text-sm">{displayName}</span>
            {arabicName && <span className="text-xs text-slate-400 font-medium mt-0.5 italic">{arabicName}</span>}
            {record.sku && <span className="text-xs text-slate-400 mt-0.5">SKU: {record.sku}</span>}
          </div>
        );
      }
    },
    {
      title: "Quantity",
      className: "text-center px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {formatNumber(record.quantity)} {record.unit?.name || record.unit_name || ''}
        </span>
      )
    },
    {
      title: "Unit Price",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {formatAmount(record.unit_price)} {invoice?.currency?.code || 'SAR'}
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
          {formatAmount(record.vat_amount)} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    },
    {
      title: "Total Amount",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-extrabold text-primary text-sm">
          {formatAmount(record.line_total || record.subtotal || 0)} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 pb-16">
      
      {/* HIGH-FIDELITY CSS PRINT STYLES ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          
          #printable-invoice-area-wrapper { 
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-invoice-area-wrapper * { visibility: visible !important; }
          
          @page { size: A4; margin: 15mm 10mm 15mm 10mm; }
        }
      `}} />

      {/* Interactive Desktop Controls Workspace Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8 no-print">
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
            Created on {invoice?.creation_date || (invoice?.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A')}
            {invoice?.created_by?.name && <span className="text-slate-300 mx-1">|</span>}
            {invoice?.created_by?.name && `By ${invoice.created_by.name}`}
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

          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Download/Print PDF
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

      {/* Cancellation Notice Alert Box Workspace */}
      {/* {isCancelled && invoice?.cancellation_reason && (
        <div className="mb-6 p-4 bg-red-50/70 border border-red-100 rounded-2xl flex items-start gap-3 text-sm text-red-800 no-print">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold">Invoice Cancelled</h5>
            <p className="text-red-700/90 mt-0.5">{invoice.cancellation_reason}</p>
          </div>
        </div>
      )} */}

      {/* Standard Browser Presentation Workspace Viewport */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary"><FileText className="w-5 h-5" /></div>
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
                <span className="font-bold text-slate-800">{invoice?.reference_number || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Creation Date</span>
                <span className="font-bold text-slate-800">{invoice?.creation_date || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="font-semibold text-slate-400">Payment Term</span>
                <span className="font-bold text-slate-800">{invoice?.payment_term?.name || '—'}</span>
              </div>
              {invoice?.approval_date && (
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="font-semibold text-slate-400 flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> Approved Date</span>
                  <span className="font-bold text-slate-800">{new Date(invoice.approval_date).toLocaleDateString()}</span>
                </div>
              )}
              {invoice?.payment_date && (
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="font-semibold text-slate-400 flex items-center gap-1.5"><CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" /> Payment Date</span>
                  <span className="font-bold text-slate-800">{new Date(invoice.payment_date).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50"><h3 className="font-bold text-slate-900 text-base">Invoice Line Items</h3></div>
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

          {invoice?.notes && (
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-2">
                <Info className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-slate-900 text-base">Notes / Terms</h3>
              </div>
              <CardContent className="p-6">
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary"><User className="w-5 h-5" /></div>
              <div>
                <h2 className="text-slate-900 font-bold text-base">Customer Details</h2>
                <p className="text-slate-500 text-xs mt-0.5">Target client profile</p>
              </div>
            </div>
            <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
              <div className="flex justify-between items-start py-2 border-b border-slate-50 gap-2">
                <span className="font-medium text-slate-400 shrink-0">Company</span>
                <span className="font-bold text-slate-800 text-right leading-snug">{invoice?.customer?.company_name || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50 gap-2">
                <span className="font-medium text-slate-400 shrink-0">Email</span>
                <span className="font-semibold text-slate-700 text-right truncate">{invoice?.customer?.email || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {invoice?.quotation && (
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary"><FileText className="w-5 h-5" /></div>
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

          <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary"><Layers className="w-5 h-5" /></div>
              <div>
                <h2 className="text-slate-900 font-bold text-base">Financial Summary</h2>
                <p className="text-slate-500 text-xs mt-0.5">Calculated invoice totals</p>
              </div>
            </div>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">
                  {formatAmount(invoice?.financial_summary?.subtotal)} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Total Discount</span>
                <span className="font-semibold text-red-500">
                  -{formatAmount(invoice?.financial_summary?.discount_amount)} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>VAT Amount</span>
                <span className="font-semibold text-slate-700">
                  {formatAmount(invoice?.financial_summary?.vat_amount)} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>
              <div className="border-t border-slate-100 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-base">Grand Total</span>
                <span className="font-extrabold text-primary text-xl">
                  {formatAmount(invoice?.financial_summary?.total_amount)} {invoice?.currency?.code || 'SAR'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* ========================================================================= */}
      {/* HIGH-FIDELITY DESIGN CANVAS (MATCHES THE BRAND DOCUMENT SPECIFICATION)   */}
      {/* ========================================================================= */}
      <div id="printable-invoice-area-wrapper" className="bg-white py-6">
        <div className="max-w-[850px] mx-auto bg-white shadow-md p-12 border border-slate-200 rounded-sm" id="printable-invoice-area" ref={printRef}>
          
          {/* Document Top Header Branding Section */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className='mx-4 flex justify-center items-center'>
                  <img src='/images/LOGO.svg' className='h-22 w-39.25 object-cover' alt="Logo" />
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 space-y-1">
              <h2 className="font-extrabold text-base text-slate-900 tracking-wide">FORSA TRADING & CONTRACTING</h2>
              <p>{companyAddress}</p>
              <p><span className="font-semibold text-slate-700">VAT No:</span> {companyVat}</p>
              <p className="pt-1">📞 {companyPhone} &nbsp;|&nbsp; ✉️ {companyEmail}</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-primary mb-6 tracking-tight">Customer Invoice</h3>

          {/* Cards Meta Sections */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Bill To Info Box */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600 space-y-2">
              <h4 className="text-primary font-bold text-sm mb-2">Bill To</h4>
              <p className="text-slate-900 font-extrabold text-base">{invoice?.customer?.company_name || '—'}</p>
              {invoice?.customer?.email && <p><span className="text-slate-400">Email:</span> {invoice.customer.email}</p>}
              <p>📍 King Abdullah Road, Al Khobar</p>
              <p><span className="text-slate-400">Project:</span> Al Khobar Commercial Complex</p>
            </div>

            {/* Invoice Details Info Box */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
              <h4 className="text-primary font-bold text-sm mb-3">Invoice Details</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Invoice No:</span>
                  <span className="text-slate-900 font-bold">{invoice?.invoice_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date:</span>
                  <span className="text-slate-900 font-bold">{invoice?.creation_date || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Reference No:</span>
                  <span className="text-slate-900 font-bold">{invoice?.reference_number || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Currency:</span>
                  <span className="text-slate-900 font-bold">{invoice?.currency?.code || 'SAR'} ({invoice?.currency?.name || 'Saudi Riyal'})</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Linked Source Agreement:</span>
                <span className="text-slate-900 font-bold">#{invoice?.quotation?.quotation_number || '—'}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Notice Banner Area */}
          {isCancelled && invoice?.cancellation_reason && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs">
              <span className="font-bold">Cancellation Log Reason:</span> {invoice.cancellation_reason}
            </div>
          )}

          {/* Line Items Table Grid Section */}
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-2 w-12 text-center">No.</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-center">Unit</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Discount</th>
                <th className="py-3 px-4 text-right">VAT Amount</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {invoice?.items?.map((item, index) => (
                <tr key={item.id || index} className="align-top">
                  <td className="py-4 px-2 text-center text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block mb-1">{item.item_name || item.item?.name || 'N/A'}</span>
                    {item.item?.name && item.item_name !== item.item?.name && (
                      <span className="text-slate-400 text-[11px] block italic mb-1">{item.item.name}</span>
                    )}
                    {item.sku && <span className="text-slate-400 text-[11px] block">SKU: {item.sku}</span>}
                  </td>
                  <td className="py-4 px-4 text-center font-medium">{formatNumber(item.quantity)}</td>
                  <td className="py-4 px-4 text-center text-slate-500">{item.unit?.name || item.unit_name || ''}</td>
                  <td className="py-4 px-4 text-right font-medium">{formatAmount(item.unit_price)}</td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-600">{Number(item.discount_percentage || 0)}%</td>
                  <td className="py-4 px-4 text-right font-semibold text-slate-600">{formatAmount(item.vat_amount)}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">{formatAmount(item.line_total || item.subtotal || 0)}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">No items available in this invoice.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Summary Calculations Block Box */}
          <div className="flex justify-end mb-10">
            <div className="w-80 space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-500 px-2">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatAmount(invoice?.financial_summary?.subtotal)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>Total Discount</span>
                <span className="font-semibold text-red-500">-{formatAmount(invoice?.financial_summary?.discount_amount)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>VAT Amount</span>
                <span className="font-semibold text-slate-900">{formatAmount(invoice?.financial_summary?.vat_amount)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-900 mt-2">
                <span className="font-bold text-primary text-sm">Grand Total</span>
                <span className="font-black text-base text-primary">{formatAmount(invoice?.financial_summary?.total_amount)} <span className="text-[11px] font-bold">SAR</span></span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 text-[11px] text-slate-500 mb-12">
            <div>
              <h5 className="font-bold text-slate-800 text-xs mb-2">Terms & Conditions</h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Payment is due within the agreed payment timeline terms.</li>
                <li>Please quote invoice number as reference on remittance advice transfers.</li>
                <li>All disputes subject to Riyadh jurisdiction rules.</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-800 text-xs mb-2">Bank Remittance Accounts</h5>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-600">
                <p><span className="text-slate-400">Bank Name:</span> Al Rajhi Bank</p>
                <p><span className="text-slate-400">Account Name:</span> FORSA Trading Est.</p>
                <p><span className="text-slate-400">IBAN:</span> SA56 8000 0000 1234 5678 9012</p>
              </div>
            </div>
          </div>

          {/* Verification Signatures Row Footer */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-700 pt-8 border-t border-slate-100/70">
            <div className="space-y-12">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Received By</p>
            </div>
            <div>
              <div className="border border-red-200 bg-red-50/30 text-primary py-2 px-4 rounded-xl inline-block uppercase tracking-wider text-[10px] font-black">
                Forsa Approved
              </div>
            </div>
            <div className="space-y-12">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Authorized Signature</p>
            </div>
          </div>

        </div>
      </div>

      {/* Action Dialog Components Box */}
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