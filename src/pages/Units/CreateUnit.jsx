import React, { useEffect } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import AddUnitsForm from '../../components/pages/Units/AddUnitsForm';

export default function CreateUnit() {
  const navigate = useNavigate();
  const location =useLocation();
  const [searchParams] = useSearchParams();
   const nameOfUnit = searchParams.get("name"); // string or null
   const id = searchParams?.get("id");
  return (
   <div className='flex flex-col gap-10 pb-6'>
      <PageHeader title={id ? `Edit Unit #${nameOfUnit}` : "Add new Unit"} subTitle={"Create a new building material item, define its unit"}
      >
        <Button
          onClick={() => navigate(`/units`)}
          className={"px-3!"}>
          <ArrowLeft />
          <span>Back to Units</span>
        </Button>
      </PageHeader>

      <div>
         <AddUnitsForm />
      </div>
    </div>
  )
}
