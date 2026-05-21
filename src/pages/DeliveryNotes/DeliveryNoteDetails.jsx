// import React from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import PageHeader from '../../components/shared/PageHeader'
// import { Button } from '../../components/ui/button'
// import useDeliveryNoteDetails from '../../hooks/delivery-notes/useDeliveryNoteDetails'
// import Loading from '../../components/shared/Loading'
// import { Badge } from '../../components/ui/badge'
// import { Card, CardContent } from '../../components/ui/card'
// import CustomTable from '../../components/shared/CustomTable'
// import { Edit, FileText, ChevronRight, Calendar, MapPin, Phone, Info, Package, ArrowLeft } from 'lucide-react'

// const statusVariants = {
//   draft: "bg-slate-100 text-slate-700 border-slate-200",
//   pending: "bg-blue-100 text-blue-700 border-blue-200",
//   delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
//   cancelled: "bg-red-100 text-red-700 border-red-200",
// };

// export default function DeliveryNoteDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data: dnResponse, isLoading } = useDeliveryNoteDetails(id);

//   if (isLoading) return <Loading />;

//   const dn = dnResponse?.data;

//   const columns = [
//     {
//       title: "Product",
//       className: "text-left px-6",
//       render: (_, record) => (
//         <div className="text-left font-medium text-slate-900">
//           {record.item?.name || record.item_name || 'Item'}
//         </div>
//       )
//     },
//     {
//       title: "Quantity",
//       className: "px-6",
//       render: (_, record) => (
//         <div className="text-center font-bold text-slate-900">
//           {record.quantity} <span className="text-xs text-slate-400">{record.unit?.name}</span>
//         </div>
//       )
//     },
//     {
//       title: "Delivered",
//       className: "px-6",
//       render: (_, record) => (
//         <div className="text-center font-bold text-emerald-600">
//           {record.quantity_delivered} <span className="text-xs text-slate-400">{record.unit?.name}</span>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8">
//       <PageHeader title={`Delivery Note #${dn?.do_number || id}`} subTitle="View detailed delivery record and status.">
//         <div className='flex gap-3 items-center'>
//           <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2" onClick={() => navigate('/delivery-notes')}>
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </Button>

//           {dn?.status === 'draft' && (
//             <Button 
//               onClick={() => navigate(`/edit-delivery-note/${id}`)}
//               className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20"
//             >
//               <Edit className="w-4 h-4" />
//               Edit DO
//             </Button>
//           )}
//         </div>
//       </PageHeader>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//          {/* Main Content */}
//          <div className="lg:col-span-2 space-y-8">
//             <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
//                <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                      <div className="bg-primary/10 p-2 rounded-lg">
//                         <Package className="w-5 h-5 text-primary" />
//                      </div>
//                      <h3 className="font-bold text-slate-900">Delivery Items</h3>
//                   </div>
//                   <Badge className={`capitalize px-3 py-1 rounded-full border ${statusVariants[dn?.status] || 'bg-slate-100 text-slate-700'}`}>
//                     {dn?.status}
//                   </Badge>
//                </div>
//                <CardContent className="p-0">
//                   <CustomTable 
//                     columns={columns} 
//                     dataSource={dn?.items || []} 
//                     rowKey="id"
//                     className="border-none"
//                   />
//                </CardContent>
//             </Card>

//             {dn?.notes && (
//                <Card className="border-none shadow-sm bg-white rounded-2xl">
//                   <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
//                      <div className="bg-amber-100 p-2 rounded-lg">
//                         <Info className="w-5 h-5 text-amber-600" />
//                      </div>
//                      <h3 className="font-bold text-slate-900">Delivery Instructions / Notes</h3>
//                   </div>
//                   <CardContent className="p-6">
//                      <p className="text-slate-600 text-sm leading-relaxed">{dn.notes}</p>
//                   </CardContent>
//                </Card>
//             )}
//          </div>

//          {/* Sidebar */}
//          <div className="space-y-8">
//             <Card className="border-none shadow-sm bg-white rounded-2xl">
//                <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
//                   <div className="bg-blue-100 p-2 rounded-lg">
//                      <FileText className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <h3 className="font-bold text-slate-900">Summary</h3>
//                </div>
//                <CardContent className="p-6 space-y-6">
//                   <div className="space-y-4">
//                      <div className="flex justify-between items-start">
//                         <span className="text-slate-500 text-sm">Customer</span>
//                         <div className="text-right">
//                            <p className="font-bold text-slate-900 text-sm">{dn?.customer?.company_name}</p>
//                            <p className="text-slate-400 text-xs mt-1">{dn?.customer?.phone}</p>
//                         </div>
//                      </div>
//                      <div className="flex justify-between items-center py-2 border-t border-slate-50">
//                         <span className="text-slate-500 text-sm">Quotation</span>
//                         <Badge variant="outline" className="font-bold text-primary border-primary/20 bg-primary/5 cursor-pointer" onClick={() => navigate(`/quotations/${dn?.quotation?.id}/details`)}>
//                            {dn?.quotation?.quotation_number}
//                         </Badge>
//                      </div>
//                      <div className="flex justify-between items-center py-2 border-t border-slate-50">
//                         <span className="text-slate-500 text-sm">Delivery Date</span>
//                         <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
//                            <Calendar className="w-4 h-4 text-slate-400" />
//                            {dn?.delivery_date}
//                         </div>
//                      </div>
//                   </div>

//                   <div className="pt-4 border-t border-slate-100">
//                      <div className="flex items-start gap-3">
//                         <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
//                         <div>
//                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p>
//                            <p className="text-sm text-slate-700 mt-1">{dn?.delivery_address || 'No address provided'}</p>
//                            {dn?.location_link && (
//                               <a href={dn.location_link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
//                                  View on Map <ChevronRight className="w-3 h-3" />
//                               </a>
//                            )}
//                         </div>
//                      </div>
//                   </div>

//                   <div className="pt-4 border-t border-slate-100">
//                      <div className="flex items-start gap-3">
//                         <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
//                         <div>
//                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</p>
//                            <p className="text-sm text-slate-700 mt-1">{dn?.contact_info || 'No contact info provided'}</p>
//                         </div>
//                      </div>
//                   </div>
//                </CardContent>
//             </Card>
//          </div>
//       </div>
//     </div>
//   )
// }


import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import useListSettings from '../../hooks/Settings/useListSettings'
import useDeliveryNoteDetails from '../../hooks/delivery-notes/useDeliveryNoteDetails'
import Loading from '../../components/shared/Loading'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import CustomTable from '../../components/shared/CustomTable'
import { 
  Edit, 
  FileText, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Phone, 
  Info, 
  Package, 
  ArrowLeft, 
  Printer
} from 'lucide-react'

const statusVariants = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function DeliveryNoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const { data: settingsData } = useListSettings();
  const getSetting = (key) => settingsData?.data?.find(s => s.key === key)?.value;

  const companyPhone = getSetting('phone') || getSetting('company_phone') || '+966 55 598 0730';
  const companyEmail = getSetting('email') || getSetting('company_email') || 'Sales@forsageneraltrading.com';
  const companyVat = getSetting('vat') || getSetting('vat_number') || '300123456700003';
  const companyAddress = getSetting('address') || getSetting('company_address') || 'King Fahd Road, Olaya District, Riyadh 12211';

  const { data: dnResponse, isLoading } = useDeliveryNoteDetails(id);

  if (isLoading) return <Loading />;

  const dn = dnResponse?.data;

  const handlePrint = () => {
    window.print();
  };

  const formatNumber = (val) => {
    if (!val) return '0';
    const num = parseFloat(val);
    return Number.isInteger(num) ? num.toString() : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const columns = [
    {
      title: "No.",
      className: "w-16 text-center text-slate-400 font-medium text-sm py-4",
      render: (_, __, index) => index + 1
    },
    {
      title: "Description",
      className: "text-left px-4 py-4",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm">
            {record.item_name || record.item?.name || 'Steel Rebar'}
          </span>
          {record.item?.name && record.item_name && record.item_name !== record.item?.name && (
            <span className="text-slate-400 text-xs mt-0.5 font-medium">{record.item.name}</span>
          )}
        </div>
      )
    },
    {
      title: "Qty Ordered",
      className: "text-center px-4 py-4 font-bold text-slate-900 text-sm",
      render: (_, record) => formatNumber(record.quantity)
    },
    {
      title: "Qty Delivered",
      className: "text-center px-4 py-4 font-black text-emerald-600 text-sm",
      render: (_, record) => formatNumber(record.quantity_delivered)
    },
    {
      title: "Unit",
      className: "text-center px-4 py-4 text-slate-500 font-medium text-sm",
      render: (_, record) => record.unit?.name || 'طن'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 space-y-8 pb-16">
      
      {/* GLOBAL HIGH-FIDELITY PRINT CANVAS CSS INJECTION */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          
          #printable-delivery-note-wrapper { 
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-delivery-note-wrapper * { visibility: visible !important; }
          
          @page { size: A4; margin: 15mm 12mm 15mm 12mm; }
        }
      `}} />

      {/* Screen Interactive Workspace Controls Header */}
      {/* <div className="no-print">
        <PageHeader title={`Delivery Note #${dn?.do_number || id}`} subTitle="View detailed delivery record and status.">
          <div className='flex gap-3 items-center'>
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2" onClick={() => navigate('/delivery-notes')}>
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
      </div> */}

      {/* Screen Interactive Body Grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
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
      </div> */}

      {/* ========================================================================= */}
      {/* HIGH-FIDELITY PRINT RENDERING CANVAS (MATCHES THE IMAGE TEMPLATE DIRECTLY)*/}
      {/* ========================================================================= */}
      <div id="printable-delivery-note-wrapper" className="bg-white py-6">
        <div className="max-w-[850px] mx-auto bg-white p-12 border border-slate-200 rounded-sm" id="printable-delivery-note-canvas" ref={printRef}>
          
          {/* Top Brand Header Layer */}
          <div className="flex justify-between items-start border-b-2 border-[#b9252c] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mx-2 flex justify-center items-center">
                  <img src="/images/LOGO.svg" className="h-20 w-36 object-cover" alt="Logo" />
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

          <h3 className="text-2xl font-bold text-[#b9252c] mb-6 tracking-tight">Delivery Note</h3>

          {/* Reference Block Matrix Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Delivery Target Recipient Info */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-xs text-slate-600 space-y-2">
              <h4 className="text-[#b9252c] font-bold text-sm mb-2 uppercase tracking-wide">Ship To / Client</h4>
              <p className="text-slate-900 font-extrabold text-base">{dn?.customer?.company_name || 'ABC Construction Co.'}</p>
              <p className="flex items-start gap-1"><span className="text-slate-400 shrink-0">📍 Location:</span> <span>{dn?.delivery_address || 'Industrial Area, Riyadh'}</span></p>
              {dn?.customer?.phone && <p><span className="text-slate-400">📞 Phone:</span> {dn.customer.phone}</p>}
              {dn?.contact_info && <p><span className="text-slate-400">👤 Contact Person:</span> {dn.contact_info}</p>}
            </div>

            {/* Registry Meta Attributes */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-xs text-slate-600">
              <h4 className="text-[#b9252c] font-bold text-sm mb-3 uppercase tracking-wide">Document Logistics</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Delivery Note No:</span>
                  <span className="text-slate-900 font-bold">{dn?.do_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date:</span>
                  <span className="text-slate-900 font-bold">{dn?.delivery_date || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Reference Agreement:</span>
                  <span className="text-slate-900 font-bold">#{dn?.quotation?.quotation_number || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Operator:</span>
                  <span className="text-slate-900 font-medium">{dn?.created_by?.name || 'Super Admin'}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center">
                <span className="text-slate-400">Delivery Status Context:</span>
                <span className="text-emerald-600 font-extrabold uppercase tracking-wider">{dn?.status}</span>
              </div>
            </div>
          </div>

          {/* Core Table Grid Line Items Layout */}
          <table className="w-full text-left border-collapse mb-10">
            <thead>
              <tr className="border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3 w-16 text-center">No.</th>
                <th className="py-3 px-4">Item Specification / Description</th>
                <th className="py-3 px-4 text-center">Qty Ordered</th>
                <th className="py-3 px-4 text-center">Qty Delivered</th>
                <th className="py-3 px-4 text-center">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {dn?.items?.map((item, index) => (
                <tr key={item.id || index} className="align-top hover:bg-slate-50/30">
                  <td className="py-4 px-3 text-center text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block mb-0.5">{item.item_name || item.item?.name || 'Steel Rebar'}</span>
                    {item.item?.name && item.item_name && item.item_name !== item.item?.name && (
                      <span className="text-slate-400 text-[11px] block italic">{item.item.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-600">{formatNumber(item.quantity)}</td>
                  <td className="py-4 px-4 text-center font-black text-slate-900">{formatNumber(item.quantity_delivered)}</td>
                  <td className="py-4 px-4 text-center text-slate-500 font-medium">{item.unit?.name || 'طن'}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 italic">No items allocated to this delivery note.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Operational Notes / Instructions Layer Block */}
          {dn?.notes && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-[11px] text-slate-600 mb-12">
              <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wide text-[#b9252c]">Logistics Dispatch Notes</h5>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{dn.notes}</p>
            </div>
          )}

          {/* Structural Verification Signatures Layer */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-700 pt-12 border-t border-slate-100/70 mt-16">
            <div className="space-y-12">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Received Goods in Good Order By</p>
            </div>
            <div>
              <div className="border border-[#e11d48]/20 bg-[#fff1f2] text-[#b9252c] py-2 px-4 rounded-xl inline-block uppercase tracking-wider text-[10px] font-black">
                Forsa Approved Dispatch
              </div>
            </div>
            <div className="space-y-12">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Authorized Dispatcher Stamp</p>
            </div>
          </div>

          {/* Absolute Bottom Page Core Corporate Footer Line */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 mt-16">
            <p>Thank you for your business!</p>
            <p className="font-semibold text-slate-500">www.forsa-sa.com</p>
            <p>sales@forsa-sa.com</p>
          </div>

        </div>
      </div>

    </div>
  )
}