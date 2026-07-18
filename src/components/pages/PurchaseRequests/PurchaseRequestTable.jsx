import React, { useEffect, useState } from "react";
import CustomTable from "../../shared/CustomTable";
import { Input } from "../../ui/input";
import {
  Delete,
  Edit,
  Eye,
  FilePlus,
  Fullscreen,
  MessageCircle,
  Star,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import Loading from "../../shared/Loading";
import { DeleteModal } from "../../shared/DeleteModal";
import useDeletePurchaseRequest from "../../../hooks/purchaseRequest/useDeletePurchaseRequest";
import ChangePurchaseStatusModal from "./ChangePurchaseStatusModal";
import Pagination from "../../shared/Pagination";
import CreateRFQModal from "./CreateRFQModal";
import EntityLink from "../../shared/EntityLink";

export default function PurchaseRequestTable({ page, setPage, purchase_data, selectedRowKeys, onSelectedRowKeysChange }) {
  const purchase_loading = !purchase_data;
  const {
    mutate: delete_purchase,
    isPending: is_delete,
    isSuccess: is_delete_success,
  } = useDeletePurchaseRequest();

  const navigate = useNavigate();

  // stats
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [rowData, setRowData] = useState({});

  function handleDeleteItem() {
    delete_purchase({ id: rowData?.id });
  }

  const columns = [
    {
      key: "pr_number",
      dataIndex: "pr_number",
      title: "PR Number",
      render: (_, row) => (
        <div className="flex gap-2 items-center">
          {/* <Input type="checkbox" className="w-5 h-5 rounded-3xl border! border-primary!" /> */}
          <div className="flex gap-1 items-center">
            <Star size={18} stroke="#F16000" color="#F16000" fill="#F16000" />
            <p>{row?.pr_number}</p>
          </div>
        </div>
      ),
    },
    {
      key: "pr_date",
      dataIndex: "pr_date",
      title: "PR Date",
      render: (_, row) => <p>{row?.pr_date}</p>,
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      render: (_, row) => {
        const statusClass = (status) => {
          switch (status) {
            case "draft":
              return "text-[#155DFC] bg-[#DBEAFE]"; // Blue for "draft"
            case "rejected":
              return "text-[#FF184A] bg-[#FFE6E6]"; // Red for "rejected"
            case "approved":
              return "text-[#28A745] bg-[#D4EDDA]"; // Green for "approved"
            case "converted":
              return "text-[#F9872E] bg-[#FFEDD4]"; // Orange for "converted"
            case "cancelled":
              return "text-[#6C757D] bg-[#F8D7DA]"; // Gray for "cancelled"
            case "submitted":
              return "text-[#FFC107] bg-[#FFF3CD]"; // Yellow for "submitted"
            default:
              return "text-[#000] bg-[#fff]"; // Default fallback
          }
        };

        return (
          <p
            className={`flex justify-center rounded-2xl items-center p-2 font-bold ${statusClass(row?.status)}`}
          >
            {row?.status}
          </p>
        );
      },
    },
    {
      key: "required_date",
      dataIndex: "required_date",
      title: "Required Date",
      render: (_, row) => <p>{row?.required_date}</p>,
    },
    {
      key: "delivery_address",
      dataIndex: "delivery_address",
      title: "Delivery Address",
      render: (_, row) => (
        <p className="wrap-break-word w-36  text-wrap">
          {row?.delivery_address}
        </p>
      ), // Added break-words for wrapping
    },
    {
      key: "notes",
      dataIndex: "notes",
      title: "Notes",
      render: (_, row) => (
        <p className="wrap-break-word w-36 text-wrap">
          {row?.notes || "No notes"}
        </p>
      ), // Added break-words for wrapping
    },
    {
      key: "customer",
      dataIndex: "customer",
      title: "Customer",
      render: (_, row) => {
        return (
          <div className="flex flex-col gap-2">
            <EntityLink
              type="customer"
              id={row?.customer?.id}
              className="break-words"
            >
              {row?.customer?.company_name || "Unknown"}
            </EntityLink>
            {/* {(row?.customer?.first_name !== "" && row?.customer?.first_name!= null)&&
             <EntityLink type="customer" id={row?.customer?.id} className="break-words">
               {row?.customer?.first_name + " " + row?.customer?.last_name || "Unknown"}
             </EntityLink>} 
            <div className="flex gap-2 items-center">
              <MessageCircle size={15} />
              <a href={`mailto:${row?.customer?.email}`} target="_blank" className="break-words">
                {row?.customer?.email}
              </a>
            </div> */}
          </div>
        );
      },
    },
    // {
    //   key: "purchase_representation",
    //   dataIndex: "purchase_representation",
    //   title: "Sales",
    //   render: (_, row) => (
    //     <div className="flex flex-col gap-2">
    //       <div className="flex justify-center gap-1 items-center">
    //         <img src="/public/images/ix_user-profile-filled.svg" className="w-5 h-5 rounded-full" />
    //         <p>{row?.sales_user?.name || "Unknown"}</p>
    //       </div>
    //       <div className="flex gap-2 items-center">
    //         <MessageCircle size={15} />
    //         <a href={`mailto:${row?.sales_user?.email}`} target="_blank" className="break-words">
    //           {row?.sales_user?.email}
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      key: "rejection_reason",
      dataIndex: "rejection_reason",
      title: "Rejection Reason",
      render: (_, row) => (
        <p className="text-[#FF184A] wrap-break-word w-36  text-wrap">
          {row?.rejection_reason || "---"}
        </p>
      ), // Added break-words for wrapping
    },
    {
      key: "cancellation_reason",
      dataIndex: "cancellation_reason",
      title: "Cancellation Reason",
      render: (_, row) => (
        <p className="text-[#FF184A] wrap-break-word w-36  text-wrap">
          {row?.cancellation_reason || "---"}
        </p>
      ), // Added break-words for wrapping
    },
    {
      title: "Actions",
      render: (_, row) => {
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/edit_purchase_request/${row?.id}`)}
              title="Edit"
              variant="ghost"
              size="icon"
            >
              <Edit />
            </Button>

            <Button
              onClick={() => navigate(`/purchase_request_details/${row?.id}`)}
              title="View"
              variant="ghost"
              size="icon"
            >
              <Fullscreen />
            </Button>

            {row?.status == "draft" && (
              <Button
                onClick={() => {
                  setOpenDeleteModal(true);
                  setRowData(row);
                }}
                title="Delete"
                variant="ghost"
                size="icon"
              >
                <Trash2 />
              </Button>
            )}

            {/* Removed Change Status from table per user request */}

            {["approved", "completed"].includes(row?.status) && (
              <Button
                onClick={() => navigate(`/purchase-requests/${row.id}/rfqs`)}
                className="text-[#00B69B] hover:text-[#00B69B] hover:bg-green-50 px-2"
              >
                RFQs
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // If data is loading, display a loading spinner
  if (purchase_loading) {
    return <Loading />;
  }

  // Render the CustomTable with the fetched data
  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={purchase_data?.data || []} // Ensure purchase_data is properly structured
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
      />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        isLoading={is_delete}
        isSuccess={is_delete_success}
        onDelete={handleDeleteItem}
        title={`This is a  Purchase Request #${rowData?.pr_number}?`}
        desc={
          "Are you sure you want to delete this item? This action cannot be undone."
        }
      />
      <ChangePurchaseStatusModal
        open={openChangeStatus}
        setOpen={setOpenChangeStatus}
        currentStatus={rowData?.status}
        id={rowData?.id}
      />

      <CreateRFQModal
        open={isRFQModalOpen}
        onOpenChange={setIsRFQModalOpen}
        pr={rowData}
      />

      {purchase_data?.meta && (
        <div className="mt-6 px-4">
          <Pagination
            page={purchase_data.meta.current_page}
            per_page={purchase_data.meta.per_page}
            total={purchase_data.meta.total}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
