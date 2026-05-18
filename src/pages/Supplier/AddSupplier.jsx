import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import SuppliersTabs from '../../components/pages/Suppliers/AddSupplier/SuppliersTabs'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AddSupplier() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={editId ? "Edit Supplier" : "Create Supplier"}
        subTitle={
          editId 
            ? "Modify supplier information, key contacts, addresses, and payment terms." 
            : "Manage all Suppliers, control visibility, and keep suppliers data up to date."
        }
      >
        <Button
          onClick={() => navigate("/suppliers")}
          className={"px-3!"}>
          <Plus />
          <span>Back To Suppliers</span>
        </Button>
      </PageHeader>

      <SuppliersTabs />
    </div>
  )
}
