import React from 'react'
import CustomTable from '../../shared/CustomTable'
import { quotationsData } from '../../../utils/quotationsData';
import { Input } from '../../ui/input';
import { Star } from 'lucide-react';

export default function QuotationTable() {
  const columns = [
    {
      key: "reference",
      dataIndex: "reference",
      title: "Reference",
      render: (_, row) => {
        console.log("row", row);
        return <div className='flex gap-2 items-center'>
          <Input type={"checkbox"} className={"w-5 h-5 rounded-3xl border! border-primary!"} />
          <div className='flex gap-1 items-center'>
            <Star size={18} stroke='#F16000' color='#F16000' fill='#F16000' />
            <p>{row?.reference}</p>
          </div>
        </div>
      }
    },
    {
      key: "vendor",
      dataIndex: "vendor",
      title: "Vendor",
    },
    {
      key: "project",
      dataIndex: "project",
      title: "Project",
    },
    {
      key: "purchase_representation",
      dataIndex: "purchase_representation",
      title: "Purchase Representation",
      render: (_, row) => <div className='flex justify-center gap-1 items-center'>
        <img src="/public/images/ix_user-profile-filled.svg" className='w-5 h-5 rounded-full' />
        <p>{row?.purchase_representation}</p>
      </div>
    },
    {
      key: "order_deadline",
      dataIndex: "order_deadline",
      title: "Order Deadline",
      render: (_, row) => <p className='text-[#FF184A]'>{row?.order_deadline}</p>
    },
    {
      key: "total",
      dataIndex: "total",
      title: "Total",
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      render: (_, row) => <p className={`flex justify-center rounded-2xl items-center p-2 font-bold ${row?.status == "RFQ" ? "text-[#155DFC] bg-[#DBEAFE]" : "text-[#F9872E] bg-[#FFEDD4]"}`}>{row?.status}</p>
    },
    {
      key: "invoiced",
      dataIndex: "invoiced",
      title: "Invoiced",
      render: (_, row) => <Input type={"checkbox"} className={"w-5 h-5 rounded-3xl border! border-primary!"} />

    },
  ];


  return (
    <div>
      <CustomTable
        columns={columns}
        dataSource={quotationsData}
      />
    </div>
  )
}
