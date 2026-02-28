import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AddCategoryForm from '../../components/pages/Categories/AddCategoryForm';

export default function CreateCategory() {
  const navigate = useNavigate();
  const location =useLocation();
  const [searchParams] = useSearchParams();
   const nameOfCategory = searchParams.get("name"); // string or null
   const id = searchParams?.get("id");
  return (
   <div className='flex flex-col gap-10 pb-6'>
      <PageHeader title={id ? `Edit Category #${nameOfCategory}` : "Add new Category"} subTitle={"Create a new building material item, define its category, pricing, and procurement details."}
      >
        <Button
          onClick={() => navigate(`/categories`)}
          className={"px-3!"}>
          <ArrowLeft />
          <span>Back to Categories</span>
        </Button>
      </PageHeader>

      <div>
         <AddCategoryForm />
      </div>
    </div>
  )
}
