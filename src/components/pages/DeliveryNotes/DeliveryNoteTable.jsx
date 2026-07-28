import React from 'react';
import CustomTable from '../../shared/CustomTable';
import { Badge } from '../../ui/badge';
import { Eye, Edit } from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../shared/Pagination';
import Loading from '../../shared/Loading';
import EntityLink from '../../shared/EntityLink';

const statusVariants = {
  draft: "bg-slate-100 text-slate-700 border-none",
  pending: "bg-blue-100 text-blue-700 border-none",
  delivered: "bg-emerald-100 text-emerald-700 border-none",
  cancelled: "bg-red-100 text-red-700 border-none",
};

import usePermission from '../../../hooks/usePermission';

export default function DeliveryNoteTable({ data, isLoading, page, setPage }) {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const columns = [
    {
      title: "DO #",
      dataIndex: "do_number",
      key: "do_number",
      render: (val, row) => <span className="font-bold text-slate-900">{row.quotation?.quotation_number || val || `#${row.id}`}</span>
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
          {hasPermission("view_delivery_orders") && (
            <Button variant="ghost" size="icon" onClick={() => window.open(`/delivery-note-details/${row.id}`, '_blank')} title="View">
              <Eye className="w-4 h-4 text-slate-500" />
            </Button>
          )}
          
          {row.status === 'draft' && hasPermission("edit_delivery_orders") && (
            <Button variant="ghost" size="icon" onClick={() => window.open(`/edit-delivery-note/${row.id}`, '_blank')} title="Edit">
              <Edit className="w-4 h-4 text-slate-500" />
            </Button>
          )}
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
