import React from 'react'
import CustomTable from '../../shared/CustomTable'
import { Button } from '../../ui/button'
import { Plus } from 'lucide-react'

export default function PurchaseProducts() {
  const columns = [
    {
      dataIndex:"name",
      key:"name",
      title:"Product"
    },
   {
      dataIndex:"desc",
      key:"desc",
      title:"Description"
    },
    {
      dataIndex:"qty",
      key:"qty",
      title:"Qty"
    },
    {
      dataIndex:"uom",
      key:"uom",
      title:"UoM"
    },
    {
      dataIndex:"RFQ/PO_Qty",
      key:"RFQ/PO_Qty",
      title:"RFQ/PO Qty"
    },
    {
      dataIndex:"Status",
      key:"Status",
      title:"Purchase Status"
    },
  ]
  return (
    <div>
      <CustomTable columns={columns}
      dataSource={[]}
      className='border-0 border-none p-0'
      />

     <div className='px-10'>
       <Button variant='default' className={"ms-auto flex justify-end items-end"}>
        <Plus />
        <span>Add Product Line</span>
      </Button>
     </div>
    </div>
  )
}
