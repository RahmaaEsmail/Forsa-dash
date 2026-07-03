import React, { useState } from 'react'
import CustomTable from '../../shared/CustomTable'
import { Button } from '../../ui/button'
import { Edit, Eye, Trash2, CheckCircle2, DollarSign, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Badge } from '../../ui/badge'
import { toast } from 'sonner'
import { DeleteModal } from '../../shared/DeleteModal'
import useDeleteCustomerInvoice from '../../../hooks/customer-invoices/useDeleteCustomerInvoice'
import useApproveCustomerInvoice from '../../../hooks/customer-invoices/useApproveCustomerInvoice'
import useMarkPaidCustomerInvoice from '../../../hooks/customer-invoices/useMarkPaidCustomerInvoice'
import useCancelCustomerInvoice from '../../../hooks/customer-invoices/useCancelCustomerInvoice'
import CancelInvoiceModal from './CancelInvoiceModal'
import MarkPaidModal from './MarkPaidModal'
import EntityLink from '../../shared/EntityLink'

export default function CustomerInvoicesTable({ data, loading }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const deleteMutation = useDeleteCustomerInvoice();
  const approveMutation = useApproveCustomerInvoice();
  const markPaidMutation = useMarkPaidCustomerInvoice();
  const cancelMutation = useCancelCustomerInvoice();

  const handleApprove = (id) => {
    approveMutation.mutate({ id });
  };

  const handleMarkPaid = (formData) => {
    if (selectedInvoice?.id) {
      markPaidMutation.mutate({ id: selectedInvoice.id, body: formData }, {
        onSuccess: () => {
          setMarkPaidModalOpen(false);
          setSelectedInvoice(null);
        }
      });
    }
  };

  const handleCancel = (data) => {
    if (selectedInvoice?.id) {
      cancelMutation.mutate({ id: selectedInvoice.id, body: data }, {
        onSuccess: () => {
          setCancelModalOpen(false);
          setSelectedInvoice(null);
        }
      });
    }
  };

  const handleDeleteClick = (invoice) => {
    if (invoice.status !== 'draft') {
      toast.error("Only draft invoices can be deleted.");
      return;
    }
    setSelectedInvoice(invoice);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInvoice?.id) {
      deleteMutation.mutate({ id: selectedInvoice.id }, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedInvoice(null);
        }
      });
    }
  };

  const columns = [
    {
      title: "Invoice Number",
      render: (_, row) => (
        <span className="font-bold text-slate-800">
          {row.invoice_number || `INV-${row.id}`}
        </span>
      )
    },
    {
      title: "Reference Number",
      dataIndex: "reference_number",
      key: "reference_number",
      render: (val) => val || "N/A"
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
      render: (_, row) => {
        const isDraft = row.status === 'draft';
        const isApproved = row.status === 'approved';
        const isPaid = row.status === 'paid';
        const isCancelled = row.status === 'cancelled' || row.status === 'canceled';
        
        return (
          <Badge 
            className={`capitalize border-none font-semibold px-2.5 py-0.5 rounded-lg text-xs ${
              isDraft 
                ? "bg-slate-100 text-slate-600" 
                : isApproved
                  ? "bg-blue-50 text-blue-600"
                  : isPaid
                    ? "bg-emerald-50 text-emerald-600"
                    : isCancelled
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
            }`}
          >
            {row.status?.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      title: "Total Amount",
      render: (_, row) => (
        <span className="font-extrabold text-primary">
          {Number(row.financial_summary?.total_amount || row.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {row.currency?.code || 'SAR'}
        </span>
      ),
    },
    {
      title: "Creation Date",
      render: (_, row) => row.creation_date || (row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"),
    },
    {
      title: "Actions",
      className: "text-center",
      render: (_, row) => {
        const isDraft = row.status === 'draft';
        const isApproved = row.status === 'approved';
        return (
          <div className="flex gap-1.5 justify-center items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl w-8 h-8"
              onClick={() => navigate(`/customer-invoices/${row.id}/details`)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl w-8 h-8"
              onClick={() => navigate(`/customer-invoices/${row.id}/edit`)}
              disabled={!isDraft}
              title={isDraft ? "Edit Invoice" : "Only draft invoices can be edited"}
            >
              <Edit className="w-4 h-4" />
            </Button>

            {isDraft && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl w-8 h-8"
                  onClick={() => handleApprove(row.id)}
                  disabled={approveMutation.isPending}
                  title="Approve Invoice"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-xl w-8 h-8"
                  onClick={() => {
                    setSelectedInvoice(row);
                    setCancelModalOpen(true);
                  }}
                  title="Cancel Invoice"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}

            {isApproved && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl w-8 h-8"
                  onClick={() => {
                    setSelectedInvoice(row);
                    setMarkPaidModalOpen(true);
                  }}
                  title="Mark as Paid"
                >
                  <DollarSign className="w-4 h-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-xl w-8 h-8"
                  onClick={() => {
                    setSelectedInvoice(row);
                    setCancelModalOpen(true);
                  }}
                  title="Cancel Invoice"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl w-8 h-8"
              onClick={() => handleDeleteClick(row)}
              disabled={!isDraft || deleteMutation.isPending}
              title={isDraft ? "Delete Invoice" : "Only draft invoices can be deleted"}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <CustomTable 
        columns={columns}
        dataSource={data || []}
        loading={loading}
        rowKey="id"
      />
      
      <DeleteModal 
        open={deleteModalOpen} 
        setOpen={setDeleteModalOpen}
        onDelete={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        isSuccess={deleteMutation.isSuccess}
        title={`Delete Customer Invoice #${selectedInvoice?.invoice_number || ''}`}
        desc="Are you sure you want to delete this customer invoice? This action cannot be undone."
      />

      <CancelInvoiceModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={handleCancel}
        isLoading={cancelMutation.isPending}
      />

      <MarkPaidModal
        open={markPaidModalOpen}
        onOpenChange={setMarkPaidModalOpen}
        onConfirm={handleMarkPaid}
        isLoading={markPaidMutation.isPending}
      />
    </div>
  )
}
