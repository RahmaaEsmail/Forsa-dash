import React from 'react'
import HomeTable from './HomeTable'
import { Partners, projectsSpending, top5SupplierValue } from '../../../../utils/homeData'

export default function HomeTables() {
  return (
    <div className='flex flex-col gap-5'>
      <div className='grid grid-cols-2 gap-4'>
        <HomeTable
          headerTitle={<>
            <img
              src="/images/carbon_sales-ops.svg"
              className="w-4 h-4"
              alt=""
            />
            <span>{"Vendors"}</span>
          </>}
          data={top5SupplierValue} title='Top 5 supplier value' />
        <HomeTable
          headerTitle={"Project"}
          data={projectsSpending} title='Projects spending' />
      </div>
      <HomeTable
        data={Partners}
        headerTitle={"Partner"}
        title='Payment sheet, dues, with top 5 suppliers' />
    </div>
  )
}
