import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Edit, Eye, Trash, Power } from 'lucide-react';
import CustomTable from '../../shared/CustomTable';
import { Badge } from '../../ui/badge';
import { DeleteModal } from '../../shared/DeleteModal';
import { ActiveInActiveStatusModal } from '../../shared/ActiveInActiveStatusModal';
import { useNavigate } from 'react-router-dom';
import useDeleteCustomer from '../../../hooks/customers/useDeleteCustomer';
import useChangeCustomerStatus from '../../../hooks/customers/useChangeCustomerStatus';

export default function CustomersTable({ data, loading }) {
  const navigate = useNavigate();
  
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const [rowData, setRowData] = useState({});

  const {
    mutate: deleteCustomer,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess
  } = useDeleteCustomer();

  const {
    mutate: changeCustomerStatus,
    isPending: isChangingStatus,
    isSuccess: isChangeStatusSuccess
  } = useChangeCustomerStatus();

  function handleDeleteCustomer() {
    if (rowData?.id) {
      deleteCustomer({ id: rowData?.id });
      setDeleteModal(false);
    }
  }

  function handleChangeStatus() {
     if (rowData?.id) {
        changeCustomerStatus({ id: rowData?.id });
        setChangeStatusModal(false);
     }
  }

  const columns = [
    { title: "#", dataIndex: "id", key: "id" },
    { 
      title: "Type", 
      dataIndex: "customer_type", 
      key: "customer_type",
      render: (t) => (
          <Badge className={t === 'company' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
            {t === 'company' ? "Company" : "Individual"}
          </Badge>
      )
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      render: (_, row) => row.customer_type === 'company' ? row.company_name : `${row.first_name || ''} ${row.last_name || ''}`
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
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
            {/* <Button  
              onClick={() => navigate(`/create-customer?id=${row?.id}`)}
              title="Edit" size='icon' variant='ghost'>
              <Edit />
            </Button> */}

            <Button
              onClick={() => {
                setRowData(row);
                setDeleteModal(true);
              }}
              title="Delete" size='icon' variant='ghost'>
              <Trash />
            </Button>

            <Button
              onClick={() => navigate(`/customer-details/${row?.id}`)}
              title="View Details" size='icon' variant='ghost'>
              <Eye />
            </Button>

            {/* <Button
              onClick={() => {
                setRowData(row);
                setChangeStatusModal(true);
              }}
              title="Change Status" size='icon' variant='ghost'>
              <Power />
            </Button> */}
          </div>
        )
      }
    }
  ];

  const getCustomerName = (row) => row.customer_type === 'company' ? row.company_name : `${row.first_name || ''} ${row.last_name || ''}`;

  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={data || []}
        loading={loading}
      />

      <DeleteModal 
        isSuccess={isDeleteSuccess} 
        isLoading={isDeleting} 
        onDelete={handleDeleteCustomer} 
        open={deleteModal} 
        setOpen={setDeleteModal} 
        title={`This is a customer #${getCustomerName(rowData)}?`} 
        desc={"Are you sure you want to delete this customer? This action cannot be undone."} 
      />
      
      <ActiveInActiveStatusModal 
        isSuccess={isChangeStatusSuccess} 
        isLoading={isChangingStatus} 
        onSuccess={handleChangeStatus} 
        open={changeStatusModal} 
        setOpen={setChangeStatusModal} 
        title={`Change status for #${getCustomerName(rowData)}?`} 
      />
    </div>
  )
}
