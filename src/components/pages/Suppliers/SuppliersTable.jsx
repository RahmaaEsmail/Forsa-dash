import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { Edit, Eye, Trash } from 'lucide-react'
import CustomTable from '../../shared/CustomTable'
import { Badge } from '../../ui/badge'
import { DeleteModal } from '../../shared/DeleteModal'
import { ActiveInActiveStatusModal } from '../../shared/ActiveInActiveStatusModal'
import useDeleteCategory from '../../../hooks/categories/useDeleteCategory'
import useChangeCategoryStatus from '../../../hooks/categories/useChangeCatgoryStatus'
import { useNavigate } from 'react-router-dom'
import useDeleteUnit from '../../../hooks/units/useDeleteUnit'
import useChangeUnitStatus from '../../../hooks/units/useChangeUnitStatus'
import useDeleteSupplier from '../../../hooks/suppliers/useDeleteSupplier'
import ContactLink from '../../shared/ContactLink'

export default function SuppliersTable({ searc,  sortOrder, page,per_page,  data, loading, selectedRowKeys, onSelectedRowKeysChange }) {
  // navigate 
  const navigate = useNavigate();
  
  // modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);

  // data
  const [rowData, setRowData] = useState({});
  const {
    mutate: deleteSupplier,
    isPending: isDeleting,
    isSuccess: is_delete_supplier_success
  } = useDeleteSupplier()

  // const {
  //   mutate: changeUnitStatus,
  //   isPending: isChanging,
  //   isSuccess: is_change_status_unit_success
  // } = useChangeUnitStatus({search : searc , sort_order: sortOrder , page , per_page})

  function handleDeleteUnit() {
    if (rowData?.id && deleteModal) {
      deleteSupplier({ id: rowData?.id })
    }
  }


  const columns = [
  { title: "#", dataIndex: "id", key: "id" },

  // { title: "Arabic Name", dataIndex: "name", key: "name" },

  { title: "Company", dataIndex: "company_name", key: "company_name" },

  { title: "CR", dataIndex: "commercial_register", key: "commercial_register" },

  { title: "VAT", dataIndex: "vat_number", key: "vat_number" },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (v) => <ContactLink type="email" value={v} />,
  },

  { title: "Mobile", dataIndex: "mobile", key: "mobile" },
  { title: "Phone", dataIndex: "phone", key: "phone" },

  { title: "Source", dataIndex: "source_of_supply", key: "source_of_supply" },

  { title: "Tax", dataIndex: "tax_treatment", key: "tax_treatment" },

  { title: "Lead Time", dataIndex: "lead_time_days", key: "lead_time_days" },

  { title: "Min Order", dataIndex: "minimum_order_value", key: "minimum_order_value" },

  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    render: (v) => v || "—"
  },

  {
    title: "Active",
    dataIndex: "is_active",
    key: "is_active",
    render: (v, row) => (
      <Badge
        className={
          v === true
            ? "bg-[#CCF0EB] hover:bg-[#CCF0EB]/90 text-success"
            : "bg-[#F5F7FA] text-[#858B9E]"
        }
      >
        {v === true ? "Active" : "Inactive"}
      </Badge>
    )
  },

  {
    title: "Website",
    dataIndex: "website",
    key: "website",
    render: (url) =>
      url ? (
        <a className="underline" href={url} target="_blank" rel="noreferrer">
          Open
        </a>
      ) : (
        "-"
      ),
  },

  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    render: (t) => (t ? <span className="line-clamp-2">{t}</span> : "-"),
  },

   {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex gap-2 items-center justify-center">
            <Button title="Details" size='icon' onClick={() => navigate(`/supplier-details/${row?.id}`)} variant='ghost'>
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              title="Edit"
              onClick={() => navigate(`/create-supplier?id=${row?.id}`)}
              size='icon'
              variant='ghost'
            >
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => {
                setRowData(row)
                setDeleteModal(true)
              }}
              title="Delete" size='icon' variant='ghost' className="hover:text-red-600 hover:bg-red-50">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    }
];

  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={data || []}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
      />

      <DeleteModal isSuccess={is_delete_supplier_success} isLoading={isDeleting} onDelete={handleDeleteUnit} open={deleteModal} setOpen={setDeleteModal} title={`This is a  supplier #${rowData?.name}?`} desc={"Are you sure you want to delete this item? This action cannot be undone."} />
      {/* <ActiveInActiveStatusModal isSuccess={is_change_status_unit_success} isLoading={isChanging} onSuccess={handleChangeStatus} open={changeStatusModal} setOpen={setChangeStatusModal} title={`This is a  Unit #${rowData?.name}?`} /> */}
    </div>
  )
}
