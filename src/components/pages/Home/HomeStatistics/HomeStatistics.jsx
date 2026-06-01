import React from 'react'
import StatisticCard from './StatisticsCard'

const formatMoney = (value) => {
  if (value === null || value === undefined) return "0.00";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " SAR";
};

export default function HomeStatistics({ data }) {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {/* Financial Metrics */}
      <StatisticCard 
        title="Total Invoiced" 
        up={true} 
        number={formatMoney(data?.invoices?.total_invoiced)} 
        bgIcon={"#8280FF"} 
        rating={data?.invoices?.total + " Invoices"} 
        icon={"/images/carbon_dashboard.svg"}
      />
      <StatisticCard 
        title="Total Paid" 
        up={true} 
        number={formatMoney(data?.invoices?.total_paid)} 
        bgIcon={"#00B69B"} 
        rating={data?.invoices?.by_status?.paid + " Paid"} 
        icon={"/images/carbon_dashboard.svg"}
      />
      <StatisticCard 
        title="PO Amount" 
        up={true} 
        number={formatMoney(data?.purchase_orders?.total_amount)} 
        bgIcon={"#FBB100"} 
        rating={data?.purchase_orders?.total + " POs"} 
        icon={"/images/icon-park-twotone_transporter.svg"}
      />
      <StatisticCard 
        title="Quotations Amount" 
        up={true} 
        number={formatMoney(data?.quotations?.total_amount)} 
        bgIcon={"#8280FF"} 
        rating={data?.quotations?.total + " Quotes"} 
        icon={"/images/carbon_chart-logistic-regression.svg"}
      />

      {/* Entity Metrics */}
      <StatisticCard 
        title="Purchase Requests" 
        up={true} 
        number={String(data?.purchase_requests?.total || 0)} 
        bgIcon={"#FBB100"} 
        rating={data?.purchase_requests?.by_status?.converted + " Converted"} 
        icon={"/images/icon-park-twotone_transporter.svg"}
      />
      <StatisticCard 
        title="Active RFQs" 
        up={false} 
        number={String(data?.rfqs?.total || 0)} 
        bgIcon={"#00B69B"} 
        rating={data?.rfqs?.by_status?.draft + " Drafts"} 
        icon={"/images/carbon_chart-logistic-regression.svg"}
      />
      <StatisticCard 
        title="Active Customers" 
        up={true} 
        number={String(data?.customers?.active || 0)} 
        bgIcon={"#8280FF"} 
        rating={"Total " + data?.customers?.total} 
        icon={"/images/carbon_dashboard.svg"}
      />
      <StatisticCard 
        title="Active Suppliers" 
        up={true} 
        number={String(data?.suppliers?.active || 0)} 
        bgIcon={"#00B69B"} 
        rating={"Total " + data?.suppliers?.total} 
        icon={"/images/icon-park-twotone_transporter.svg"}
      />
    </div>
  )
}
