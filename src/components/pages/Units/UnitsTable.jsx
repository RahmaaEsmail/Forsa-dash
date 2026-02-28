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

export default function UnitsTable({ searc,  sortOrder, page,per_page,  data, loading }) {
  // navigate 
  const navigate = useNavigate();
  
  // modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);

  // data
  const [rowData, setRowData] = useState({});
  const {
    mutate: deleteUnit,
    isPending: isDeleting,
    isSuccess: is_delete_unit_success
  } = useDeleteUnit({ search: searc , sort_order: sortOrder , page , per_page})

  const {
    mutate: changeUnitStatus,
    isPending: isChanging,
    isSuccess: is_change_status_unit_success
  } = useChangeUnitStatus({search : searc , sort_order: sortOrder , page , per_page})

  function handleDeleteUnit() {
    if (rowData?.id && deleteModal) {
      deleteUnit({ id: rowData?.id })
    }
  }

  function handleChangeStatus() {
    if (rowData?.id && changeStatusModal) {
      changeUnitStatus({ id: rowData?.id , searc , sort_order: sortOrder , page , per_page })
    }
  }

  const columns = [
  { title: "#", dataIndex: "id", key: "id" },

   {
      title: "Arabic Unit Name",
      key: "name",
      dataIndex: "name",
      render:(_,row) => {
        console.log('row',row?.name?.ar);
        return (
           <p>{row?.name?.ar}</p>
        )
      }
    },
     {
      title: "English Unit Name",
      key: "name",
      dataIndex: "name",
      render:(_,row) => <p>{row?.name?.en}</p>
    },
     {
      title: "Symbol",
      key: "symbol",
      dataIndex: "symbol",
    },
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
      title: "Action",
      render: (_, row) => {
        return (
          <div className='flex gap-2 justify-center items-center'>
            <Button  
            onClick={() => navigate(`/create-unit?id=${row?.id}&name=${`${row?.name?.ar}-${row?.name?.en}`}`)}
            title="Edit" size='icon' variant='ghost'>
              <Edit />
            </Button>

            <Button
              onClick={() => {
                setRowData(row)
                setDeleteModal(true)
              }}
              title="Delete" size='icon' variant='ghost'>
              <Trash />
            </Button>

            <Button
              onClick={() => {
                setRowData(row)
                setChangeStatusModal(true)
              }}
              title="Change Status" size='icon' variant='ghost'>
              <Eye />
            </Button>
          </div>
        )
      }
    }
  // Actions زي ما هي عندك (Edit/Delete/Change Status)
];

  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={data || []}
        loading={loading}
      />

      <DeleteModal isSuccess={is_delete_unit_success} isLoading={isDeleting} onDelete={handleDeleteUnit} open={deleteModal} setOpen={setDeleteModal} title={`This is a  unit #${rowData?.name?.en}?`} desc={"Are you sure you want to delete this item? This action cannot be undone."} />
      <ActiveInActiveStatusModal isSuccess={is_change_status_unit_success} isLoading={isChanging} onSuccess={handleChangeStatus} open={changeStatusModal} setOpen={setChangeStatusModal} title={`This is a  Unit #${rowData?.name?.en}?`} />
    </div>
  )
}
