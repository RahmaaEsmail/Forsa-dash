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

export default function CategoriesTable({ searc,  sortOrder, page,per_page,  data, loading }) {
  // navigate 
  const navigate = useNavigate();
  
  // modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);

  // data
  const [rowData, setRowData] = useState({});
  const {
    mutate: deleteCategory,
    isPending: isDeleting,
    isSuccess: is_delete_category_success
  } = useDeleteCategory({ search: searc , sort_order: sortOrder , page , per_page})

  const {
    mutate: changeCategoryStatus,
    isPending: isChanging,
    isSuccess: is_change_status_category_success
  } = useChangeCategoryStatus({search : searc , sort_order: sortOrder , page , per_page})

  function handleDeleteCategory() {
    if (rowData?.id && deleteModal) {
      deleteCategory({ id: rowData?.id })
    }
  }

  function handleChangeStatus() {
    if (rowData?.id && changeStatusModal) {
      changeCategoryStatus({ id: rowData?.id , searc , sort_order: sortOrder , page , per_page })
    }
  }

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Arabic Category Name",
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
      title: "English Category Name",
      key: "name",
      dataIndex: "name",
      render:(_,row) => <p>{row?.name?.en}</p>
    },
    {
      title: "Arabic Category Description",
      key: "description",
      dataIndex: "description",
      render: (_, row) => <p className='text-gray-400 wrap-break-word text-wrap'>{row?.description?.ar}</p>
    },
     {
      title: "English Category Description",
      key: "description",
      dataIndex: "description",
      render: (_, row) => <p className='text-gray-400 wrap-break-word text-wrap'>{row?.description?.en}</p>
    },
    {
      title: "Parent",
      key: "parent",
      dataIndex: "",
      render: (_, row) => row?.parent != null ? <div className='flex flex-col gap-2'>
        <p className='text-black font-bold'>{row?.parent?.name?.en} , {row?.parent?.name?.ar}</p>
        <p className='text-gray-400 wrap-break-word text-wrap'>{row?.parent?.description?.en} , {row?.parent?.description?.ar}</p>
      </div> : <p>----</p>
    },
    {
      title: "Active",
      key: "",
      dataIndex: "",
      render: (_, row) => <Badge
        className={`${row?.is_active == "1" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
      >{row?.is_active == "1" ? "Active" : "Inactive"}</Badge>
    },
    {
      title: "Created At",
      render: (_, row) => <p>{new Date(row?.created_at)?.toLocaleDateString()}</p>
    },
    {
      title: "Action",
      render: (_, row) => {
        return (
          <div className='flex gap-2 items-center'>
            <Button 
            onClick={() => navigate(`/create-categories?id=${row?.id}&name=${`${row?.name?.en}-${row?.name?.ar}`}`)}
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
  ]
  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={data || []}
        loading={loading}
      />

      <DeleteModal isSuccess={is_delete_category_success} isLoading={isDeleting} onDelete={handleDeleteCategory} open={deleteModal} setOpen={setDeleteModal} title={`This is a  product #${rowData?.name?.en || rowData?.name?.ar}?`} desc={"Are you sure you want to delete this item? This action cannot be undone."} />
      <ActiveInActiveStatusModal isSuccess={is_change_status_category_success} isLoading={isChanging} onSuccess={handleChangeStatus} open={changeStatusModal} setOpen={setChangeStatusModal} title={`This is a  product #${rowData?.name?.en || rowData?.name?.ar}?`} />
    </div>
  )
}
