import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'

export default function CreateQuotation() {
  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Purchase Request"} subTitle={"Create and manage PR forms"}>
        <div className='flex gap-2 items-center'>
          <Button className={"bg-white border border-primary text-primary font-bold"}>
            Discard
          </Button>

          <Button
            className={"font-bold"}>Save Request</Button>
        </div>
      </PageHeader>

      <CreateQuotationForm/>
    </div>
  )
}
