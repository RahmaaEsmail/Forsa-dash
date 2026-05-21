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

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Printer, 
  ChevronRight,
  Send,
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
import useListSettings from '../../hooks/Settings/useListSettings'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { DeleteModal } from '../../components/shared/DeleteModal'
import { format } from 'date-fns'

// Components
import QuotationStatusTabs from '../../components/pages/Quotations/QuotationStatusTabs'
import PaymentReceivedModal from '../../components/pages/Quotations/PaymentReceivedModal'
import CancelQuotationModal from '../../components/pages/Quotations/CancelQuotationModal'

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  
  const { data: quotationResponse, isLoading } = useQuotationDetails(id);
  const updateStatus = useUpdateQuotationStatus();
  const deleteQuotation = useDeleteQuotation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: settingsData } = useListSettings();
  const getSetting = (key) => settingsData?.data?.find(s => s.key === key)?.value;

  const companyPhone = getSetting('phone') || getSetting('company_phone') || '+966 55 598 0730';
  const companyEmail = getSetting('email') || getSetting('company_email') || 'Sales@forsageneraltrading.com';
  const companyVat = getSetting('vat') || getSetting('vat_number') || '300123456700003';
  const companyAddress = getSetting('address') || getSetting('company_address') || 'King Fahd Road, Olaya District, Riyadh 12211';

  const quotation = quotationResponse?.data;

  const methods = useForm({
    defaultValues: { items: [] }
  });

  useEffect(() => {
    if (quotation) {
      methods.reset({
        rfq_id: quotation.purchase_request?.id?.toString(),
        items: quotation.items || []
      });
    }
  }, [quotation, methods]);

  const handleStatusAction = (status, body = {}, onSuccess) => {
    updateStatus.mutate({ id, status, body }, {
      onSuccess: () => { if (onSuccess) onSuccess(); }
    });
  };

  const handleDelete = () => {
    deleteQuotation.mutate(id, {
      onSuccess: () => { navigate('/quotations'); }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loading />;

  // Formatting numeric strings securely
  const formatAmount = (val) => parseFloat(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <FormProvider {...methods}>
      {/* GLOBAL CSS PRINT OVERRIDES FOR EXACT MATCH */}
      <style dangerouslySetInnerHTML={{__html: `
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
          
          @page { size: A4; margin: 15mm 10mm 15mm 10mm; }
        }
      `}} />

      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 no-print">
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
                Created on {quotation?.quotation_date ? format(new Date(quotation.quotation_date), "PPP") : 'N/A'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 h-11 px-6"
              >
                <Printer className="w-4 h-4" /> Download/Print PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleteQuotation.isPending}
                className="rounded-xl border-red-200 text-primary gap-2 font-bold hover:bg-red-50 h-11 px-6"
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
                className="h-11 px-6 rounded-xl border-red-200 text-primary font-bold hover:bg-red-50 gap-2"
              >
                <XCircle className="w-4 h-4" /> Cancel Quotation
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
                <CheckCircle2 className="w-5 h-5" /> Completed & Delivered
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DYNAMIC HIGH-FIDELITY QUOTATION DESIGN WITH CORRECT ID WRAPPER STRATEGY */}
      <div id="printable-quotation-area-wrapper" className="bg-white py-6">
        <div className="max-w-[850px] mx-auto bg-white shadow-md p-12 border border-slate-200 rounded-sm" id="printable-quotation-area" ref={printRef}>
          
          {/* Header Section */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className='mx-8.75 flex justify-center items-center'>
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

          <h3 className="text-2xl font-bold text-primary mb-6 tracking-tight">Quotation</h3>

          {/* Cards Meta Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Bill To */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600 space-y-2">
              <h4 className="text-primary font-bold text-sm mb-2">Bill To</h4>
              <p className="text-slate-900 font-extrabold text-base">{quotation?.customer?.company_name || 'ABC Construction Co.'}</p>
              <p>📍 King Abdullah Road, Al Khobar</p>
              <p><span className="text-slate-400">Project:</span> Al Khobar Commercial Complex</p>
              <p><span className="text-slate-400">Vendor:</span> Eng. Ahmed Al-Sayed</p>
            </div>

            {/* Quote Details */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
              <h4 className="text-primary font-bold text-sm mb-3">Quote Details</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Quotation No:</span>
                  <span className="text-slate-900 font-bold">{quotation?.quotation_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date:</span>
                  <span className="text-slate-900 font-bold">{quotation?.quotation_date ? format(new Date(quotation.quotation_date), "dd/MM/yyyy") : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Validity:</span>
                  <span className="text-slate-900 font-bold">15 Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Currency:</span>
                  <span className="text-slate-900 font-bold">{quotation?.currency?.code || 'SAR'} ({quotation?.currency?.name || 'Saudi Riyal'})</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Payment Terms:</span>
                <span className="text-slate-900 font-medium">50% Advance, 50% on Delivery</span>
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
                  <td className="py-4 px-2 text-center text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block mb-1">{item.item_name || 'Steel Rebar'}</span>
                    <span className="text-slate-400 text-[11px] block italic">{item.item?.name || 'حديد تسليح'}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-medium">{parseInt(item.quantity)}</td>
                  <td className="py-4 px-4 text-center text-slate-500">{item.unit?.name || 'Pcs'}</td>
                  <td className="py-4 px-4 text-right font-medium">{formatAmount(item.selling_price)}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">{formatAmount(item.line_total)}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">No items available in this quotation.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Box Layout */}
          <div className="flex justify-end mb-10">
            <div className="w-80 space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-500 px-2">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatAmount(quotation?.subtotal)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>VAT (15%)</span>
                <span className="font-semibold text-slate-900">{formatAmount(quotation?.tax_amount)} <span className="text-[10px] text-slate-400 font-normal">SAR</span></span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-900 mt-2">
                <span className="font-bold text-primary text-sm">Grand Total</span>
                <span className="font-black text-base text-primary">{formatAmount(quotation?.total_amount)} <span className="text-[11px] font-bold">SAR</span></span>
              </div>
            </div>
          </div>

          {/* Terms & Bank Details */}
          <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 text-[11px] text-slate-500 mb-12">
            <div>
              <h5 className="font-bold text-slate-800 text-xs mb-2">Terms & Conditions</h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Prices are valid for 15 Days from the date of quotation.</li>
                <li>Delivery within 3-5 working days from PO confirmation.</li>
                <li>Goods once sold cannot be returned unless manufacturing defect.</li>
                <li>All disputes subject to Riyadh jurisdiction.</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-800 text-xs mb-2">Bank Details</h5>
              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-600">
                <p><span className="text-slate-400">Bank Name:</span> Al Rajhi Bank</p>
                <p><span className="text-slate-400">Account Name:</span> FORSA Trading Est.</p>
                <p><span className="text-slate-400">IBAN:</span> SA56 8000 0000 1234 5678 9012</p>
              </div>
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

        </div>
      </div>

      {/* Modals Management Container */}
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