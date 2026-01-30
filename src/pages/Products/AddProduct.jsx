import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AddProductTabs from '../../components/pages/Products/AddProduct/AddProductTabs';

export default function AddProduct() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-10 pb-6'>
      <PageHeader title={"Add new Product"} subTitle={"Create a new building material item, define its category, pricing, and procurement details."}
      >
        <Button
          onClick={() => navigate(`/products`)}
          className={"px-3!"}>
          <ArrowLeft />
          <span>Back to Product Catalog</span>
        </Button>
      </PageHeader>

      <div>
        <AddProductTabs/>
      </div>
    </div>
  )
}
