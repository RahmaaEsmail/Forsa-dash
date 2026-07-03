import React, { useState } from 'react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Download, Plus } from 'lucide-react'
import RFQTable from '../../components/pages/RFQs/RFQTable'
import RFQStatusTabs from '../../components/pages/RFQs/RFQStatusTabs'
import RFQFilter from '../../components/pages/RFQs/RFQFilter'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { exportToExcel } from '../../utils/exportToExcel'

const RFQ_COL_MAP = {
  rfq_number: 'RFQ Number',
  'supplier.company_name': 'Supplier',
  'purchase_request.pr_number': 'PR Number',
  'customer.company_name': 'Customer',
  status: 'Status',
  total_amount: 'Total Amount',
  'currency.code': 'Currency',
  created_at: 'Created At',
};

export default function RFQs() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("rfq");
  const [filters, setFilters] = useState({});
  const [rfqData, setRfqData] = useState([]);
  const [poData, setPoData] = useState([]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleExport = () => {
    const data = activeView === 'rfq' ? rfqData : poData;
    const label = activeView === 'rfq' ? 'rfqs' : 'purchase_orders';
    exportToExcel(data, label, RFQ_COL_MAP);
  };

  return (
    <div className="flex pb-6 flex-col gap-8">
      <PageHeader title={"Request for Quotation"}>
        <div className='flex gap-2 items-center'>
          <Button
            variant="outline"
            className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </PageHeader>

      {/* <RFQStatusTabs /> */}

      <RFQFilter onFilter={handleFilter} onReset={handleReset} />

      <div className="px-5">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl w-fit flex gap-1 mb-8 border border-slate-200">
            <TabsTrigger 
              value="rfq" 
              className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-sm"
            >
              RFQ
            </TabsTrigger>
            <TabsTrigger 
              value="po" 
              className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-sm"
            >
              Purchase Order
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rfq" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <RFQTable view="rfq" filters={filters} onDataLoaded={setRfqData} />
            </div>
          </TabsContent>
          
          <TabsContent value="po" className="mt-0">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <RFQTable view="po" filters={filters} onDataLoaded={setPoData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
