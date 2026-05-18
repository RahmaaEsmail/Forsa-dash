import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import CustomersTabs from '../../components/pages/Customers/AddCustomer/CustomersTabs'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AddCustomer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={editId ? "Edit Customer" : "Create Customer"}
        subTitle={
          editId
            ? "Modify customer information, contacts, addresses, and credit terms."
            : "Manage all Customers, control visibility, and keep customer data up to date."
        }
      >
        <Button
          onClick={() => navigate("/customers")}
          className={"px-3!"}>
          <Plus />
          <span>Back To Customers</span>
        </Button>
      </PageHeader>

      <CustomersTabs />
    </div>
  )
}
