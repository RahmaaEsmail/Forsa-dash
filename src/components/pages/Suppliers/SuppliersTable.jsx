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

export default function SuppliersTable({ searc,  sortOrder, page,per_page,  data, loading }) {
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

  { title: "Arabic Name", dataIndex: "name", key: "name" },

  { title: "Company", dataIndex: "company_name", key: "company_name" },

  { title: "CR", dataIndex: "commercial_register", key: "commercial_register" },

  { title: "VAT", dataIndex: "vat_number", key: "vat_number" },

  { title: "Email", dataIndex: "email", key: "email" },

  { title: "Mobile", dataIndex: "mobile", key: "mobile" },

  { title: "Phone", dataIndex: "phone", key: "phone" },

  { title: "Source", dataIndex: "source_of_supply", key: "source_of_supply" },

  { title: "Tax", dataIndex: "tax_treatment", key: "tax_treatment" },

  { title: "Lead Time", dataIndex: "lead_time_days", key: "lead_time_days" },

  { title: "Min Order", dataIndex: "minimum_order_value", key: "minimum_order_value" },

  { title: "Rating", dataIndex: "rating", key: "rating" },

  {
    title: "Active",
    dataIndex: "is_active",
    key: "is_active",
    render: (v) => (
      <Badge className={v ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>
        {v ? "Active" : "Inactive"}
      </Badge>
    ),
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
      title: "Action",
      render: (_, row) => {
        return (
          <div className='flex gap-2 justify-center items-center'>
            {/* <Button  
            onClick={() => navigate(`/create-unit?id=${row?.id}&name=${`${row?.name}`}`)}
            title="Edit" size='icon' variant='ghost'>
              <Edit />
            </Button> */}

            <Button
              onClick={() => {
                setRowData(row)
                setDeleteModal(true)
              }}
              title="Delete" size='icon' variant='ghost'>
              <Trash />
            </Button>

            {/* <Button
              onClick={() => {
                setRowData(row)
                setChangeStatusModal(true)
              }}
              title="Change Status" size='icon' variant='ghost'>
              <Eye />
            </Button> */}
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
      />

      <DeleteModal isSuccess={is_delete_supplier_success} isLoading={isDeleting} onDelete={handleDeleteUnit} open={deleteModal} setOpen={setDeleteModal} title={`This is a  supplier #${rowData?.name}?`} desc={"Are you sure you want to delete this item? This action cannot be undone."} />
      {/* <ActiveInActiveStatusModal isSuccess={is_change_status_unit_success} isLoading={isChanging} onSuccess={handleChangeStatus} open={changeStatusModal} setOpen={setChangeStatusModal} title={`This is a  Unit #${rowData?.name}?`} /> */}
    </div>
  )
}
