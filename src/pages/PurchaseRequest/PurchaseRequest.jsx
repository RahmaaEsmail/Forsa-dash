import React from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Download } from 'lucide-react'
import QuotationsFilter from '../../components/pages/PurchaseRequests/PurchaseRequestFilter'
import QuotationStats from '../../components/pages/PurchaseRequests/PurchaseRequestStats'
import QuotationTable from '../../components/pages/PurchaseRequests/PurchaseRequestTable'
import { useNavigate } from 'react-router-dom'

import purchaseRequestOptions from '../../hooks/purchaseRequest/purchaseRequestOptions'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function PurchaseRequest() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState({ search: "", date: "", status: "" });
  
  const cleanFilter = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filter).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
    );
  }, [filter])

  const { data: purchase_data } = useQuery(purchaseRequestOptions({ page, per_page: 10, ...cleanFilter }));
  

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Purchase Request"}>
        <div className='flex gap-2 items-center'>
          {/* <Button className={"bg-white hover:bg-primary hover:text-white border border-primary text-primary font-bold"}>
            <Download />
            <span>Download</span>
          </Button> */}

          <Button 
          onClick={() => navigate(`/create_purchase_request`)}
          className={"font-bold"}>Create</Button>
        </div>
        </PageHeader>

        <QuotationsFilter filter={filter} setFilter={setFilter} />
        {/* <QuotationStats stats={purchase_data?.statistics} /> */}
        <QuotationTable page={page} setPage={setPage} purchase_data={purchase_data} />
    </div>
  )
}
