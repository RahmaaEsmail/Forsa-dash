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
import ContactLink from '../../shared/ContactLink';

export default function CustomersTable({ data, loading, selectedRowKeys, onSelectedRowKeysChange }) {
  // navigate 
  const navigate = useNavigate();
  
  // modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);

  // data
  const [rowData, setRowData] = useState({});
  const {
    mutate: deleteCustomer,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess
  } = useDeleteCustomer();

  const {
    mutate: changeCustomerStatus,
    isPending: isChanging,
    isSuccess: isChangeStatusSuccess
  } = useChangeCustomerStatus();

  function handleDeleteCustomer() {
    if (rowData?.id && deleteModal) {
      deleteCustomer({ id: rowData?.id });
    }
  }

  function handleChangeStatus() {
    if (rowData?.id && changeStatusModal) {
      changeCustomerStatus({ id: rowData?.id, body: { is_active: !rowData?.is_active } });
    }
  }

  const columns = [
    { title: "#", dataIndex: "id", key: "id" },
    {
      title: "Type",
      dataIndex: "customer_type",
      key: "customer_type",
      render: (v) => (
        <Badge className={v === 'company' ? "bg-blue-105 hover:bg-blue-105/90 text-primary" : "bg-green-105 hover:bg-green-105/90 text-success"}>
          {v === 'company' ? "Company" : "Individual"}
        </Badge>
      )
    },
    { 
      title: "Name", 
      dataIndex: "company_name", 
      key: "company_name",
      render: (_, row) => row.customer_type === 'company' ? row.company_name : `${row.first_name || ''} ${row.last_name || ''}`
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (v) => <ContactLink type="email" value={v} />,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (v) => <ContactLink type="phone" value={v} />,
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (v) => (
        <Badge className={v ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>
          {v ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, row) => {
        return (
          <div className='flex gap-2 justify-center items-center'>
            <Button  
              onClick={() => navigate(`/customer-details/${row?.id}`)}
              title="Details" size='icon' variant='ghost'>
              <Eye className="w-4 h-4" />
            </Button>
            <Button  
              onClick={() => navigate(`/create-customer?id=${row?.id}`)}
              title="Edit" size='icon' variant='ghost'>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setRowData(row);
                setDeleteModal(true);
              }}
              title="Delete" size='icon' variant='ghost' className="hover:text-red-600 hover:bg-red-50">
              <Trash className="w-4 h-4" />
            </Button>
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
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
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
        isLoading={isChanging} 
        onSuccess={handleChangeStatus} 
        open={changeStatusModal} 
        setOpen={setChangeStatusModal} 
        title={`Change status for #${getCustomerName(rowData)}?`} 
      />
    </div>
  )
}
