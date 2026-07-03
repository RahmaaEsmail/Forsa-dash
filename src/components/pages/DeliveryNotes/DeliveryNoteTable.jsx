import React from 'react';
import CustomTable from '../../shared/CustomTable';
import { Badge } from '../../ui/badge';
import { Eye, Edit, Trash2, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../shared/Pagination';
import Loading from '../../shared/Loading';
import useChangeDeliveryNoteStatus from '../../../hooks/delivery-notes/useChangeDeliveryNotesStatus';
import useDeleteDeliveryNote from '../../../hooks/delivery-notes/useDeleteDeliveryNotes';
import { toast } from 'sonner';
import EntityLink from '../../shared/EntityLink';

const statusVariants = {
  draft: "bg-slate-100 text-slate-700 border-none",
  pending: "bg-blue-100 text-blue-700 border-none",
  delivered: "bg-emerald-100 text-emerald-700 border-none",
  cancelled: "bg-red-100 text-red-700 border-none",
};

export default function DeliveryNoteTable({ data, isLoading, page, setPage }) {
  const navigate = useNavigate();
  const changeStatus = useChangeDeliveryNoteStatus();
  const deleteNote = useDeleteDeliveryNote();

  const handleStatusChange = (id, status) => {
    changeStatus.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this delivery note?")) {
      deleteNote.mutate({ id });
    }
  };

  const columns = [
    {
      title: "DO #",
      dataIndex: "do_number",
      key: "do_number",
      render: (val, row) => <span className="font-bold text-slate-900">{val || `#${row.id}`}</span>
    },
    {
      title: "Date",
      dataIndex: "delivery_date",
      key: "delivery_date",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <EntityLink type="customer" id={customer?.id}>
          {customer?.company_name || 'N/A'}
        </EntityLink>
      )
    },
    {
      title: "Quotation",
      dataIndex: "quotation",
      key: "quotation",
      render: (q) => <Badge variant="outline" className="font-normal">{q?.quotation_number || 'N/A'}</Badge>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge className={`capitalize px-3 py-1 rounded-full ${statusVariants[status] || 'bg-slate-100 text-slate-700'}`}>
          {status?.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/delivery-note-details/${row.id}`)} title="View">
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          
          {row.status === 'draft' && (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-delivery-note/${row.id}`)} title="Edit">
                <Edit className="w-4 h-4 text-slate-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleStatusChange(row.id, 'submit')} title="Submit for Dispatch" className="text-blue-500">
                <Truck className="w-4 h-4" />
              </Button>
            </>
          )}

          {row.status === 'pending' && (
            <Button variant="ghost" size="icon" onClick={() => handleStatusChange(row.id, 'deliver')} title="Mark as Delivered" className="text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}

          {row.status !== 'delivered' && row.status !== 'cancelled' && (
             <Button variant="ghost" size="icon" onClick={() => handleStatusChange(row.id, 'cancel')} title="Cancel" className="text-orange-500">
                <XCircle className="w-4 h-4" />
             </Button>
          )}

          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(row.id)} title="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CustomTable
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
        />
      </div>
      
      {data?.meta && data.meta.last_page > 1 && (
        <div className="px-4 py-2">
          <Pagination
            page={data.meta.current_page}
            per_page={data.meta.per_page}
            total={data.meta.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
