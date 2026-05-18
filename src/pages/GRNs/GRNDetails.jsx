import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { useGRNDetails, useApproveGRN, useRejectGRN } from '../../hooks/grns/useGRNs'
import Loading from '../../components/shared/Loading'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import CustomTable from '../../components/shared/CustomTable'
import { Edit, FileText, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Textarea } from "../../components/ui/textarea"

export default function GRNDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: grnResponse, isLoading } = useGRNDetails(id);
  const approveGRN = useApproveGRN();
  const rejectGRN = useRejectGRN();
  const [rejectReason, setRejectReason] = React.useState("");
  const [isRejectOpen, setIsRejectOpen] = React.useState(false);

  if (isLoading) return <Loading />;

  const grn = grnResponse?.data;

  const columns = [
    {
      title: "Product",
      className: "text-left px-6",
      render: (_, record) => (
        <div className="text-left font-medium text-slate-900">
          {record.item?.name || record.item_name || 'Item'}
          {record.sku && <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider mt-0.5">{record.sku}</p>}
        </div>
      )
    },
    {
      title: "Expected",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center text-slate-600">
          {record.quantity_expected} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    },
    {
      title: "Received",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-slate-900">
          {record.quantity_received} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    },
    {
      title: "Accepted",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-emerald-600">
          {record.quantity_accepted} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    },
    {
      title: "Rejected",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-red-600">
          {record.quantity_rejected} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    },
    {
      title: "Status",
      className: "px-6",
      render: (_, record) => (
        <Badge variant="outline" className={`capitalize text-[10px] font-bold ${
          record.status === 'accepted' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 
          record.status === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' : ''
        }`}>
          {record.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-in fade-in duration-500 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/grns')}>GRNs</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">GRN Details</span>
      </div>

      <PageHeader title={`GRN #${grn?.grn_number || id}`} subTitle="Detailed view of received goods from supplier.">
        <div className='flex gap-3 items-center'>
          <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50" onClick={() => navigate(-1)}>
            Back
          </Button>

          {grn?.status === 'draft' && (
            <>
              <Button 
                onClick={() => navigate(`/grns/${id}/edit`)}
                className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>

              <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-11 px-6 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reject GRN</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this Goods Received Note.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea 
                      placeholder="Enter rejection reason..." 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="min-h-[100px] rounded-xl border-slate-200"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold"
                      disabled={!rejectReason || rejectGRN.isPending}
                      onClick={() => {
                        rejectGRN.mutate({ id, reason: rejectReason }, {
                          onSuccess: () => {
                            setIsRejectOpen(false);
                            setRejectReason("");
                          }
                        });
                      }}
                    >
                      {rejectGRN.isPending ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to approve this GRN?")) {
                    approveGRN.mutate({ id });
                  }
                }}
                disabled={approveGRN.isPending}
                className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg shadow-emerald-200/50"
              >
                <CheckCircle className="w-4 h-4" />
                {approveGRN.isPending ? "Approving..." : "Approve GRN"}
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6 space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</p>
                   <Badge className="capitalize px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 border-none font-bold">
                      {grn?.status?.replace(/_/g, ' ')}
                   </Badge>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Received Date</p>
                   <p className="text-base font-bold text-slate-900">{grn?.received_date}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purchase Order / RFQ</p>
                   <p className="text-base font-bold text-primary">#{grn?.rfq?.rfq_number}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Supplier</p>
                   <p className="text-base font-bold text-slate-900">{grn?.rfq?.supplier?.company_name}</p>
                </div>
             </div>

             {grn?.supplier_reference && (
                <div className="pt-6 border-t border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Supplier Reference Document</p>
                   <a 
                     href={grn.supplier_reference} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit text-primary font-bold hover:bg-slate-100 transition-all border border-slate-100"
                   >
                      <FileText className="w-5 h-5" />
                      View Delivery Note / Document
                   </a>
                </div>
             )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-2xl h-fit">
           <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 GRN Summary
              </h3>
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Total Items:</span>
                    <span className="font-bold text-slate-900">{grn?.items?.length}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Total Received:</span>
                    <span className="font-bold text-slate-900">
                       {grn?.items?.reduce((acc, item) => acc + (Number(item.quantity_received) || 0), 0)}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium text-emerald-600">Total Accepted:</span>
                    <span className="font-bold text-emerald-600">
                       {grn?.items?.reduce((acc, item) => acc + (Number(item.quantity_accepted) || 0), 0)}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium text-red-600">Total Rejected:</span>
                    <span className="font-bold text-red-600">
                       {grn?.items?.reduce((acc, item) => acc + (Number(item.quantity_rejected) || 0), 0)}
                    </span>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            Received Items List
            <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5">{grn?.items?.length}</Badge>
         </h3>
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <CustomTable
              columns={columns}
              dataSource={grn?.items || []}
              rowKey="id"
              className="border-none"
            />
         </div>
      </div>
    </div>
  );
}
