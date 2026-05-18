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


import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Send,
  Truck,
  UserRound,
} from "lucide-react";

import { useRFQDetails } from "../../hooks/rfqs/useRFQs";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  if (Number.isNaN(number)) return value;

  return `${number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency?.symbol || currency?.code || ""}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  if (Number.isNaN(number)) return value;

  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const safeText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return value;
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

  const { data: rfqResponse, isLoading, isError } = useRFQDetails(rfqId);

  const rfq = getRfq(rfqResponse);
  const currency = rfq?.currency;

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
      <div className="mx-auto max-w-7xl space-y-6">
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
                <Badge variant="secondary" className="rounded-full text-white!">
                  {safeText(rfq.document_type)?.toUpperCase()}
                </Badge>
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
            {rfq.can_be_fully_edited && (
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => navigate(`/rfqs/${rfq.id}/edit`)}
              >
                <Pencil className="mr-2 size-4" />
                Edit RFQ
              </Button>
            )}

          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                Customer
              </CardTitle>
              <CardDescription>Customer request information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Company" value={customerName} />
              <InfoRow
                icon={UserRound}
                label="Type"
                value={rfq.customer?.customer_type}
              />
              <InfoRow icon={Mail} label="Email" value={rfq.customer?.email} />
              <InfoRow icon={Phone} label="Mobile" value={rfq.customer?.mobile} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Supplier
              </CardTitle>
              <CardDescription>Supplier quotation information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <InfoRow icon={Building2} label="Company" value={supplierName} />
              <InfoRow
                icon={UserRound}
                label="Contact"
                value={rfq.supplier?.contact_name}
              />
              <InfoRow icon={Mail} label="Email" value={rfq.supplier?.email} />
              <InfoRow
                icon={ReceiptText}
                label="VAT Number"
                value={rfq.supplier?.vat_number}
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                RFQ Summary
              </CardTitle>
              <CardDescription>Main RFQ dates and references</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <InfoRow icon={Hash} label="RFQ Number" value={rfq.rfq_number} />
              <InfoRow
                icon={CalendarDays}
                label="RFQ Date"
                value={formatDate(rfq.rfq_date)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Required Date"
                value={formatDate(rfq.required_date)}
              />
              <InfoRow
                icon={Clock3}
                label="Submitted At"
                value={formatDate(rfq.submitted_at)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="rounded-3xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="size-5" />
                Delivery & Purchase Request
              </CardTitle>
              <CardDescription>
                Delivery address, PR reference and logistics data
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 md:grid-cols-2">
              <InfoRow
                icon={MapPin}
                label="Delivery Address"
                value={rfq.delivery_address}
              />
              <InfoRow
                icon={Truck}
                label="Delivery Type"
                value={rfq.delivery_type}
              />
              <InfoRow
                icon={Hash}
                label="PR Number"
                value={rfq.purchase_request?.pr_number}
              />
              <InfoRow
                icon={CheckCircle2}
                label="PR Status"
                value={rfq.purchase_request?.status}
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment
              </CardTitle>
              <CardDescription>Payment terms and due dates</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <InfoRow
                icon={CreditCard}
                label="Payment Terms"
                value={rfq.payment_terms_text}
              />
              <InfoRow
                icon={CalendarDays}
                label="Payment Due Date"
                value={formatDate(rfq.payment_due_date)}
              />
              <InfoRow
                icon={Clock3}
                label="Payment Days"
                value={rfq.payment_days}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-3xl">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  RFQ Items
                </CardTitle>
                <CardDescription>
                  {rfq.items?.length || 0} item
                  {(rfq.items?.length || 0) === 1 ? "" : "s"} included in this
                  request
                </CardDescription>
              </div>

              {rfq.can_edit_prices && (
                <Badge variant="outline" className="w-fit rounded-full">
                  Prices can be edited
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-2xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead>Item</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Target Price</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">VAT</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rfq.items?.length ? (
                    rfq.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              {safeText(item.item_name)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Notes: {safeText(item.notes)}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>{safeText(item.unit?.name)}</TableCell>

                        <TableCell className="text-right">
                          {formatNumber(item.quantity)}
                        </TableCell>

                        <TableCell className="text-right">
                          {formatMoney(item.target_price, currency)}
                        </TableCell>

                        <TableCell className="text-right">
                          {formatMoney(item.unit_price, currency)}
                        </TableCell>

                        <TableCell className="text-right">
                          {formatNumber(item.vat_rate)}%
                        </TableCell>

                        <TableCell className="text-right font-semibold">
                          {formatMoney(item.line_total, currency)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-muted-foreground"
                      >
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="rounded-3xl lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
              <CardDescription>
                Internal notes and terms attached to this RFQ
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="mt-2 text-sm font-medium">
                  {safeText(rfq.notes)}
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Terms & Conditions
                </p>
                <p className="mt-2 text-sm font-medium">
                  {safeText(rfq.terms_and_conditions)}
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Supplier Reference
                </p>
                <p className="mt-2 text-sm font-medium">
                  {safeText(rfq.supplier_reference)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeDollarSign className="size-5" />
                Totals
              </CardTitle>
              <CardDescription>Financial summary</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatMoney(rfq.subtotal, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-semibold">
                    {formatMoney(rfq.discount_amount, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    VAT {formatNumber(rfq.vat_rate)}%
                  </span>
                  <span className="font-semibold">
                    {formatMoney(rfq.vat_amount || rfq.tax_amount, currency)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
                <span className="font-bold">Total</span>
                <span className="text-xl font-black">
                  {formatMoney(rfq.total_amount, currency)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="mt-1 font-bold">{safeText(currency?.code)}</p>
                </div>

                <div className="rounded-2xl border p-3 text-center">
                  <p className="text-xs text-muted-foreground">VAT Rate</p>
                  <p className="mt-1 font-bold">
                    {formatNumber(rfq.vat_rate)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}