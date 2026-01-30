import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Download } from 'lucide-react'
import QuotationsFilter from '../../components/pages/Quotations/QuotationsFilter'
import QuotationStats from '../../components/pages/Quotations/QuotationStats'
import QuotationTable from '../../components/pages/Quotations/QuotationTable'
import { useNavigate } from 'react-router-dom'

export default function Quotations() {
  const navigate = useNavigate();

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Request for Quotation"}>
        <div className='flex gap-2 items-center'>
          <Button className={"bg-white border border-primary text-primary font-bold"}>
            <Download />
            <span>Download</span>
          </Button>

          <Button 
          onClick={() => navigate(`/create_quote`)}
          className={"font-bold"}>Create</Button>
        </div>
        </PageHeader>

        <QuotationsFilter />
        <QuotationStats/>
        <QuotationTable />
    </div>
  )
}
