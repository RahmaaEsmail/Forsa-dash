import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomersTable from '../../components/pages/Customers/CustomersTable';
import { useQuery } from '@tanstack/react-query';
import getCustomerOptions from '../../hooks/customers/getCustomerOptions';
import { useCustomerStore } from '../../store/zustand/customerStore';
import Pagination from '../../components/shared/Pagination';
import CustomerFilterations from '../../components/pages/Customers/CustomerFilterations';

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

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Customers"}
        subTitle={
          "Manage all Customers, control visibility, and keep customer data up to date."
        }
      >
        <Button
          onClick={() => navigate("/create-customer")}
          className={"px-3!"}>
          <Plus />
          <span>Add new Customer</span>
        </Button>
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
