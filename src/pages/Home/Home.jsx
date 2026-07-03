import React from 'react'
import HomeStatistics from '../../components/pages/Home/HomeStatistics/HomeStatistics'
import HomeTables from '../../components/pages/Home/HomeTables/HomeTables'
import useListHome from '../../hooks/home/useListHome'
import Loading from '../../components/shared/Loading'
import { Button } from '../../components/ui/button'
import { Download } from 'lucide-react'
import { exportToExcel } from '../../utils/exportToExcel'

export default function Home() {
  const { data, isLoading } = useListHome();
  
  if (isLoading) return <Loading />;
  
  const stats = data?.data || data;

  const handleExportStats = () => {
    if (!stats) return;
    // Flatten nested stats object into a single summary row
    const row = {
      'Total Invoiced (SAR)':       stats?.invoices?.total_invoiced ?? 0,
      'Total Paid (SAR)':           stats?.invoices?.total_paid ?? 0,
      'Total Invoices':             stats?.invoices?.total ?? 0,
      'PO Amount (SAR)':            stats?.purchase_orders?.total_amount ?? 0,
      'Total POs':                  stats?.purchase_orders?.total ?? 0,
      'Quotations Amount (SAR)':    stats?.quotations?.total_amount ?? 0,
      'Total Quotations':           stats?.quotations?.total ?? 0,
      'Purchase Requests':          stats?.purchase_requests?.total ?? 0,
      'PRs Converted':              stats?.purchase_requests?.by_status?.converted ?? 0,
      'Total RFQs':                 stats?.rfqs?.total ?? 0,
      'RFQ Drafts':                 stats?.rfqs?.by_status?.draft ?? 0,
      'Active Customers':           stats?.customers?.active ?? 0,
      'Total Customers':            stats?.customers?.total ?? 0,
      'Active Suppliers':           stats?.suppliers?.active ?? 0,
      'Total Suppliers':            stats?.suppliers?.total ?? 0,
    };
    exportToExcel([row], 'dashboard_summary');
  };

  return (
    <div className='flex flex-col pb-6 gap-5'>
      {/* Export button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
          onClick={handleExportStats}
        >
          <Download className="w-4 h-4" />
          Export Summary
        </Button>
      </div>

      <HomeStatistics data={stats} />
      {/* <HomeTables /> Uncomment or update tables when API provides table data */}
    </div>
  )
}
