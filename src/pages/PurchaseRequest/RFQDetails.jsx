// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import {
//   XCircle,
//   Printer,
//   ChevronRight,
//   Save,
//   Send,
//   AlertCircle
// } from 'lucide-react'
// import { useForm, FormProvider } from 'react-hook-form'
// import { useRFQDetails, useUpdateRFQ, useChangeRFQStatus } from '../../hooks/rfqs/useRFQs'
// import { handleDeleteRFQ } from '../../services/rfqs'
// import Loading from '../../components/shared/Loading'
// import { Button } from '../../components/ui/button'
// import { Card } from '../../components/ui/card'
// import { toast } from 'sonner'
// import { format } from 'date-fns'

// // Form Components
// import RFQGeneralInfo from '../../components/pages/RFQs/RFQForm/RFQGeneralInfo'
// import RFQItemsTable from '../../components/pages/RFQs/RFQForm/RFQItemsTable'
// import RFQSummary from '../../components/pages/RFQs/RFQForm/RFQSummary'
// import RFQStatusTabs from '../../components/pages/RFQs/RFQStatusTabs'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
// import CancelRFQModal from '../../components/pages/RFQs/CancelRFQModal'
// import { Badge } from '../../components/ui/badge'

// export default function RFQDetails() {
//   const { rfqId } = useParams();
//   const navigate = useNavigate();

//   const { data: rfqResponse, isLoading } = useRFQDetails(rfqId);
//   const updateRFQ = useUpdateRFQ();
//   const changeStatus = useChangeRFQStatus();
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

//   const rfq = rfqResponse?.data;
//   console.log('rfq', rfq);

//   const methods = useForm({
//     defaultValues: {
//       supplier_id: "",
//       currency_code: "SAR",
//       payment_term_id: "",
//       receipt_date: new Date(),
//       due_date: new Date(),
//       notes: "",
//       items: []
//     }
//   });

//   useEffect(() => {
//     if (rfq) {
//       methods.reset({
//         rfq_number: rfq.rfq_number,
//         supplier_id: rfq.supplier?.id?.toString(),
//         currency_code: rfq.currency?.code,
//         payment_term_id: rfq.payment_term?.id?.toString(),
//         receipt_date: rfq.receipt_date ? new Date(rfq.receipt_date) : new Date(),
//         due_date: rfq.due_date ? new Date(rfq.due_date) : new Date(),
//         notes: rfq.notes || "",
//         items: rfq.items?.map(item => ({
//           id: item.id,
//           purchase_request_item_id: item.purchase_request_item_id,
//           item_name: item.item_name,
//           quantity: item.quantity,
//           unit_name: item.unit?.name,
//           target_price: item.target_price,
//           unit_price: item.unit_price || 0,
//           tax_rate: item.tax_rate || 15,
//           selected: true
//         })) || []
//       });
//     }
//   }, [rfq, methods]);

//   const onUpdate = (values) => {
//     const payload = {
//       due_date: format(values.due_date, "yyyy-MM-dd"),
//       notes: values.notes,
//       items: values.items.map(item => ({
//         id: item.id,
//         unit_price: Number(item.unit_price),
//         target_price: Number(item.target_price),
//         tax_rate: Number(item.tax_rate)
//       }))
//     };
//     updateRFQ.mutate({ id: rfqId, body: payload });
//   };

//   const items = methods.watch("items") || [];
//   const allPricesSet = items.length > 0 && items.every(item => Number(item.unit_price) > 0);

//   const handleSubmitStatus = () => {
//     if (!allPricesSet) {
//       toast.error("Please set prices for all products before submitting.", {
//         icon: <AlertCircle className="text-red-500" />
//       });
//       return;
//     }
//     changeStatus.mutate({ id: rfqId, status: 'submit', body: {} });
//   };

//   const handleStatusAction = (status, body = {}) => {
//     changeStatus.mutate({ id: rfqId, status, body });
//   };

//   const handleCancelRFQ = (reason) => {
//     handleStatusAction('cancel', { cancellation_reason: reason });
//     setIsCancelModalOpen(false);
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this RFQ?")) {
//       handleDeleteRFQ({ id: rfqId }).then(res => {
//         if (res?.success) {
//           toast.success("RFQ deleted successfully");
//           navigate('/rfqs');
//         }
//       }).catch(err => {
//         toast.error(err.response?.data?.message || err.response?.data?.error?.message || "Failed to delete RFQ");
//       });
//     }
//   };

//   if (isLoading) return <Loading />;

//   return (
//     <FormProvider {...methods}>
//       <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in duration-500">
//         {/* Breadcrumbs */}
//         <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
//           <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/rfqs')}>RFQs</span>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-slate-900">Submit RFQ</span>
//         </div>

//         <div className="flex flex-col gap-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
//                Request for Quotation <span className="text-slate-400 font-normal text-lg">#{rfq?.rfq_number}</span>
//             </h1>
//             <div className="flex gap-2">
//               <Button variant="outline" className="rounded-xl border-red-200 text-red-500 hover:bg-red-50" onClick={handleDelete}>Delete RFQ</Button>
//               <Button
//                 onClick={methods.handleSubmit(onUpdate)}
//                 disabled={updateRFQ.isPending}
//                 className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2 shadow-lg shadow-primary/20 px-6"
//               >
//                 <Save className="w-4 h-4" /> {updateRFQ.isPending ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div>

//           <RFQStatusTabs currentStatus={rfq?.status} />

//           {/* Action Bar from Figma */}
//           <div className="flex justify-center md:justify-end items-center gap-3 py-4 border-y border-slate-50">
//             <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary/5 px-6 font-bold" onClick={() => navigate(-1)}>Step Back</Button>
//             {/* <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary/5 px-6 font-bold">Re-send Email</Button> */}
//             {/* <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary/5 px-6 font-bold">
//               <Printer className="w-4 h-4 mr-2" /> Print RFQ
//             </Button> */}

//             {rfq?.status !== 'purchase_ordered' && rfq?.status !== 'canceled' && (
//               <Button
//                 variant="outline"
//                 className="rounded-lg border-red-500 text-red-500 hover:bg-red-50 px-6 font-bold"
//                 onClick={() => setIsCancelModalOpen(true)}
//               >
//                 Cancel RFQ
//               </Button>
//             )}

//             {rfq?.status === 'draft' && (
//               <Button
//                 onClick={handleSubmitStatus}
//                 disabled={changeStatus.isPending}
//                 className={`rounded-lg px-10 shadow-lg transition-all font-bold ${
//                   allPricesSet
//                     ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
//                     : "bg-slate-200 text-slate-500 cursor-not-allowed opacity-70"
//                 }`}
//               >
//                 {changeStatus.isPending ? "Submitting..." : "Approve & Submit"}
//               </Button>
//             )}

//             {rfq?.status === 'rfq_sent' && (
//               <Button
//                 onClick={() => handleStatusAction('approve')}
//                 disabled={changeStatus.isPending}
//                 className="rounded-lg px-10 shadow-lg transition-all font-bold bg-primary hover:bg-primary/90 text-white shadow-primary/20"
//               >
//                 {changeStatus.isPending ? "Approving..." : "Approve Pricing"}
//               </Button>
//             )}

//             {rfq?.status === 'buyer_approval' && (
//               <Button
//                 onClick={() => handleStatusAction('price-gathering-approve')}
//                 disabled={changeStatus.isPending}
//                 className="rounded-lg px-10 shadow-lg transition-all font-bold bg-primary hover:bg-primary/90 text-white shadow-primary/20"
//               >
//                 {changeStatus.isPending ? "Approving..." : "Approve Price Gathering"}
//               </Button>
//             )}

//             {rfq?.status === 'price_gathering_approval' && (
//               <Button
//                 onClick={() => handleStatusAction('po-approve')}
//                 disabled={changeStatus.isPending}
//                 className="rounded-lg px-10 shadow-lg transition-all font-bold bg-primary hover:bg-primary/90 text-white shadow-primary/20"
//               >
//                 {changeStatus.isPending ? "Approving..." : "Approve PO Commitment"}
//               </Button>
//             )}

//             {rfq?.status === 'po_approval' && (
//               <Button
//                 onClick={() => handleStatusAction('purchase-order')}
//                 disabled={changeStatus.isPending}
//                 className="rounded-lg px-10 shadow-lg transition-all font-bold bg-primary hover:bg-primary/90 text-white shadow-primary/20"
//               >
//                 {changeStatus.isPending ? "Issuing..." : "Issue Purchase Order"}
//               </Button>
//             )}
//           </div>

//           <div className="space-y-6">
//             <RFQGeneralInfo />

//             <Tabs defaultValue="general" className="w-full">
//               {/* <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-8 mb-6">
//                 <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 font-bold uppercase text-xs">General Info</TabsTrigger>
//                 <TabsTrigger value="pricing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 font-bold uppercase text-xs">Pricing</TabsTrigger>
//                 <TabsTrigger value="comparison" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 font-bold uppercase text-xs">Prices comparison list</TabsTrigger>
//               </TabsList> */}

//               <TabsContent value="general" className="space-y-6">
//                 <RFQItemsTable isEdit={true} items={rfq?.items} />
//                 <RFQSummary />
//               </TabsContent>

//               <TabsContent value="pricing">
//                 <div className="p-12 text-center text-slate-400 border border-dashed rounded-xl font-medium">
//                   Pricing details will be available after vendor submission.
//                 </div>
//               </TabsContent>

//               <TabsContent value="comparison" className="space-y-6">
//                 <Card className="border shadow-none bg-white rounded-xl overflow-hidden">
//                   <div className="p-6 border-b bg-slate-50/50">
//                     <h3 className="font-bold text-slate-900">Prices Comparison List</h3>
//                     <p className="text-xs text-slate-500 mt-1">Comparing current RFQ prices against target prices</p>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                       <thead className="bg-slate-50 text-slate-600 font-bold border-b">
//                         <tr>
//                           <th className="px-6 py-4">Product Name</th>
//                           <th className="px-6 py-4 text-center">Quantity</th>
//                           <th className="px-6 py-4 text-center">Target Price</th>
//                           <th className="px-6 py-4 text-center">Quoted Price</th>
//                           <th className="px-6 py-4 text-center">Variance</th>
//                           <th className="px-6 py-4 text-center">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y">
//                         {rfq?.items?.map((item) => {
//                           const target = Number(item.target_price) || 0;
//                           const quoted = Number(item.unit_price) || 0;
//                           const variance = quoted - target;
//                           const variancePercent = target > 0 ? (variance / target) * 100 : 0;
//                           const isSaving = variance <= 0;

//                           return (
//                             <tr key={item.id} className="hover:bg-slate-50 transition-colors">
//                               <td className="px-6 py-4 font-medium text-slate-900">{item.item_name}</td>
//                               <td className="px-6 py-4 text-center">{item.quantity} {item.unit?.name}</td>
//                               <td className="px-6 py-4 text-center font-medium text-slate-600">{target.toFixed(2)} {rfq.currency?.code}</td>
//                               <td className="px-6 py-4 text-center font-bold text-primary">{quoted > 0 ? quoted.toFixed(2) : '—'} {rfq.currency?.code}</td>
//                               <td className={`px-6 py-4 text-center font-medium ${isSaving ? 'text-emerald-600' : 'text-red-600'}`}>
//                                 {quoted > 0 ? `${variance > 0 ? '+' : ''}${variance.toFixed(2)} (${variancePercent.toFixed(1)}%)` : '—'}
//                               </td>
//                               <td className="px-6 py-4 text-center">
//                                 {quoted > 0 ? (
//                                   <Badge className={isSaving ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
//                                     {isSaving ? 'Within Target' : 'Above Target'}
//                                   </Badge>
//                                 ) : (
//                                   <Badge variant="outline" className="text-slate-400 border-slate-200">Pending</Badge>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       <CancelRFQModal
//         open={isCancelModalOpen}
//         onOpenChange={setIsCancelModalOpen}
//         onConfirm={handleCancelRFQ}
//         isLoading={changeStatus.isPending}
//       />
//     </FormProvider>
//   )
// }

// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   BadgeDollarSign,
//   Building2,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   CreditCard,
//   FileText,
//   Hash,
//   Mail,
//   MapPin,
//   Package,
//   Pencil,
//   Phone,
//   ReceiptText,
//   Send,
//   Truck,
//   UserRound,
// } from "lucide-react";

// import { useRFQDetails } from "../../hooks/rfqs/useRFQs";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const getRfq = (response) => {
//   return response?.data?.data || response?.data || response || null;
// };

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "—";

//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// };

// const formatMoney = (value, currency) => {
//   if (value === null || value === undefined || value === "") return "—";

//   const number = Number(value);

//   if (Number.isNaN(number)) return value;

//   return `${number.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })} ${currency?.symbol || currency?.code || ""}`;
// };

// const formatNumber = (value) => {
//   if (value === null || value === undefined || value === "") return "—";

//   const number = Number(value);

//   if (Number.isNaN(number)) return value;

//   return number.toLocaleString("en-US", {
//     maximumFractionDigits: 2,
//   });
// };

// const safeText = (value) => {
//   if (value === null || value === undefined || value === "") return "—";
//   return value;
// };

// const statusStyles = {
//   draft: "bg-slate-100 text-slate-700 border-slate-200",
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   submitted: "bg-blue-100 text-blue-800 border-blue-200",
//   approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
//   confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
//   cancelled: "bg-red-100 text-red-800 border-red-200",
//   rejected: "bg-red-100 text-red-800 border-red-200",
// };

// const statusLabels = {
//   draft: "Draft",
//   pending: "Pending",
//   submitted: "Submitted",
//   approved: "Approved",
//   confirmed: "Confirmed",
//   cancelled: "Cancelled",
//   rejected: "Rejected",
// };

// function StatusBadge({ status }) {
//   return (
//     <Badge
//       variant="outline"
//       className={`rounded-full px-3 py-1 text-xs font-semibold ${
//         statusStyles[status] || "bg-muted text-muted-foreground"
//       }`}
//     >
//       {statusLabels[status] || safeText(status)}
//     </Badge>
//   );
// }

// function InfoRow({ icon: Icon, label, value }) {
//   return (
//     <div className="flex items-start gap-3 rounded-2xl border bg-background p-4">
//       <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
//         <Icon className="size-4 text-muted-foreground" />
//       </div>

//       <div className="min-w-0">
//         <p className="text-xs font-medium text-muted-foreground">{label}</p>
//         <p className="mt-1 break-words text-sm font-semibold text-foreground">
//           {safeText(value)}
//         </p>
//       </div>
//     </div>
//   );
// }

// function LoadingState() {
//   return (
//     <div className="space-y-6 p-6">
//       <Skeleton className="h-12 w-64 rounded-2xl" />
//       <div className="grid gap-5 lg:grid-cols-3">
//         <Skeleton className="h-52 rounded-3xl" />
//         <Skeleton className="h-52 rounded-3xl" />
//         <Skeleton className="h-52 rounded-3xl" />
//       </div>
//       <Skeleton className="h-96 rounded-3xl" />
//     </div>
//   );
// }

// export default function RFQDetails() {
//   const { rfqId } = useParams();
//   const navigate = useNavigate();

//   const { data: rfqResponse, isLoading, isError } = useRFQDetails(rfqId);

//   const rfq = getRfq(rfqResponse);
//   const currency = rfq?.currency;

//   if (isLoading) {
//     return <LoadingState />;
//   }

//   if (isError || !rfq) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center p-6">
//         <Card className="w-full max-w-md rounded-3xl text-center">
//           <CardHeader>
//             <CardTitle>RFQ not found</CardTitle>
//             <CardDescription>
//               We couldn’t load this RFQ details. Please try again.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => navigate(-1)} className="rounded-2xl">
//               <ArrowLeft className="mr-2 size-4" />
//               Back
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const customerName =
//     rfq.customer?.company_name ||
//     rfq.customer?.name?.trim() ||
//     "Unnamed Customer";

//   const supplierName =
//     rfq.supplier?.company_name ||
//     rfq.supplier?.contact_name ||
//     "Unnamed Supplier";

//   return (
//     <div className="min-h-screen bg-muted/30 p-4 md:p-6">
//       <div className="mx-auto max-w-7xl space-y-6">
//         <div className="flex flex-col gap-4 rounded-3xl border bg-background p-5 shadow-sm md:flex-row md:items-center md:justify-between">
//           <div className="flex items-start gap-4">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => navigate(-1)}
//               className="rounded-2xl"
//             >
//               <ArrowLeft className="size-4" />
//             </Button>

//             <div>
//               <div className="mb-2 flex flex-wrap items-center gap-2">
//                 <StatusBadge status={rfq.status} />
//                 <Badge variant="secondary" className="rounded-full text-white!">
//                   {safeText(rfq.document_type)?.toUpperCase()}
//                 </Badge>
//                 {rfq.is_purchase_order && (
//                   <Badge className="rounded-full">Purchase Order</Badge>
//                 )}
//               </div>

//               <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
//                 {safeText(rfq.display_number || rfq.rfq_number)}
//               </h1>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 Created at {formatDate(rfq.created_at)} by{" "}
//                 {safeText(rfq.procurement_user?.name)}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {rfq.can_be_fully_edited && (
//               <Button
//                 variant="outline"
//                 className="rounded-2xl"
//                 onClick={() => navigate(`/rfqs/${rfq.id}/edit`)}
//               >
//                 <Pencil className="mr-2 size-4" />
//                 Edit RFQ
//               </Button>
//             )}

//           </div>
//         </div>

//         <div className="grid gap-5 lg:grid-cols-3">
//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Building2 className="size-5" />
//                 Customer
//               </CardTitle>
//               <CardDescription>Customer request information</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <InfoRow icon={Building2} label="Company" value={customerName} />
//               <InfoRow
//                 icon={UserRound}
//                 label="Type"
//                 value={rfq.customer?.customer_type}
//               />
//               <InfoRow icon={Mail} label="Email" value={rfq.customer?.email} />
//               <InfoRow icon={Phone} label="Mobile" value={rfq.customer?.mobile} />
//             </CardContent>
//           </Card>

//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Package className="size-5" />
//                 Supplier
//               </CardTitle>
//               <CardDescription>Supplier quotation information</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <InfoRow icon={Building2} label="Company" value={supplierName} />
//               <InfoRow
//                 icon={UserRound}
//                 label="Contact"
//                 value={rfq.supplier?.contact_name}
//               />
//               <InfoRow icon={Mail} label="Email" value={rfq.supplier?.email} />
//               <InfoRow
//                 icon={ReceiptText}
//                 label="VAT Number"
//                 value={rfq.supplier?.vat_number}
//               />
//             </CardContent>
//           </Card>

//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="size-5" />
//                 RFQ Summary
//               </CardTitle>
//               <CardDescription>Main RFQ dates and references</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <InfoRow icon={Hash} label="RFQ Number" value={rfq.rfq_number} />
//               <InfoRow
//                 icon={CalendarDays}
//                 label="RFQ Date"
//                 value={formatDate(rfq.rfq_date)}
//               />
//               <InfoRow
//                 icon={CalendarDays}
//                 label="Required Date"
//                 value={formatDate(rfq.required_date)}
//               />
//               <InfoRow
//                 icon={Clock3}
//                 label="Submitted At"
//                 value={formatDate(rfq.submitted_at)}
//               />
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid gap-5 lg:grid-cols-3">
//           <Card className="rounded-3xl lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Truck className="size-5" />
//                 Delivery & Purchase Request
//               </CardTitle>
//               <CardDescription>
//                 Delivery address, PR reference and logistics data
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="grid gap-3 md:grid-cols-2">
//               <InfoRow
//                 icon={MapPin}
//                 label="Delivery Address"
//                 value={rfq.delivery_address}
//               />
//               <InfoRow
//                 icon={Truck}
//                 label="Delivery Type"
//                 value={rfq.delivery_type}
//               />
//               <InfoRow
//                 icon={Hash}
//                 label="PR Number"
//                 value={rfq.purchase_request?.pr_number}
//               />
//               <InfoRow
//                 icon={CheckCircle2}
//                 label="PR Status"
//                 value={rfq.purchase_request?.status}
//               />
//             </CardContent>
//           </Card>

//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="size-5" />
//                 Payment
//               </CardTitle>
//               <CardDescription>Payment terms and due dates</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <InfoRow
//                 icon={CreditCard}
//                 label="Payment Terms"
//                 value={rfq.payment_terms_text}
//               />
//               <InfoRow
//                 icon={CalendarDays}
//                 label="Payment Due Date"
//                 value={formatDate(rfq.payment_due_date)}
//               />
//               <InfoRow
//                 icon={Clock3}
//                 label="Payment Days"
//                 value={rfq.payment_days}
//               />
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="overflow-hidden rounded-3xl">
//           <CardHeader>
//             <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   <Package className="size-5" />
//                   RFQ Items
//                 </CardTitle>
//                 <CardDescription>
//                   {rfq.items?.length || 0} item
//                   {(rfq.items?.length || 0) === 1 ? "" : "s"} included in this
//                   request
//                 </CardDescription>
//               </div>

//               {rfq.can_edit_prices && (
//                 <Badge variant="outline" className="w-fit rounded-full">
//                   Prices can be edited
//                 </Badge>
//               )}
//             </div>
//           </CardHeader>

//           <CardContent>
//             <div className="overflow-hidden rounded-2xl border">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted/60">
//                     <TableHead>Item</TableHead>
//                     <TableHead>Unit</TableHead>
//                     <TableHead className="text-right">Qty</TableHead>
//                     <TableHead className="text-right">Target Price</TableHead>
//                     <TableHead className="text-right">Unit Price</TableHead>
//                     <TableHead className="text-right">VAT</TableHead>
//                     <TableHead className="text-right">Line Total</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {rfq.items?.length ? (
//                     rfq.items.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>
//                           <div>
//                             <p className="font-semibold">
//                               {safeText(item.item_name)}
//                             </p>
//                             <p className="mt-1 text-xs text-muted-foreground">
//                               Notes: {safeText(item.notes)}
//                             </p>
//                           </div>
//                         </TableCell>

//                         <TableCell>{safeText(item.unit?.name)}</TableCell>

//                         <TableCell className="text-right">
//                           {formatNumber(item.quantity)}
//                         </TableCell>

//                         <TableCell className="text-right">
//                           {formatMoney(item.target_price, currency)}
//                         </TableCell>

//                         <TableCell className="text-right">
//                           {formatMoney(item.unit_price, currency)}
//                         </TableCell>

//                         <TableCell className="text-right">
//                           {formatNumber(item.vat_rate)}%
//                         </TableCell>

//                         <TableCell className="text-right font-semibold">
//                           {formatMoney(item.line_total, currency)}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="h-28 text-center text-muted-foreground"
//                       >
//                         No items found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid gap-5 lg:grid-cols-3">
//           <Card className="rounded-3xl lg:col-span-2">
//             <CardHeader>
//               <CardTitle>Notes & Terms</CardTitle>
//               <CardDescription>
//                 Internal notes and terms attached to this RFQ
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="rounded-2xl border bg-background p-4">
//                 <p className="text-xs font-medium text-muted-foreground">
//                   Notes
//                 </p>
//                 <p className="mt-2 text-sm font-medium">
//                   {safeText(rfq.notes)}
//                 </p>
//               </div>

//               <div className="rounded-2xl border bg-background p-4">
//                 <p className="text-xs font-medium text-muted-foreground">
//                   Terms & Conditions
//                 </p>
//                 <p className="mt-2 text-sm font-medium">
//                   {safeText(rfq.terms_and_conditions)}
//                 </p>
//               </div>

//               <div className="rounded-2xl border bg-background p-4">
//                 <p className="text-xs font-medium text-muted-foreground">
//                   Supplier Reference
//                 </p>
//                 <p className="mt-2 text-sm font-medium">
//                   {safeText(rfq.supplier_reference)}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="rounded-3xl">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BadgeDollarSign className="size-5" />
//                 Totals
//               </CardTitle>
//               <CardDescription>Financial summary</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold">
//                     {formatMoney(rfq.subtotal, currency)}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Discount</span>
//                   <span className="font-semibold">
//                     {formatMoney(rfq.discount_amount, currency)}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">
//                     VAT {formatNumber(rfq.vat_rate)}%
//                   </span>
//                   <span className="font-semibold">
//                     {formatMoney(rfq.vat_amount || rfq.tax_amount, currency)}
//                   </span>
//                 </div>
//               </div>

//               <Separator />

//               <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
//                 <span className="font-bold">Total</span>
//                 <span className="text-xl font-black">
//                   {formatMoney(rfq.total_amount, currency)}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="rounded-2xl border p-3 text-center">
//                   <p className="text-xs text-muted-foreground">Currency</p>
//                   <p className="mt-1 font-bold">{safeText(currency?.code)}</p>
//                 </div>

//                 <div className="rounded-2xl border p-3 text-center">
//                   <p className="text-xs text-muted-foreground">VAT Rate</p>
//                   <p className="mt-1 font-bold">
//                     {formatNumber(rfq.vat_rate)}%
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { downloadAsPDF } from "../../utils/downloadPDF";
import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Hash,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  ReceiptText,
  Truck,
  UserRound,
  Printer,
  Database,
  Info,
  MessageSquare,
} from "lucide-react";

import { useRFQDetails } from "../../hooks/rfqs/useRFQs";
import useListSettings from "../../hooks/Settings/useListSettings";
import { useActivityLogsList } from "../../hooks/activity-logs/useActivityLogs";
import useListUsers from "../../hooks/Users/useListUsers";
import EntityLink from "../../components/shared/EntityLink";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const getRfq = (response) => {
  return response?.data?.data || response?.data || response || null;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatMoney = (value, currency) => {
  if (value === null || value === undefined || value === "") return "0.00";
  const number = Number(value);
  if (Number.isNaN(number)) return value;

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const safeText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${formatDate(value)} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const resolveMentions = (text, users) => {
  if (!text) return "";
  return text.replace(/@\[(\d+)\]/g, (_match, id) => {
    const user = users.find((u) => u.id === Number(id));
    return `@${user ? user.name : `User #${id}`}`;
  });
};

const flattenComments = (list) => {
  const flat = [];
  const walk = (items) => {
    (items || []).forEach((item) => {
      flat.push(item);
      if (item.replies?.length) walk(item.replies);
    });
  };
  walk(list);
  return flat
    .filter((c) => c && typeof c === "object" && c.id !== undefined)
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
};

const statusStyles = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

function StatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
        statusStyles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {statusLabels[status] || safeText(status)}
    </Badge>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-background p-4">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-foreground">
          {safeText(value)}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-12 w-64 rounded-2xl" />
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="h-52 rounded-3xl" />
        <Skeleton className="h-52 rounded-3xl" />
        <Skeleton className="h-52 rounded-3xl" />
      </div>
      <Skeleton className="h-96 rounded-3xl" />
    </div>
  );
}

export default function RFQDetails() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

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
    "procurement@forsa.com";
  const companyVat =
    getSetting("vat") ||
    getSetting("vat_number") ||
    getSetting("company_tax_number") ||
    "300123456700003";
  const companyAddress =
    getSetting("address") || getSetting("company_address") || "Cairo, Egypt";

  const { data: rfqResponse, isLoading, isError } = useRFQDetails(rfqId);

  const rfq = getRfq(rfqResponse);
  const currency = rfq?.currency;

  const activityModelType = rfq
    ? rfq.is_purchase_order
      ? "purchase_order"
      : "rfq"
    : null;
  const { data: logsData } = useActivityLogsList(activityModelType, rfqId);
  const { data: usersResponse } = useListUsers({ per_page: 100 });

  const chatUsers = Array.isArray(usersResponse)
    ? usersResponse
    : usersResponse?.data || [];
  const chatComments = flattenComments(
    Array.isArray(logsData) ? logsData : logsData?.data || [],
  );

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    const documentName =
      rfq?.po_number || rfq?.display_number || rfq?.rfq_number || rfqId;
    document.title = documentName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !rfq) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl text-center">
          <CardHeader>
            <CardTitle>RFQ not found</CardTitle>
            <CardDescription>
              We couldn’t load this RFQ details. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(-1)} className="rounded-2xl">
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customerName =
    rfq.customer?.company_name ||
    rfq.customer?.name?.trim() ||
    "Unnamed Customer";
  const supplierName =
    rfq.supplier?.company_name ||
    rfq.supplier?.contact_name ||
    "Unnamed Supplier";

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      {/* GLOBAL HIGH-FIDELITY PRINT OVERRIDES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          
          #printable-rfq-area-wrapper { 
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-rfq-area-wrapper * { visibility: visible !important; }
          
          @page { size: A4; margin: 0; padding : 0; }
          .page-break {
            page-break-before: always;
          }
        }
      `,
        }}
      />

      <div className="mx-auto max-w-7xl space-y-6 no-print">
        {/* Main Header Action Controls */}
        <div className="flex flex-col gap-4 rounded-3xl border bg-background p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-2xl"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={rfq.status} />
                {/* <Badge variant="secondary" className="rounded-full text-white! uppercase">
                  {safeText(rfq.document_type)}
                </Badge> */}
                {rfq.is_purchase_order && (
                  <Badge className="rounded-full">Purchase Order</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {safeText(rfq.display_number || rfq.rfq_number)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Created at {formatDate(rfq.created_at)} by{" "}
                {safeText(rfq.procurement_user?.name)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="rounded-2xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50"
            >
              <Printer className="w-4 h-4" /> Download/Print PDF
            </Button>
            {rfq.status === "purchase_ordered" && (
              <Button
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                onClick={() => navigate(`/create-grn/${rfq.id}`)}
              >
                <Package className="w-4 h-4" /> Create GRN
              </Button>
            )}
            {rfq.can_be_fully_edited && (
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => navigate(`/rfqs/${rfq.id}/edit`)}
              >
                <Pencil className="mr-2 size-4" /> Edit RFQ
              </Button>
            )}
          </div>
        </div>

        {/* Informational Cards */}
        {/* <div className="grid gap-5 lg:grid-cols-3">
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5" /> Customer</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Company Name" value={customerName} />
              <InfoRow icon={UserRound} label="Customer Type" value={rfq.customer?.customer_type} />
              <InfoRow icon={Mail} label="Customer Email" value={rfq.customer?.email} />
              <InfoRow icon={Phone} label="Customer Mobile" value={rfq.customer?.mobile} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="size-5" /> Supplier</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Supplier Company" value={supplierName} />
              <InfoRow icon={UserRound} label="Contact Person" value={rfq.supplier?.contact_name} />
              <InfoRow icon={Mail} label="Supplier Email" value={rfq.supplier?.email} />
              <InfoRow icon={ReceiptText} label="Supplier VAT Number" value={rfq.supplier?.vat_number} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5" /> Summary Reference Keys</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Hash} label="RFQ Number" value={rfq.rfq_number} />
              <InfoRow icon={CalendarDays} label="RFQ Creation Date" value={formatDate(rfq.rfq_date)} />
              <InfoRow icon={CalendarDays} label="Required Fulfillment Date" value={formatDate(rfq.required_date)} />
              <InfoRow icon={Clock3} label="Submitted Timestamp" value={formatDate(rfq.submitted_at)} />
            </CardContent>
          </Card>
        </div> */}

        {/* Dynamic Items Framework */}
        {/* <Card className="rounded-3xl overflow-hidden">
          <CardHeader><CardTitle>RFQ Items Metadata Matrix</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50 font-semibold border-b">
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Unit</th>
                    <th className="p-4 text-right">Quantity Keys</th>
                    <th className="p-4 text-right">Target Price</th>
                    <th className="p-4 text-right">Unit Price</th>
                    <th className="p-4 text-right">VAT Rate</th>
                    <th className="p-4 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rfq.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{safeText(item.item_name)}</p>
                        <p className="text-xs text-slate-400 mt-1">ID: {item.item_id} | Notes: {safeText(item.notes)}</p>
                      </td>
                      <td className="p-4 text-muted-foreground">{safeText(item.unit?.name)} (ID: {safeText(item.unit?.id)})</td>
                      <td className="p-4 text-right">
                        <div className="text-sm font-medium">{formatNumber(item.quantity)}</div>
                        <div className="text-[10px] text-slate-400">Rem: {item.remaining_quantity} | Acc: {item.quantity_accepted}</div>
                      </td>
                      <td className="p-4 text-right text-muted-foreground">{formatMoney(item.target_price)}</td>
                      <td className="p-4 text-right font-medium">{formatMoney(item.unit_price)}</td>
                      <td className="p-4 text-right text-muted-foreground">{formatNumber(item.vat_rate)}%</td>
                      <td className="p-4 text-right font-bold">{formatMoney(item.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* ========================================================================= */}
      {/* HIGH-FIDELITY PRINT CANVAS (PRINTS ABSOLUTELY ALL RETURNED API METRICS) */}
      {/* ========================================================================= */}
      <div id="printable-rfq-area-wrapper" className="bg-white py-6">
        <div
          className="max-w-[850px] mx-auto bg-white p-12 border border-slate-200 rounded-sm"
          id="printable-rfq-area"
          ref={printRef}
        >
          {/* Brand Header Line */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
              <img
                src="/images/LOGO.svg"
                className="h-20 w-36 object-cover mb-2"
                alt="Logo"
              />
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              <h2 className="font-extrabold text-sm text-slate-900 tracking-wide">
                FORSA TRADING & CONTRACTING
              </h2>
              <p>
                {companyAddress} | VAT: {companyVat}
              </p>
              <p>Procurement Hub Stream &nbsp;|&nbsp; email: {companyEmail}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight uppercase border-b pb-2 flex justify-between">
            <span>
              {rfq.is_purchase_order
                ? "PURCHASE ORDER"
                : "REQUEST FOR QUOTATION"}
            </span>
            <span className="text-slate-400 font-normal text-xs font-mono">
              STATUS: {safeText(rfq.status).toUpperCase()}
            </span>
          </h3>

          {/* Core Entity Reference Information Boxes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] space-y-1">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-slate-400" /> Supplier Data
              </h4>
              <p>
                <span className="text-slate-400">Company:</span>{" "}
                <strong className="text-slate-800">
                  <EntityLink type="supplier" id={rfq.supplier?.id}>
                    {supplierName}
                  </EntityLink>
                </strong>
              </p>
              <p>
                <span className="text-slate-400">VAT No:</span>{" "}
                {safeText(rfq.supplier?.vat_number)}
              </p>
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                {safeText(rfq.supplier?.email)}
              </p>
              <p>
                <span className="text-slate-400">Ref Code:</span>{" "}
                {safeText(rfq.supplier_reference)}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] space-y-1">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" /> Registry Data
              </h4>
              {rfq.is_purchase_order ? (
                <p>
                  <span className="text-slate-400">PO Number:</span>{" "}
                  <strong>{rfq.po_number || rfq.display_number}</strong>
                </p>
              ) : (
                <p>
                  <span className="text-slate-400">RFQ Number:</span>{" "}
                  <strong>{rfq.display_number || rfq.rfq_number}</strong>
                </p>
              )}
              {/* <p><span className="text-slate-400">PR Connected:</span> {safeText(rfq.purchase_request?.pr_number)}</p> */}
              {/* <p><span className="text-slate-400">PR Status:</span> {safeText(rfq.purchase_request?.status)}</p> */}
            </div>
          </div>

          {/* Workflow Schedule Matrix Box */}
          <div className="bg-slate-50 rounded-xl p-4 text-[11px] border border-slate-100 grid grid-cols-4 gap-4 mb-6">
            <div>
              <span className="text-slate-400 block">RFQ Creation Date</span>
              <strong className="text-slate-800">
                {formatDate(rfq.rfq_date)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Required Date</span>
              <strong className="text-slate-800">
                {formatDate(rfq.required_date)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">
                Delivery Address Config
              </span>
              <strong className="text-slate-800">
                {safeText(rfq.delivery_address).replace(
                  "Saudi Arabia",
                  "Kingdom of Saudi Arabia",
                )}
              </strong>
            </div>
            {/* <div><span className="text-slate-400 block">Created At Timestamp</span><strong className="text-slate-800">{formatDate(rfq.created_at)}</strong></div> */}
            {/* <div><span className="text-slate-400 block">System Operator</span><strong className="text-slate-800">{safeText(rfq.procurement_user?.name)}</strong></div> */}
          </div>

          {/* Financial Settings Metric Bar */}
          {/* <div className="bg-slate-50 rounded-xl p-4 text-[11px] border border-slate-100 grid grid-cols-4 gap-4 mb-6"> */}
          {/* <div><span className="text-slate-400 block">Payment Logistics Profile</span><strong className="text-slate-800">{safeText(rfq.payment_terms_text)}</strong></div> */}
          {/* <div><span className="text-slate-400 block">Payment Days Duration</span><strong className="text-slate-800">{safeText(rfq.payment_days)} Days</strong></div> */}
          {/* <div><span className="text-slate-400 block">Delivery Typology</span><strong className="text-slate-800 uppercase">{safeText(rfq.delivery_type)}</strong></div> */}
          {/* </div> */}

          {/* PO-specific info row */}
          {rfq.is_purchase_order && (
            <div className="bg-slate-50 rounded-xl p-4 text-[11px] border border-slate-100 grid grid-cols-3 gap-4 mb-6">
              <div>
                <span className="text-slate-400 block">PO Number</span>
                <strong className="text-slate-800">
                  {safeText(rfq.po_number || rfq.display_number)}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">PO Date</span>
                <strong className="text-slate-800">
                  {formatDate(
                    rfq.po_date || rfq.confirmed_at || rfq.created_at,
                  )}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Terms</span>
                <strong className="text-slate-800">
                  {safeText(rfq.payment_terms_text)}
                </strong>
              </div>
            </div>
          )}

          {/* Line Items */}
          <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
            {rfq.is_purchase_order ? "Purchase Order Items" : "Requested Items"}
          </h4>
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-400 text-[10px] font-bold text-slate-800 uppercase bg-slate-50">
                <th className="py-2 px-1 w-8 text-center">No.</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2 text-center">Unit</th>
                <th className="py-2 px-2 text-right">Qty</th>
                <th className="py-2 px-2 text-right">Unit Price</th>
                <th className="py-2 px-2 text-right">VAT %</th>
                <th className="py-2 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
              {rfq.items?.map((item, index) => (
                <tr key={item.id || index} className="align-top">
                  <td className="py-3 px-1 text-center text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-slate-900 block">
                      {item.item_name}
                    </span>
                    {item.specifications && (
                      <span className="text-[10px] text-slate-500 block">
                        {item.specifications}
                      </span>
                    )}
                    {item.notes && (
                      <span className="text-[10px] text-slate-400 block">
                        Note: {item.notes}
                      </span>
                    )}
                    {/* <span className="text-[9px] text-slate-400 block font-mono">Item ID: {item.item_id} | Created: {safeText(item.created_at)}</span> */}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-500">
                    {item.unit?.name || "طن"}{" "}
                    <span className="text-[9px] font-mono block">
                      ({safeText(item.unit?.id)})
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    <div className="font-bold text-slate-900">
                      {formatNumber(item.quantity)}
                    </div>
                    {/* <div className="text-[9px] text-slate-400 font-mono">Rem: {item.remaining_quantity} | Acc: {item.quantity_accepted}</div> */}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {formatMoney(item.unit_price)}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-400 font-mono">
                    {formatNumber(item.vat_rate)}%
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900 font-mono">
                    {formatMoney(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cumulative Financial Columns Blocks */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-1.5 text-[11px] border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-500 px-2">
                <span>Subtotal Summation</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatMoney(rfq.subtotal)} {currency?.code || "SAR"}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>Discount Deduction</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatMoney(rfq.discount_amount)} {currency?.code || "SAR"}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>
                  Tax Allocation / VAT ({formatNumber(rfq.vat_rate)}%)
                </span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatMoney(rfq.vat_amount || rfq.tax_amount)}{" "}
                  {currency?.code || "SAR"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 text-slate-900 mt-2">
                <span className="font-bold text-slate-900 text-xs">
                  Total Evaluated Summary
                </span>
                <span className="font-black text-sm font-mono text-slate-950">
                  {formatMoney(rfq.total_amount)} {currency?.code || "SAR"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="flex flex-col gap-4 mb-8">
            {rfq.notes && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 uppercase text-sm mb-1.5">
                  Notes
                </h4>
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  {rfq.notes}
                </p>
              </div>
            )}
            {/* Always show Terms & Conditions for PO; otherwise only if content exists */}
            {(rfq.terms_and_conditions || rfq.is_purchase_order) && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 uppercase text-[15px] mb-2">
                  Terms & Conditions
                </h4>
                <p className="text-[18px] text-slate-900 font-bold leading-relaxed whitespace-pre-wrap">
                  {rfq.terms_and_conditions ||
                    "Standard terms and conditions apply. Delivery as per agreed schedule. Payment as per payment terms above."}
                </p>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 text-center text-[11px] font-bold text-slate-700 pt-12 border-t border-slate-200 mt-12">
            <div className="space-y-10">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>
                {rfq.is_purchase_order
                  ? "Authorized Buyer Signature & Stamp"
                  : "Procurement Officer Signature"}
              </p>
            </div>
            <div className="space-y-10">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>
                {rfq.is_purchase_order
                  ? "Supplier Authorized Signature & Stamp"
                  : "Approver Signature"}
              </p>
            </div>
          </div>

          {/* Activity / Chat Log */}
          <div className="page-break pt-8 mt-12 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-4 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              {rfq.is_purchase_order
                ? "Purchase Order Activity Log"
                : "RFQ Activity Log"}
            </h4>
            {chatComments.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                No activity log entries.
              </p>
            ) : (
              <div className="space-y-2">
                {chatComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`text-[11px] bg-slate-50 border border-slate-100 rounded-lg p-3 ${
                      comment.parent_id ? "ml-6" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 gap-3">
                      <span className="font-bold text-slate-800">
                        {comment.parent_id && (
                          <span className="text-slate-400 font-normal mr-1">
                            ↳
                          </span>
                        )}
                        {comment.user?.name || "System Log"}
                      </span>
                      <span className="text-slate-400 shrink-0">
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {resolveMentions(
                        comment.comment ||
                          comment.message ||
                          comment.description ||
                          "",
                        chatUsers,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
