import React from 'react';
import CustomTable from '../../shared/CustomTable';
import { Badge } from '../../ui/badge';
import { Eye, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../shared/Pagination';
import Loading from '../../shared/Loading';
import { useDeleteGRN } from '../../../hooks/grns/useGRNs';
import EntityLink from '../../shared/EntityLink';

const statusVariants = {
  draft: "bg-slate-100 text-slate-700 border-none",
  approved: "bg-emerald-100 text-emerald-700 border-none",
  rejected: "bg-red-100 text-red-700 border-none",
};

export default function GRNTable({ data, isLoading, page, setPage }) {
  const navigate = useNavigate();
  const deleteGRN = useDeleteGRN();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this GRN?")) {
      deleteGRN.mutate({ id });
    }
  };

  const columns = [
    {
      title: "GRN #",
      dataIndex: "grn_number",
      key: "grn_number",
      render: (val, row) => <span className="font-bold text-slate-900">{val || `#${row.id}`}</span>
    },
    {
      title: "Date Received",
      dataIndex: "received_date",
      key: "received_date",
    },
    {
      title: "RFQ #",
      dataIndex: "rfq",
      key: "rfq",
      render: (rfq) => <Badge variant="outline" className="font-normal">{rfq?.rfq_number || 'N/A'}</Badge>
    },
    {
      title: "Supplier",
      render: (_, row) => (
        <EntityLink type="supplier" id={row.rfq?.supplier?.id}>
          {row.rfq?.supplier?.company_name || 'N/A'}
        </EntityLink>
      )
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
          <Button variant="ghost" size="icon" onClick={() => navigate(`/grns/${row.id}/details`)} title="View">
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          
          {row.status === 'draft' && (
            <Button variant="ghost" size="icon" onClick={() => navigate(`/grns/${row.id}/edit`)} title="Edit">
              <Edit className="w-4 h-4 text-slate-500" />
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
