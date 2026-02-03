import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AddProductTabs from '../../components/pages/Products/AddProduct/AddProductTabs';
import useProductDetails from '../../hooks/products/useProductDetails';
import Loading from '../../components/shared/Loading';

export default function AddProduct() {
  const navigate = useNavigate();
  const location =useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const {mutate , data , isPending} = useProductDetails()
   
  useEffect(() => {
    if(id) {
      mutate(id);
    }
  } , [id])

  return (
  isPending ? <Loading />  :  <div className='flex flex-col gap-10 pb-6'>
      <PageHeader title={id ? `Edit Product #${data?.data?.name}` : "Add new Product"} subTitle={"Create a new building material item, define its category, pricing, and procurement details."}
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
