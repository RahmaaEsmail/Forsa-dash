// // import React, { useState, useEffect } from 'react'
// // import { useNavigate, useParams } from 'react-router-dom'
// // import {
// //   ArrowLeft,
// //   Printer,
// //   ChevronRight,
// //   Save,
// //   Send,
// //   AlertCircle,
// //   Clock,
// //   CheckCircle2,
// //   Package,
// //   CreditCard,
// //   FileText,
// //   XCircle,
// //   Trash2
// // } from 'lucide-react'
// // import { useForm, FormProvider } from 'react-hook-form'
// // import { useQuotationDetails } from '../../hooks/quotations/useQuotationDetails'
// // import { useUpdateQuotationStatus } from '../../hooks/quotations/useUpdateQuotationStatus'
// // import { useDeleteQuotation } from '../../hooks/quotations/useDeleteQuotation'
// // import Loading from '../../components/shared/Loading'
// // import { Button } from '../../components/ui/button'
// // import { Card, CardContent } from '../../components/ui/card'
// // import { Badge } from '../../components/ui/badge'
// // import { DeleteModal } from '../../components/shared/DeleteModal'
// // import { toast } from 'sonner'
// // import { format } from 'date-fns'

// // // Components
// // import QuotationStatusTabs from '../../components/pages/Quotations/QuotationStatusTabs'
// // import PaymentReceivedModal from '../../components/pages/Quotations/PaymentReceivedModal'
// // import CancelQuotationModal from '../../components/pages/Quotations/CancelQuotationModal'
// // import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'

// // export default function QuotationDetails() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const { data: quotationResponse, isLoading } = useQuotationDetails(id);
// //   const updateStatus = useUpdateQuotationStatus();
// //   const deleteQuotation = useDeleteQuotation();
// //   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
// //   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

// //   const quotation = quotationResponse?.data;

// //   const methods = useForm({
// //     defaultValues: {
// //       items: []
// //     }
// //   });

// //   useEffect(() => {
// //     if (quotation) {
// //       methods.reset({
// //         rfq_id: quotation.purchase_request?.id?.toString(),
// //         supplier_id: quotation.supplier?.id?.toString(),
// //         currency_code: quotation.currency?.code,
// //         quotation_date: quotation.quotation_date ? new Date(quotation.quotation_date) : new Date(),
// //         valid_until: quotation.valid_until ? new Date(quotation.valid_until) : new Date(),
// //         payment_days: quotation.payment_days || 0,
// //         delivery_days: quotation.delivery_days || 0,
// //         notes: quotation.notes || "",
// //         items: quotation.items?.map(item => ({
// //           rfq_item_id: item.rfq_item_id,
// //           item_name: item.item_name,
// //           quantity: item.quantity,
// //           cost_price: item.cost_price,
// //           selling_price: item.selling_price,
// //           tax_rate: item.tax_rate,
// //           available: item.available,
// //           unit_name: item.unit_name
// //         })) || []
// //       });
// //     }
// //   }, [quotation, methods]);

// //   const handleStatusAction = (status, body = {}, onSuccess) => {
// //     updateStatus.mutate({ id, status, body }, {
// //       onSuccess: () => {
// //         if (onSuccess) onSuccess();
// //       }
// //     });
// //   };

// //   const handleDelete = () => {
// //     deleteQuotation.mutate(id, {
// //       onSuccess: () => {
// //         navigate('/quotations');
// //       }
// //     });
// //   };

// //   if (isLoading) return <Loading />;

// //   return (
// //     <FormProvider {...methods}>
// //       <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
// //         {/* Breadcrumbs */}
// //         <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
// //           <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/quotations')}>Quotations</span>
// //           <ChevronRight className="w-3 h-3" />
// //           <span className="text-slate-900">Quotation Details</span>
// //         </div>

// //         <div className="flex flex-col gap-6">
// //           <div className="flex justify-between items-start">
// //             <div>
// //               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
// //                  Quotation <span className="text-slate-400 font-normal text-lg">#{quotation?.quotation_number}</span>
// //                  <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2 uppercase text-[10px]">
// //                    {quotation?.status?.replace('_', ' ')}
// //                  </Badge>
// //               </h1>
// //               <p className="text-sm text-slate-500 mt-1">
// //                 Created on {quotation?.created_at ? format(new Date(quotation.created_at), "PPP") : 'N/A'}
// //               </p>
// //             </div>
// //             <div className="flex gap-3">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setIsDeleteModalOpen(true)}
// //                 disabled={deleteQuotation.isPending}
// //                 className="rounded-xl border-red-200 text-primary gap-2 font-bold hover:bg-red-50 h-11 px-6"
// //               >
// //                 <Trash2 className="w-4 h-4" /> Delete
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
// //                 onClick={() => navigate('/quotations')}
// //               >
// //                 <ArrowLeft className="w-4 h-4" /> Back
// //               </Button>
// //               {/* <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6">
// //                 <Printer className="w-4 h-4" /> Print
// //               </Button> */}
// //             </div>
// //           </div>

// //           <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden px-8 py-4">
// //              <QuotationStatusTabs currentStatus={quotation?.status} />
// //           </Card>

// //           {/* Action Bar */}
// //           <div className="flex flex-wrap justify-end items-center gap-3 py-2">
// //             {quotation?.status !== 'cancelled' && quotation?.status !== 'delivered' && (
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setIsCancelModalOpen(true)}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-6 rounded-xl border-red-200 text-primary font-bold hover:bg-red-50 gap-2"
// //               >
// //                 <XCircle className="w-4 h-4" />
// //                 Cancel Quotation
// //               </Button>
// //             )}

// //             {quotation?.status === 'draft' && (
// //               <Button
// //                 onClick={() => handleStatusAction('client-approve')}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
// //               >
// //                 <Send className="w-4 h-4" />
// //                 {updateStatus.isPending ? "Sending..." : "Send to Client"}
// //               </Button>
// //             )}

// //             {quotation?.status === 'client_approval' && (
// //               <Button
// //                 onClick={() => handleStatusAction('manager-approve')}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
// //               >
// //                 <CheckCircle2 className="w-4 h-4" />
// //                 {updateStatus.isPending ? "Approving..." : "Approve as Manager"}
// //               </Button>
// //             )}

// //             {quotation?.status === 'sales_manager_approval' && (
// //               <Button
// //                 onClick={() => handleStatusAction('proforma')}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
// //               >
// //                 <FileText className="w-4 h-4" />
// //                 {updateStatus.isPending ? "Generating..." : "Generate Proforma"}
// //               </Button>
// //             )}

// //             {quotation?.status === 'proforma_invoice' && (
// //               <Button
// //                 onClick={() => setIsPaymentModalOpen(true)}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
// //               >
// //                 <CreditCard className="w-4 h-4" />
// //                 {updateStatus.isPending ? "Processing..." : "Record Payment"}
// //               </Button>
// //             )}

// //             {quotation?.status === 'paid_payment' && (
// //               <Button
// //                 onClick={() => handleStatusAction('deliver')}
// //                 disabled={updateStatus.isPending}
// //                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
// //               >
// //                 <Package className="w-4 h-4" />
// //                 {updateStatus.isPending ? "Marking..." : "Mark as Delivered"}
// //               </Button>
// //             )}

// //             {quotation?.status === 'delivered' && (
// //               <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
// //                 <CheckCircle2 className="w-5 h-5" />
// //                 Completed & Delivered
// //               </div>
// //             )}
// //           </div>

// //           <div className="space-y-6 pointer-events-none opacity-90">
// //              <CreateQuotationForm isReadOnly={true} />
// //           </div>
// //         </div>
// //       </div>

// //       <PaymentReceivedModal
// //         open={isPaymentModalOpen}
// //         onOpenChange={setIsPaymentModalOpen}
// //         isLoading={updateStatus.isPending}
// //         onConfirm={(data) => handleStatusAction('payment-received', data, () => setIsPaymentModalOpen(false))}
// //       />

// //       <CancelQuotationModal
// //         open={isCancelModalOpen}
// //         onOpenChange={setIsCancelModalOpen}
// //         isLoading={updateStatus.isPending}
// //         onConfirm={(data) => handleStatusAction('cancel', data, () => setIsCancelModalOpen(false))}
// //       />

// //       <DeleteModal
// //         open={isDeleteModalOpen}
// //         setOpen={setIsDeleteModalOpen}
// //         title="Delete Quotation"
// //         desc="Are you sure you want to delete this quotation? This action cannot be undone."
// //         isLoading={deleteQuotation.isPending}
// //         isSuccess={deleteQuotation.isSuccess}
// //         onDelete={handleDelete}
// //       />
// //     </FormProvider>
// //   )
// // }

// import React, { useState, useEffect, useRef } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import {
//   ArrowLeft,
//   Printer,
//   ChevronRight,
//   Send,
//   CheckCircle2,
//   Package,
//   CreditCard,
//   FileText,
//   XCircle,
//   Trash2
// } from 'lucide-react'
// import { useForm, FormProvider } from 'react-hook-form'
// import { useQuotationDetails } from '../../hooks/quotations/useQuotationDetails'
// import { useUpdateQuotationStatus } from '../../hooks/quotations/useUpdateQuotationStatus'
// import { useDeleteQuotation } from '../../hooks/quotations/useDeleteQuotation'
// import Loading from '../../components/shared/Loading'
// import { Button } from '../../components/ui/button'
// import { Card, CardContent } from '../../components/ui/card'
// import { Badge } from '../../components/ui/badge'
// import { DeleteModal } from '../../components/shared/DeleteModal'
// import { format } from 'date-fns'

// // Components
// import QuotationStatusTabs from '../../components/pages/Quotations/QuotationStatusTabs'
// import PaymentReceivedModal from '../../components/pages/Quotations/PaymentReceivedModal'
// import CancelQuotationModal from '../../components/pages/Quotations/CancelQuotationModal'
// import MainLogo from '../../components/Layout/Sidebar/MainLogo/MainLogo'

// export default function QuotationDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const printRef = useRef(null);

//   const { data: quotationResponse, isLoading } = useQuotationDetails(id);
//   const updateStatus = useUpdateQuotationStatus();
//   const deleteQuotation = useDeleteQuotation();
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const quotation = quotationResponse?.data;

//   const methods = useForm({
//     defaultValues: { items: [] }
//   });

//   useEffect(() => {
//     if (quotation) {
//       methods.reset({
//         rfq_id: quotation.purchase_request?.id?.toString(),
//         items: quotation.items || []
//       });
//     }
//   }, [quotation, methods]);

//   const handleStatusAction = (status, body = {}, onSuccess) => {
//     updateStatus.mutate({ id, status, body }, {
//       onSuccess: () => { if (onSuccess) onSuccess(); }
//     });
//   };

//   const handleDelete = () => {
//     deleteQuotation.mutate(id, {
//       onSuccess: () => { navigate('/quotations'); }
//     });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   if (isLoading) return <Loading />;

//   // Formatting numeric strings securely
//   const formatAmount = (val) => parseFloat(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//   return (
//     <FormProvider {...methods}>
//       {/* GLOBAL CSS PRINT OVERRIDES FOR EXACT MATCH */}
//       {/* GLOBAL CSS PRINT OVERRIDES FOR EXACT MATCH */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//   @media print {
//     /* Hide absolutely everything on the page by default */
//     body > * {
//       display: none !important;
//     }

//     /* Ensure the main React root elements aren't blocking display layout passes */
//     #root, html, body {
//       background: white !important;
//       margin: 0 !important;
//       padding: 0 !important;
//       height: auto !important;
//     }

//     /* Force show ONLY our target container and inject it cleanly into the layout root */
//     #printable-quotation-area-wrapper {
//       display: block !important;
//       position: absolute;
//       left: 0;
//       top: 0;
//       width: 100%;
//     }

//     #printable-quotation-area {
//       background: white !important;
//       padding: 0px !important;
//       margin: 0px !important;
//       box-shadow: none !important;
//       border: none !important;
//     }

//     @page {
//       size: A4;
//       margin: 15mm 10mm 15mm 10mm;
//     }

//     .no-print {
//       display: none !important;
//     }
//   }
// `}} />

//       <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 no-print">
//         {/* Breadcrumbs */}
//         <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
//           <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/quotations')}>Quotations</span>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-slate-900">Quotation Details</span>
//         </div>

//         <div className="flex flex-col gap-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
//                 Quotation <span className="text-slate-400 font-normal text-lg">#{quotation?.quotation_number}</span>
//                 <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2 uppercase text-[10px]">
//                   {quotation?.status?.replace('_', ' ')}
//                 </Badge>
//               </h1>
//               <p className="text-sm text-slate-500 mt-1">
//                 Created on {quotation?.quotation_date ? format(new Date(quotation.quotation_date), "PPP") : 'N/A'}
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <Button
//                 variant="outline"
//                 onClick={handlePrint}
//                 className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
//               >
//                 <Printer className="w-4 h-4" /> Download/Print PDF
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsDeleteModalOpen(true)}
//                 disabled={deleteQuotation.isPending}
//                 className="rounded-xl border-red-200 text-primary gap-2 font-bold hover:bg-red-50 h-11 px-6"
//               >
//                 <Trash2 className="w-4 h-4" /> Delete
//               </Button>
//               <Button
//                 variant="outline"
//                 className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
//                 onClick={() => navigate('/quotations')}
//               >
//                 <ArrowLeft className="w-4 h-4" /> Back
//               </Button>
//             </div>
//           </div>

//           <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden px-8 py-4">
//             <QuotationStatusTabs currentStatus={quotation?.status} />
//           </Card>

//           {/* Action Bar */}
//           <div className="flex flex-wrap justify-end items-center gap-3 py-2">
//             {quotation?.status !== 'cancelled' && quotation?.status !== 'delivered' && (
//               <Button
//                 variant="outline"
//                 onClick={() => setIsCancelModalOpen(true)}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-6 rounded-xl border-red-200 text-primary font-bold hover:bg-red-50 gap-2"
//               >
//                 <XCircle className="w-4 h-4" /> Cancel Quotation
//               </Button>
//             )}

//             {quotation?.status === 'draft' && (
//               <Button
//                 onClick={() => handleStatusAction('client-approve')}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//               >
//                 <Send className="w-4 h-4" />
//                 {updateStatus.isPending ? "Sending..." : "Send to Client"}
//               </Button>
//             )}

//             {quotation?.status === 'client_approval' && (
//               <Button
//                 onClick={() => handleStatusAction('manager-approve')}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//               >
//                 <CheckCircle2 className="w-4 h-4" />
//                 {updateStatus.isPending ? "Approving..." : "Approve as Manager"}
//               </Button>
//             )}

//             {quotation?.status === 'sales_manager_approval' && (
//               <Button
//                 onClick={() => handleStatusAction('proforma')}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//               >
//                 <FileText className="w-4 h-4" />
//                 {updateStatus.isPending ? "Generating..." : "Generate Proforma"}
//               </Button>
//             )}

//             {quotation?.status === 'proforma_invoice' && (
//               <Button
//                 onClick={() => setIsPaymentModalOpen(true)}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//               >
//                 <CreditCard className="w-4 h-4" />
//                 {updateStatus.isPending ? "Processing..." : "Record Payment"}
//               </Button>
//             )}

//             {quotation?.status === 'paid_payment' && (
//               <Button
//                 onClick={() => handleStatusAction('deliver')}
//                 disabled={updateStatus.isPending}
//                 className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//               >
//                 <Package className="w-4 h-4" />
//                 {updateStatus.isPending ? "Marking..." : "Mark as Delivered"}
//               </Button>
//             )}

//             {quotation?.status === 'delivered' && (
//               <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
//                 <CheckCircle2 className="w-5 h-5" /> Completed & Delivered
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* DYNAMIC HIGH-FIDELITY QUOTATION DESIGN (MATCHES THE IMAGE LAYOUT) */}
//       <div className="bg-slate-50 py-6 no-print">
//         <div className="max-w-[850px] mx-auto bg-white shadow-md p-12 border border-slate-200 rounded-sm" id="printable-quotation-area" ref={printRef}>

//           {/* Header Section */}
//           <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
//             <div>
//               {/* Fallback stylized logo text using branding typography */}
//               <div className="flex items-center gap-2 mb-2">
//                 <div className='mx-8.75 flex justify-center items-center'>
//                   <img src='/images/LOGO.svg' className='h-22 w-39.25 object-cover' />
//                 </div>
//                 {/* <div className="text-primary font-bold text-3xl tracking-tight font-serif">فرصة</div>
//                 <div className="text-slate-800 font-black text-2xl tracking-wide">FORSA</div> */}
//               </div>
//             </div>
//             <div className="text-right text-xs text-slate-500 space-y-1">
//               <h2 className="font-extrabold text-base text-slate-900 tracking-wide">FORSA TRADING & CONTRACTING</h2>
//               <p>King Fahd Road, Olaya District, Riyadh 12211</p>
//               <p><span className="font-semibold text-slate-700">VAT No:</span> 300123456700003</p>
//               <p className="pt-1">📞 +966 55 598 0730 &nbsp;|&nbsp; ✉️ Sales@forsageneraltrading.com</p>
//             </div>
//           </div>

//           <h3 className="text-2xl font-bold text-primary mb-6 tracking-tight">Quotation</h3>

//           {/* Cards Meta Section */}
//           <div className="grid grid-cols-2 gap-6 mb-8">
//             {/* Bill To */}
//             <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600 space-y-2">
//               <h4 className="text-primary font-bold text-sm mb-2">Bill To</h4>
//               <p className="text-slate-900 font-extrabold text-base">{quotation?.customer?.company_name || 'ABC Construction Co.'}</p>
//               <p>📍 King Abdullah Road, Al Khobar</p>
//               <p><span className="text-slate-400">Project:</span> Al Khobar Commercial Complex</p>
//               <p><span className="text-slate-400">Vendor:</span> Eng. Ahmed Al-Sayed</p>
//             </div>

//             {/* Quote Details */}
//             <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
//               <h4 className="text-primary font-bold text-sm mb-3">Quote Details</h4>
//               <div className="grid grid-cols-2 gap-y-3">
//                 <div>
//                   <span className="text-slate-400 block mb-0.5">Quotation No:</span>
//                   <span className="text-slate-900 font-bold">{quotation?.quotation_number}</span>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block mb-0.5">Date:</span>
//                   <span className="text-slate-900 font-bold">{quotation?.quotation_date ? format(new Date(quotation.quotation_date), "dd/MM/yyyy") : 'N/A'}</span>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block mb-0.5">Validity:</span>
//                   <span className="text-slate-900 font-bold">15 Days</span>
//                 </div>
//                 <div>
//                   <span className="text-slate-400 block mb-0.5">Currency:</span>
//                   <span className="text-slate-900 font-bold">{quotation?.currency?.code || 'SAR'} ({quotation?.currency?.name || 'Saudi Riyal'})</span>
//                 </div>
//               </div>
//               <div className="mt-3 pt-3 border-t border-slate-200/60">
//                 <span className="text-slate-400 block mb-0.5">Payment Terms:</span>
//                 <span className="text-slate-900 font-medium">50% Advance, 50% on Delivery</span>
//               </div>
//             </div>
//           </div>

//           {/* Line Items Table Container */}
//           <table className="w-full text-left border-collapse mb-6">
//             <thead>
//               <tr className="border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
//                 <th className="py-3 px-2 w-12 text-center">No.</th>
//                 <th className="py-3 px-4">Description</th>
//                 <th className="py-3 px-4 text-center">Qty</th>
//                 <th className="py-3 px-4 text-center">Unit</th>
//                 <th className="py-3 px-4 text-right">Unit Price</th>
//                 <th className="py-3 px-4 text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
//               {quotation?.items?.map((item, index) => (
//                 <tr key={item.id || index} className="align-top">
//                   <td className="py-4 px-2 text-center text-slate-400 font-medium">{index + 1}</td>
//                   <td className="py-4 px-4">
//                     <span className="font-bold text-slate-900 block mb-1">{item.item_name || 'Steel Rebar'}</span>
//                     <span className="text-slate-400 text-[11px] block italic">{item.item?.name || 'حديد تسليح'}</span>
//                   </td>
//                   <td className="py-4 px-4 text-center font-medium">{parseInt(item.quantity)}</td>
//                   <td className="py-4 px-4 text-center text-slate-500">{item.unit?.name || 'Pcs'}</td>
//                   <td className="py-4 px-4 text-right font-medium">{formatAmount(item.selling_price)}</td>
//                   <td className="py-4 px-4 text-right font-bold text-slate-900">{formatAmount(item.line_total)}</td>
//                 </tr>
//               )) || (
//                   <tr>
//                     <td colSpan="6" className="py-8 text-center text-slate-400">No items available in this quotation.</td>
//                   </tr>
//                 )}
//             </tbody>
//           </table>

//           {/* Totals Box Layout */}
//           <div className="flex justify-end mb-10">
//             <div className="w-80 space-y-2 text-xs border-t border-slate-100 pt-4">
//               <div className="flex justify-between text-slate-500 px-2">
//                 <span>Subtotal</span>
//                 <span className="font-semibold text-slate-900">{formatAmount(quotation?.subtotal)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
//               </div>
//               <div className="flex justify-between text-slate-500 px-2">
//                 <span>VAT (15%)</span>
//                 <span className="font-semibold text-slate-900">{formatAmount(quotation?.tax_amount)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
//               </div>
//               <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-900 mt-2">
//                 <span className="font-bold text-primary text-sm">Grand Total</span>
//                 <span className="font-black text-base text-primary">{formatAmount(quotation?.total_amount)} <span className="text-[11px] font-bold">SAR</span></span>
//               </div>
//             </div>
//           </div>

//           {/* Terms & Bank Details */}
//           <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 text-[11px] text-slate-500 mb-12">
//             <div>
//               <h5 className="font-bold text-slate-800 text-xs mb-2">Terms & Conditions</h5>
//               <ul className="list-disc pl-4 space-y-1 text-slate-500">
//                 <li>Prices are valid for 15 Days from the date of quotation.</li>
//                 <li>Delivery within 3-5 working days from PO confirmation.</li>
//                 <li>Goods once sold cannot be returned unless manufacturing defect.</li>
//                 <li>All disputes subject to Riyadh jurisdiction.</li>
//               </ul>
//             </div>
//             <div>
//               <h5 className="font-bold text-slate-800 text-xs mb-2">Bank Details</h5>
//               <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-600">
//                 <p><span className="text-slate-400">Bank Name:</span> Al Rajhi Bank</p>
//                 <p><span className="text-slate-400">Account Name:</span> FORSA Trading Est.</p>
//                 <p><span className="text-slate-400">IBAN:</span> SA56 8000 0000 1234 5678 9012</p>
//               </div>
//             </div>
//           </div>

//           {/* Signatures Layout */}
//           <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-700 pt-8 border-t border-slate-100/70">
//             <div className="space-y-12">
//               <div className="h-px bg-slate-200 mx-4"></div>
//               <p>Received By</p>
//             </div>
//             <div>
//               <div className="border border-red-200 bg-red-50/30 text-primary py-2 px-4 rounded-xl inline-block uppercase tracking-wider text-[10px] font-black">
//                 Forsa Approved
//               </div>
//             </div>
//             <div className="space-y-12">
//               <div className="h-px bg-slate-200 mx-4"></div>
//               <p>Authorized Signature</p>
//             </div>
//           </div>

//           {/* Footer Branding Line */}
//           {/* <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-8 mt-12">
//             <span>Thank you for your business!</span>
//             <span>🌐 www.forsa-sa.com</span>
//             <span>✉️ sales@forsa-sa.com</span>
//           </div> */}

//         </div>
//       </div>

//       {/* Modals Management Container */}
//       <PaymentReceivedModal
//         open={isPaymentModalOpen}
//         onOpenChange={setIsPaymentModalOpen}
//         isLoading={updateStatus.isPending}
//         onConfirm={(data) => handleStatusAction('payment-received', data, () => setIsPaymentModalOpen(false))}
//       />

//       <CancelQuotationModal
//         open={isCancelModalOpen}
//         onOpenChange={setIsCancelModalOpen}
//         isLoading={updateStatus.isPending}
//         onConfirm={(data) => handleStatusAction('cancel', data, () => setIsCancelModalOpen(false))}
//       />

//       <DeleteModal
//         open={isDeleteModalOpen}
//         setOpen={setIsDeleteModalOpen}
//         title="Delete Quotation"
//         desc="Are you sure you want to delete this quotation? This action cannot be undone."
//         isLoading={deleteQuotation.isPending}
//         isSuccess={deleteQuotation.isSuccess}
//         onDelete={handleDelete}
//       />
//     </FormProvider>
//   )
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Download,
  ChevronRight,
  Send,
  CheckCircle2,
  Package,
  CreditCard,
  FileText,
  XCircle,
  Trash2,
  Truck,
  Undo,
} from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useQuotationDetails } from "../../hooks/quotations/useQuotationDetails";
import { useUpdateQuotationStatus } from "../../hooks/quotations/useUpdateQuotationStatus";
import { useDeleteQuotation } from "../../hooks/quotations/useDeleteQuotation";
import Loading from "../../components/shared/Loading";
import { Button } from "../../components/ui/button";
import useListSettings from "../../hooks/Settings/useListSettings";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { DeleteModal } from "../../components/shared/DeleteModal";
import { downloadAsPDF } from "../../utils/downloadPDF";
import { format } from "date-fns";
import { pdf } from "@react-pdf/renderer";
import { QuotationPDF, DownloadQuotationButton } from "./QuotationPDF";

// Components
import QuotationStatusTabs from "../../components/pages/Quotations/QuotationStatusTabs";
import PaymentReceivedModal from "../../components/pages/Quotations/PaymentReceivedModal";
import CancelQuotationModal from "../../components/pages/Quotations/CancelQuotationModal";

import usePermission from "../../hooks/usePermission";

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const printRef = useRef(null);
  const { hasPermission } = usePermission();

  const { data: quotationResponse, isLoading } = useQuotationDetails(id);
  const updateStatus = useUpdateQuotationStatus();
  const deleteQuotation = useDeleteQuotation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shouldDownloadPDF, setShouldDownloadPDF] = useState(false);

  const { data: settingsData } = useListSettings();
  const getSetting = (key) => {
    const val = settingsData?.data?.find((s) => s.key === key)?.value;
    return val === "null" || !val ? null : val;
  };

  const companyPhone =
    getSetting("phone") || getSetting("company_phone") || "+966 55 598 0730";
  const companyEmail =
    getSetting("email") ||
    getSetting("company_email") ||
    "Sales@forsageneraltrading.com";
  const companyVat =
    getSetting("vat") ||
    getSetting("vat_number") ||
    getSetting("company_tax_number") ||
    "300123456700003";
  const companyAddress =
    getSetting("address") || getSetting("company_address") || "Cairo, Egypt";
  const companyName =
    getSetting("company_name") ||
    getSetting("name") ||
    "BRKZ International Information Technology Company | شركة بي ار كيه زد العالمية لتقنية المعلومات";
  const companyCrn =
    getSetting("company_crn") ||
    getSetting("crn") ||
    getSetting("company_registration_number") ||
    getSetting("commercial_register") ||
    "311411370400003";

  const getSettingFileUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value;
    return `https://api.forsa.cloud/${value.replace(/^\//, "")}`;
  };

  const bankOneName =
    getSetting("bank_one_name") ||
    "Saudi National Bank | البنك الأهلي السعودي (SNB)";
  const bankOneHolder =
    getSetting("bank_one_account_holder") ||
    "Company B.R.K.Z. Alalamiyyah for Information Technology";
  const bankOneIban = getSetting("bank_one_iban") || "SA6610000020000000249108";
  const bankOneImage = getSetting("bank_one_image")
    ? getSettingFileUrl(getSetting("bank_one_image"))
    : "/images/snb-logo.png";

  const bankTwoName =
    getSetting("bank_two_name") || "Alrajhi Bank | مصرف الراجحي";
  const bankTwoHolder = getSetting("bank_two_account_holder") || "BRKZ IT CO";
  const bankTwoIban = getSetting("bank_two_iban") || "SA8380000611608010256585";
  const bankTwoImage = getSetting("bank_two_image")
    ? getSettingFileUrl(getSetting("bank_two_image"))
    : "/images/alrajhi-logo.png";

  const termsAndConditionsText =
    getSetting("rfq_terms_and_conditions") ||
    getSetting("terms_and_conditions");

  const quotation = quotationResponse?.data;
  const rfqId = quotation?.purchase_request?.id;
  const rfqNumber =
    quotation?.purchase_request?.display_number ||
    quotation?.purchase_request?.rfq_number;
  const prId =
    quotation?.purchase_request?.id ||
    quotation?.purchase_request?.purchase_request_id ||
    quotation?.purchase_request?.purchase_request?.id;
  const prNumber =
    quotation?.purchase_request?.pr_number ||
    quotation?.purchase_request?.purchase_request?.pr_number;

  const methods = useForm({
    defaultValues: { items: [] },
  });

  useEffect(() => {
    if (quotation) {
      methods.reset({
        rfq_id: quotation.purchase_request?.id?.toString(),
        items: quotation.items || [],
      });
    }
  }, [quotation, methods]);

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

  const handleDelete = () => {
    deleteQuotation.mutate(id, {
      onSuccess: () => {
        navigate("/quotations");
      },
    });
  };

  const isProforma = ["proforma_invoice", "paid_payment", "delivered"].includes(
    quotation?.status,
  );
  const baseNumber = quotation?.quotation_number || "";
  const number = isProforma
    ? baseNumber.replace(/^(QUO|QUC)-?/, "PI-")
    : baseNumber;
  const documentTitle = isProforma ? "Proforma Invoice" : "Quotation";

  const handlePrint = () => {
    const originalTitle = document.title;
    const documentName = number || id;
    document.title = documentName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  const handleDownloadPDF = async (customIsProforma = null) => {
    const isProf = customIsProforma !== null 
      ? customIsProforma 
      : isProforma;

    const doc = (
      <QuotationPDF
        quotation={quotation}
        isProforma={isProf}
        settings={settingsData}
      />
    );
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const computedNumber = isProf
      ? baseNumber.replace(/^(QUO|QUC)-?/, "PI-")
      : baseNumber;
    const formattedName = computedNumber.startsWith("PI-")
      ? computedNumber.replace(/^PI-/, "PI_")
      : computedNumber;
    link.download = `${formattedName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (shouldDownloadPDF && quotation?.status === "proforma_invoice") {
      setShouldDownloadPDF(false);
      setTimeout(() => {
        handleDownloadPDF();
      }, 500);
    }
  }, [quotation?.status, shouldDownloadPDF]);

  useEffect(() => {
    if (searchParams.get("download") === "true" && !isLoading && quotation) {
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, quotation, searchParams]);

  if (isLoading) return <Loading />;

  // Formatting numeric strings securely
  const formatAmount = (val) =>
    parseFloat(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <FormProvider {...methods}>
      {/* GLOBAL CSS PRINT OVERRIDES FOR EXACT MATCH */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          
          #printable-quotation-area-wrapper { 
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-quotation-area-wrapper * { visibility: visible !important; }
          
          @page { size: A4; margin: 0 0 170px 0; padding: 0; }

          #printable-quotation-area {
            border: none !important;
            box-shadow: none !important;
            padding: 48px !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            margin-bottom: 0 !important;
            padding-bottom: 20px !important;
          }

          .print-footer {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px 0 !important;
            background-color: #C94544 !important;
            z-index: 9999 !important;
          }
        }
      `,
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 no-print">
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
          <span className="text-slate-900">{documentTitle} Details</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {documentTitle}{" "}
                <span className="text-slate-400 font-normal text-lg">
                  #{number}
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
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Created on{" "}
                {quotation?.quotation_date
                  ? format(new Date(quotation.quotation_date), "PPP")
                  : "N/A"}
              </p>
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
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              {/* Action Buttons */}
              {quotation?.status !== "draft" &&
                hasPermission("edit_quotations") && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusAction("step-back")}
                    disabled={updateStatus.isPending}
                    className="rounded-xl border-amber-200 text-amber-700 font-bold hover:bg-amber-50 h-11 px-6 gap-2"
                  >
                    <Undo className="w-4 h-4" /> Step Back
                  </Button>
                )}

              {quotation?.status !== "cancelled" &&
                quotation?.status !== "delivered" &&
                hasPermission("edit_quotations") && (
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelModalOpen(true)}
                    disabled={updateStatus.isPending}
                    className="rounded-xl border-red-200 text-primary font-bold hover:bg-red-50 h-11 px-6 gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </Button>
                )}

              {quotation?.status === "draft" &&
                hasPermission("edit_quotations") && (
                  <Button
                    onClick={() => handleStatusAction("manager-approve")}
                    disabled={updateStatus.isPending}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-11 px-6"
                  >
                    <Send className="w-4 h-4" />
                    {updateStatus.isPending ? "Sending..." : "Send to Manager"}
                  </Button>
                )}

              {quotation?.status === "sales_manager_approval" &&
                hasPermission("edit_quotations") && (
                  <Button
                    onClick={() => handleStatusAction("client-approve")}
                    disabled={updateStatus.isPending}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-11 px-6"
                  >
                    <Send className="w-4 h-4" />
                    {updateStatus.isPending ? "Sending..." : "Send to Client"}
                  </Button>
                )}

              {quotation?.status === "client_approval" &&
                hasPermission("edit_quotations") && (
                  <Button
                    onClick={() =>
                      handleStatusAction("proforma_invoice", {}, () =>
                        setShouldDownloadPDF(true),
                      )
                    }
                    disabled={updateStatus.isPending}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-11 px-6"
                  >
                    <FileText className="w-4 h-4" />
                    {updateStatus.isPending
                      ? "Generating..."
                      : "Generate Proforma"}
                  </Button>
                )}

              {quotation?.status === "proforma_invoice" &&
                hasPermission("edit_quotations") && (
                  <Button
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={updateStatus.isPending}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-11 px-6"
                  >
                    <CreditCard className="w-4 h-4" />
                    {updateStatus.isPending
                      ? "Processing..."
                      : "Record Payment"}
                  </Button>
                )}

              {quotation?.status === "paid_payment" &&
                hasPermission("edit_quotations") && (
                  <Button
                    onClick={() => handleStatusAction("deliver")}
                    disabled={updateStatus.isPending}
                    className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 h-11 px-6"
                  >
                    <Package className="w-4 h-4" />
                    {updateStatus.isPending
                      ? "Marking..."
                      : "Mark as Delivered"}
                  </Button>
                )}

              {["proforma_invoice", "paid_payment", "delivered"].includes(
                quotation?.status,
              ) ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF(true)}
                    className="rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 h-11 px-6 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4 text-slate-500" /> Download
                    Proforma
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF(false)}
                    className="rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 h-11 px-6 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4 text-slate-500" /> Download
                    Quotation
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(null)}
                  className="rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 h-11 px-6 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-slate-500" /> Download PDF
                </Button>
              )}
              {hasPermission("delete_quotations") && (
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleteQuotation.isPending}
                  className="rounded-xl border-red-200 text-primary gap-2 font-bold hover:bg-red-50 h-11 px-6"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
                onClick={() => navigate("/quotations")}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </div>
          </div>

          <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden px-8 py-4">
            <QuotationStatusTabs currentStatus={quotation?.status} />
          </Card>
        </div>
      </div>

      {/* DYNAMIC HIGH-FIDELITY QUOTATION DESIGN WITH CORRECT ID WRAPPER STRATEGY */}
      <div id="printable-quotation-area-wrapper" className="bg-white py-6">
        <div
          className="max-w-[850px] mx-auto bg-white shadow-md p-12 border border-slate-200 rounded-sm"
          id="printable-quotation-area"
          ref={printRef}
        >
          {/* Header Section */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mx-8.75 flex justify-center items-center">
                  <img
                    src="/images/LOGO.svg"
                    className="h-22 w-39.25 object-cover"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 space-y-1">
              <h2 className="font-extrabold text-[11px] text-slate-900 tracking-wide">
                {companyName}
              </h2>
              <p>
                {companyAddress} | VAT: {companyVat}
              </p>
              <p className="pt-1">
                📞 {companyPhone} &nbsp;|&nbsp; ✉️ {companyEmail}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-primary mb-6 tracking-tight">
            {documentTitle}
          </h3>

          {/* Cards Meta Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Bill To */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600 space-y-2">
              <h4 className="text-primary font-bold text-sm mb-2">Bill To</h4>
              <p className="text-slate-900 font-extrabold text-base">
                {quotation?.customer?.company_name || "ABC Construction Co."}
              </p>
              <p>📍 King Abdullah Road, Al Khobar</p>
              <p>
                <span className="text-slate-400">Project:</span> Al Khobar
                Commercial Complex
              </p>
              <p>
                <span className="text-slate-400">Vendor:</span> Eng. Ahmed
                Al-Sayed
              </p>
            </div>

            {/* Quote Details */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
              <h4 className="text-primary font-bold text-sm mb-3">
                {isProforma ? "Invoice Details" : "Quote Details"}
              </h4>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">
                    {isProforma ? "Proforma Invoice No:" : "Quotation No:"}
                  </span>
                  <span className="text-slate-900 font-bold">{number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date:</span>
                  <span className="text-slate-900 font-bold">
                    {quotation?.quotation_date
                      ? format(new Date(quotation.quotation_date), "dd/MM/yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Validity:</span>
                  <span className="text-slate-900 font-bold">15 Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Currency:</span>
                  <span className="text-slate-900 font-bold">
                    {quotation?.currency?.code || "SAR"} (
                    {quotation?.currency?.name || "Saudi Riyal"})
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">
                  Payment Terms:
                </span>
                <span className="text-slate-900 font-medium">
                  50% Advance, 50% on Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table Container */}
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-2 w-12 text-center">No.</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-center">Unit</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {quotation?.items?.map((item, index) => (
                <tr key={item.id || index} className="align-top">
                  <td className="py-4 px-2 text-center text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block mb-1">
                      {item.item_name || "Steel Rebar"}
                    </span>
                    <span className="text-slate-400 text-[11px] block italic">
                      {item.item?.name || "حديد تسليح"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-medium">
                    {parseInt(item.quantity)}
                  </td>
                  <td className="py-4 px-4 text-center text-slate-500">
                    {item.unit?.name || "Pcs"}
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    {formatAmount(item.selling_price)}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">
                    {formatAmount(item.line_total)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No items available in this quotation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Box Layout */}
          <div className="flex justify-end mb-10">
            <div className="w-80 space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-500 px-2">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatAmount(quotation?.subtotal)}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    SAR
                  </span>
                </span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>VAT (15%)</span>
                <span className="font-semibold text-slate-900">
                  {formatAmount(quotation?.tax_amount)}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    SAR
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-900 mt-2">
                <span className="font-bold text-primary text-sm">
                  Grand Total
                </span>
                <span className="font-black text-base text-primary">
                  {formatAmount(quotation?.total_amount)}{" "}
                  <span className="text-[11px] font-bold">SAR</span>
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t border-slate-100 pt-6 text-[11px] text-slate-500 mb-6">
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2 text-slate-600">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Terms & Conditions
              </h5>
              {termsAndConditionsText ? (
                <div className="text-[10px] leading-relaxed text-slate-500 font-medium whitespace-pre-line">
                  {termsAndConditionsText}
                </div>
              ) : (
                <ul className="list-disc pl-4 space-y-1 text-[10px] leading-relaxed text-slate-500 font-medium">
                  <li>
                    Prices are valid for 15 Days from the date of quotation.
                  </li>
                  <li>
                    Delivery within 3-5 working days from PO confirmation.
                  </li>
                  <li>
                    Goods once sold cannot be returned unless manufacturing
                    defect.
                  </li>
                  <li>All disputes subject to Riyadh jurisdiction.</li>
                </ul>
              )}
            </div>
          </div>

          {/* Signatures Layout */}
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

          {/* Full-width Teal Footer Banner */}
          <div className="print-footer bg-[#C94544] text-white text-center py-2.5 mt-8 mx-[-48px] mb-[-48px] text-[10px] space-y-2 font-bold leading-normal">
            {/* Bank Transfer Details */}
            <div className="px-8 text-left">
              <p className="text-[10px] font-black uppercase text-center tracking-wide text-white/95 mb-2">
                For bank transfer process please use one of the following bank
                accounts
              </p>
              <div className="grid grid-cols-2 gap-4 text-[9px] font-medium leading-relaxed opacity-95">
                {/* Bank 1 */}
                {(bankOneName || bankOneIban) && (
                  <div className="bg-white/10 p-2.5 rounded-lg border border-white/15 flex items-center gap-3">
                    {bankOneImage && (
                      <img
                        src={bankOneImage}
                        alt="Bank 1 Logo"
                        className="w-10 h-10 object-contain bg-white p-1 rounded shrink-0"
                      />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-extrabold text-white text-[10px] truncate">
                        {bankOneName}
                      </p>
                      <p className="truncate">
                        <span className="text-white/60">Name:</span>{" "}
                        {bankOneHolder}
                      </p>
                      <p className="font-bold truncate">
                        <span className="text-white/60 font-normal">IBAN:</span>{" "}
                        {bankOneIban}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank 2 */}
                {(bankTwoName || bankTwoIban) && (
                  <div className="bg-white/10 p-2.5 rounded-lg border border-white/15 flex items-center gap-3">
                    {bankTwoImage && (
                      <img
                        src={bankTwoImage}
                        alt="Bank 2 Logo"
                        className="w-10 h-10 object-contain bg-white p-1 rounded shrink-0"
                      />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-extrabold text-white text-[10px] truncate">
                        {bankTwoName}
                      </p>
                      <p className="truncate">
                        <span className="text-white/60">Name:</span>{" "}
                        {bankTwoHolder}
                      </p>
                      <p className="font-bold truncate">
                        <span className="text-white/60 font-normal">IBAN:</span>{" "}
                        {bankTwoIban}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Divider line */}
            <div className="border-t border-white/15 mx-6"></div>

            <div className="space-y-1">
              <p>{companyName}</p>
              <p className="opacity-90 font-normal text-[9px]">
                VAT No. {companyVat} &nbsp;&nbsp;&nbsp;&nbsp; CRN. {companyCrn}
              </p>
            </div>
          </div>
        </div>
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
  );
}
