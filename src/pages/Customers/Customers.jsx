import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomersTable from '../../components/pages/Customers/CustomersTable';
import { useQuery } from '@tanstack/react-query';
import getCustomerOptions from '../../hooks/customers/getCustomerOptions';
import { useCustomerStore } from '../../store/zustand/customerStore';
import Pagination from '../../components/shared/Pagination';
import CustomerFilterations from '../../components/pages/Customers/CustomerFilterations';
import { exportToExcel } from '../../utils/exportToExcel';

export default function Customers() {
  const navigate = useNavigate();
  const { filters, setFilters } = useCustomerStore();
  const { page, per_page, search } = filters;
   
  const {
    data: all_customers,
    isLoading: fetch_customers
  } = useQuery(getCustomerOptions({ page, per_page, search }));

  const totals = all_customers?.meta?.total || 0;

  function handlePageChange(num) {
    setFilters({ page: num });
  }

  const CUSTOMER_COL_MAP = {
    id: '#',
    customer_type: 'Type',
    company_name: 'Company',
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    mobile: 'Mobile',
    is_active: 'Active',
  };

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Customers"}
        subTitle={
          "Manage all Customers, control visibility, and keep customer data up to date."
        }
      >
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
            onClick={() => exportToExcel(all_customers?.data || [], 'customers', CUSTOMER_COL_MAP)}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => navigate("/create-customer")}
            className={"px-3!"}>
            <Plus />
            <span>Add new Customer</span>
          </Button>
        </div>
      </PageHeader>

      <CustomerFilterations />
      
      <CustomersTable 
        data={all_customers?.data}
        loading={fetch_customers}
      />

      <Pagination 
        page={page} 
        per_page={per_page} 
        total={totals}  
        onPageChange={handlePageChange}
      />
    </div>
  );
}
