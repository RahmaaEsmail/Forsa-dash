import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import useDeliveryNoteDetails from '../../hooks/delivery-notes/useDeliveryNoteDetails'
import Loading from '../../components/shared/Loading'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import CustomTable from '../../components/shared/CustomTable'
import { Edit, FileText, ChevronRight, Calendar, MapPin, Phone, Info, Package, ArrowLeft } from 'lucide-react'

const statusVariants = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function DeliveryNoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dnResponse, isLoading } = useDeliveryNoteDetails(id);

  if (isLoading) return <Loading />;

  const dn = dnResponse?.data;

  const columns = [
    {
      title: "Product",
      className: "text-left px-6",
      render: (_, record) => (
        <div className="text-left font-medium text-slate-900">
          {record.item?.name || record.item_name || 'Item'}
        </div>
      )
    },
    {
      title: "Quantity",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-slate-900">
          {record.quantity} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    },
    {
      title: "Delivered",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-emerald-600">
          {record.quantity_delivered} <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
      <PageHeader title={`Delivery Note #${dn?.do_number || id}`} subTitle="View detailed delivery record and status.">
        <div className='flex gap-3 items-center'>
          <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2" onClick={() => navigate('/delivery-notes')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {dn?.status === 'draft' && (
            <Button 
              onClick={() => navigate(`/edit-delivery-note/${id}`)}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Edit className="w-4 h-4" />
              Edit DO
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
               <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="bg-primary/10 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                     </div>
                     <h3 className="font-bold text-slate-900">Delivery Items</h3>
                  </div>
                  <Badge className={`capitalize px-3 py-1 rounded-full border ${statusVariants[dn?.status] || 'bg-slate-100 text-slate-700'}`}>
                    {dn?.status}
                  </Badge>
               </div>
               <CardContent className="p-0">
                  <CustomTable 
                    columns={columns} 
                    dataSource={dn?.items || []} 
                    rowKey="id"
                    className="border-none"
                  />
               </CardContent>
            </Card>

            {dn?.notes && (
               <Card className="border-none shadow-sm bg-white rounded-2xl">
                  <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
                     <div className="bg-amber-100 p-2 rounded-lg">
                        <Info className="w-5 h-5 text-amber-600" />
                     </div>
                     <h3 className="font-bold text-slate-900">Delivery Instructions / Notes</h3>
                  </div>
                  <CardContent className="p-6">
                     <p className="text-slate-600 text-sm leading-relaxed">{dn.notes}</p>
                  </CardContent>
               </Card>
            )}
         </div>

         {/* Sidebar */}
         <div className="space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-2xl">
               <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                     <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Summary</h3>
               </div>
               <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between items-start">
                        <span className="text-slate-500 text-sm">Customer</span>
                        <div className="text-right">
                           <p className="font-bold text-slate-900 text-sm">{dn?.customer?.company_name}</p>
                           <p className="text-slate-400 text-xs mt-1">{dn?.customer?.phone}</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center py-2 border-t border-slate-50">
                        <span className="text-slate-500 text-sm">Quotation</span>
                        <Badge variant="outline" className="font-bold text-primary border-primary/20 bg-primary/5 cursor-pointer" onClick={() => navigate(`/quotations/${dn?.quotation?.id}/details`)}>
                           {dn?.quotation?.quotation_number}
                        </Badge>
                     </div>
                     <div className="flex justify-between items-center py-2 border-t border-slate-50">
                        <span className="text-slate-500 text-sm">Delivery Date</span>
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                           <Calendar className="w-4 h-4 text-slate-400" />
                           {dn?.delivery_date}
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                     <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p>
                           <p className="text-sm text-slate-700 mt-1">{dn?.delivery_address || 'No address provided'}</p>
                           {dn?.location_link && (
                              <a href={dn.location_link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                                 View on Map <ChevronRight className="w-3 h-3" />
                              </a>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                     <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</p>
                           <p className="text-sm text-slate-700 mt-1">{dn?.contact_info || 'No contact info provided'}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
