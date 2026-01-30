import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import CreateQuotationForm from '../../components/pages/Quotations/CreateQuotationForm'
import { FormProvider, useForm } from 'react-hook-form'

export default function CreateQuotation() {
  const method = useForm({
    defaultValues: {
      client: "",
      requested_by: "",
      location: "",
      approval_date: new Date("2025-06-01"),
      request_date: new Date("2025-06-01"),
      sub_category: "",
      category: "",
    },
  })


  function onSubmit(values) {
   console.log("values", values);
  }

  return (
    <FormProvider {...method}>
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Purchase Request"} subTitle={"Create and manage PR forms"}>
        <div className='flex gap-2 items-center'>
          <Button className={"bg-white hover:bg-primary hover:text-white border border-primary text-primary font-bold"}>
            Discard
          </Button>

          <Button
            className={"font-bold"}>Save Request</Button>
        </div>
      </PageHeader>
      <form  onSubmit={method.handleSubmit()}>
      <CreateQuotationForm/>
      </form>
    </div>
    </FormProvider>
  )
}
