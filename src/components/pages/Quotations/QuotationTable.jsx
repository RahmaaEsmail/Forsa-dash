import React, { useState } from "react";
import CustomTable from "../../shared/CustomTable";
import { Badge } from "../../ui/badge";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/Pagination";
import Loading from "../../shared/Loading";
import { DeleteModal } from "../../shared/DeleteModal";
import { useDeleteQuotation } from "../../../hooks/quotations/useDeleteQuotation";
import EntityLink from "../../shared/EntityLink";
// import { useDeleteQuotation } from '../../hooks/quotations/useDeleteQuotation';

const statusVariants = {
  draft: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none",
  submitted: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none",
  client_approval:
    "bg-purple-100 text-purple-700 hover:bg-purple-100 border-none",
  sales_manager_approval:
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none",
  proforma_invoice:
    "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none",
  paid_payment:
    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none",
  delivered: "bg-teal-100 text-teal-700 hover:bg-teal-100 border-none",
  approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none",
  rejected: "bg-red-100 text-red-700 hover:bg-red-100 border-none",
  cancelled: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none",
};

export default function QuotationTable({
  selectedRowKeys,
  onSelectedRowKeysChange,
  data,
  isLoading,
  page,
  setPage,
}) {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const deleteQuotation = useDeleteQuotation();

  const handleDelete = (id) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteQuotation.mutate(selectedId, {
      onSuccess: () => {
        setDeleteOpen(false);
      },
    });
  };

  const columns = [
    {
      title: "Quotation #",
      dataIndex: "quotation_number",
      key: "quotation_number",
      render: (val) => <span className="font-bold text-slate-900">{val}</span>,
    },
    {
      title: "Date",
      dataIndex: "quotation_date",
      key: "quotation_date",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => (
        <EntityLink type="customer" id={customer?.id}>
          {customer?.name || customer?.company_name || "N/A"}
        </EntityLink>
      ),
    },
    {
      title: "PR Number",
      dataIndex: "purchase_request",
      key: "purchase_request",
      render: (pr) => (
        <Badge variant="outline" className="font-normal">
          {pr?.pr_number || "N/A"}
        </Badge>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (val, row) => (
        <span className="font-bold">
          {val} {row.currency?.code}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          className={`capitalize px-3 py-1 rounded-full ${statusVariants[status] || "bg-slate-100 text-slate-700"}`}
        >
          {status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/quotations/${row.id}/details`)}
          >
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/quotations/${row.id}/edit`)}
          >
            <Edit className="w-4 h-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {row.status === "paid_payment" || row.status === "approved" ? (
            <Button
              variant="ghost"
              onClick={() => navigate(`/create-delivery-note/${row.id}`)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
            >
              Delivery Note
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size=""
            onClick={() => navigate(`/create-invoice/${row.id}`)}
          >
            Create Invoice
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CustomTable
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={onSelectedRowKeysChange}
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

      <DeleteModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Quotation"
        desc="Are you sure you want to delete this quotation? This action cannot be undone."
        isLoading={deleteQuotation.isPending}
        isSuccess={deleteQuotation.isSuccess}
        onDelete={confirmDelete}
      />
    </div>
  );
}
