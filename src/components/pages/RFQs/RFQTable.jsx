import React, { useState } from 'react'
import CustomTable from '../../shared/CustomTable'
import { Button } from '../../ui/button'
import { Edit, Eye, Trash2, XCircle, PackagePlus } from 'lucide-react'
import CancelRFQModal from './CancelRFQModal'
import { handleChangeRFQStatus, handleGetRFQs } from '../../../services/rfqs'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Loading from '../../shared/Loading'
import { Badge } from '../../ui/badge'
import Pagination from '../../shared/Pagination'
import { toast } from 'sonner'
import EntityLink from '../../shared/EntityLink'

import usePermission from '../../../hooks/usePermission';

const statusVariants = {
  draft: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none",
  rfq_sent: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none",
  buyer_approval: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none",
  price_gathering_approval: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-none",
  po_approval: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none",
  purchase_ordered: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none",
  cancelled: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none",
};

export default function RFQTable({ prId, view = "rfq", filters = {}, onDataLoaded, selectedRowKeys, onSelectedRowKeysChange }) {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState(null);

  const { data: rfqsData, isLoading } = useQuery({
    queryKey: ["rfqs", prId, view, page, filters],
    queryFn: ({ signal }) => handleGetRFQs({ 
      signal, 
      params: { 
        page, 
        per_page: 15,
        purchase_request_id: prId,
        view: view,
        ...filters
      } 
    }),
  });

  // Notify parent whenever data changes so it can export
  React.useEffect(() => {
    if (rfqsData?.data) onDataLoaded?.(rfqsData.data);
  }, [rfqsData]);

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => handleChangeRFQStatus({ id, status: 'cancel', body: { cancellation_reason: reason } }),
    onSuccess: () => {
      toast.success("RFQ canceled successfully");
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      setIsCancelModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to cancel RFQ");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => handleDeleteRFQ({ id }),
    onSuccess: () => {
      toast.success("RFQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete RFQ");
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this RFQ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelClick = (id) => {
    setSelectedRfqId(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason) => {
    cancelMutation.mutate({ id: selectedRfqId, reason });
  };

  const columns = [
    {
      title: "RFQ Number",
      dataIndex: "rfq_number",
      key: "rfq_number",
    },
    {
      title: "Supplier",
      render: (_, row) => (
        <EntityLink type="supplier" id={row.supplier?.id}>
          {row.supplier?.company_name || row.supplier?.contact_name || "N/A"}
        </EntityLink>
      ),
    },
    {
      title: "PR Number",
      render: (_, row) => row.purchase_request?.pr_number || "N/A",
    },
    {
      title: "Customer",
      render: (_, row) => (
        <EntityLink type="customer" id={row.customer?.id}>
          {row.customer?.company_name || row.customer?.name || "N/A"}
        </EntityLink>
      ),
    },
    {
      title: "Status",
      render: (_, row) => (
        <Badge
          className={`capitalize px-3 py-1 rounded-full ${statusVariants[row.status] || "bg-slate-100 text-slate-700"}`}
        >
          {row.status?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      title: "Total Amount",
      render: (_, row) => (
        <p className="font-semibold">{ `${Number(row.total_amount || 0).toLocaleString()} ${row.currency?.code || 'SAR'}`}</p>
      ),
    },
    {
      title: "Created At",
      render: (_, row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, row) =>
       {
        console.log("row",row);
        return   (
        <div className="flex gap-2">
          {hasPermission("view_rfqs") && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open(`/rfqs/${row.id}/details`, '_blank')}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {hasPermission("edit_rfqs") && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open(`/rfqs/${row.id}/edit`, '_blank')}
              title="Edit RFQ"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {row.status === 'purchase_ordered' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open(`/create-grn/${row.id}`, '_blank')}
              title="Create GRN"
            >
              <PackagePlus className="w-4 h-4 text-emerald-600" />
            </Button>
          )}
        </div>
      )
       }
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CustomTable
          columns={columns}
          dataSource={rfqsData?.data || []}
          rowKey="id"
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={onSelectedRowKeysChange}
        />
      </div>

      <CancelRFQModal
        open={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
      />

      {rfqsData?.meta && rfqsData.meta.last_page > 1 && (
        <div className="px-4 py-2">
          <Pagination
            page={rfqsData.meta.current_page}
            per_page={rfqsData.meta.per_page}
            total={rfqsData.meta.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
