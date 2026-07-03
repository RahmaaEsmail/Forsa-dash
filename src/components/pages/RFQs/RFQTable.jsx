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
import { toast } from 'sonner'
import EntityLink from '../../shared/EntityLink'

export default function RFQTable({ prId, view = "rfq", filters = {}, onDataLoaded }) {
  const navigate = useNavigate();
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
        <Badge variant="outline" className="capitalize">
          {row.status?.replace('_', ' ')}
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/rfqs/${row.id}/details`)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/rfqs/${row.id}/edit`)}
            title="Edit RFQ"
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          {row.status != 'purchase_ordered' && row.status != 'cancelled' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleCancelClick(row.id)}
              title="Cancel RFQ"
            >
              <XCircle className="w-4 h-4 text-orange-500" />
            </Button>
          )}

          {row.status === 'purchase_ordered' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/create-grn/${row.id}`)}
              title="Create GRN"
            >
              <PackagePlus className="w-4 h-4 text-emerald-600" />
            </Button>
          )}

          {row.status !== 'canceled' && row.status !== 'cancelled' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete(row.id)}
              disabled={deleteMutation.isPending}
              title="Delete RFQ"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
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
      <CustomTable 
        columns={columns}
        dataSource={rfqsData?.data || []}
        rowKey="id"
      />
      
      <CancelRFQModal 
        open={isCancelModalOpen} 
        onOpenChange={setIsCancelModalOpen}
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
      />

      {rfqsData?.meta && (
        <div className="flex justify-between items-center px-4 py-4 bg-white border-t border-slate-100 rounded-b-xl">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900">{rfqsData.meta.from || 0}</span> to <span className="text-slate-900">{rfqsData.meta.to || 0}</span> of <span className="text-slate-900">{rfqsData.meta.total}</span> entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg h-9"
            >
              Previous
            </Button>
            <div className="flex items-center px-4 bg-slate-50 rounded-lg text-sm font-bold text-primary">
              {page}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === rfqsData.meta.last_page}
              className="rounded-lg h-9"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
