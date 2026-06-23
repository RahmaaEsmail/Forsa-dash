import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'
import RFQTable from '../../components/pages/RFQs/RFQTable'
import RFQFilter from '../../components/pages/RFQs/RFQFilter'
import usePurchaseDetails from '../../hooks/purchaseRequest/usePurchaseDetails'
import Loading from '../../components/shared/Loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { handleGetAllQuotations } from '../../services/quotations'
import QuotationTable from '../../components/pages/Quotations/QuotationTable'

export default function PRRFQs() {
  const { prId } = useParams();
  const navigate = useNavigate();
  const { mutate: fetchPR, data: prData, isPending: isPRLoading } = usePurchaseDetails();
  const [activeView, setActiveView] = useState("rfq");
  const [filters, setFilters] = useState({});
  const [quotationPage, setQuotationPage] = useState(1);

  const { data: quotationsData, isLoading: isQuotationsLoading } = useQuery({
    queryKey: ["quotations", prId, quotationPage],
    queryFn: ({ signal }) => handleGetAllQuotations({ purchase_request_id: prId, page: quotationPage, per_page: 15, signal }),
    enabled: !!prId,
  });

  useEffect(() => {
    if (prId) fetchPR({ id: prId });
  }, [prId, fetchPR]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  if (isPRLoading) return <Loading />;

  return (
    <div className="flex pb-6 flex-col gap-8">
      <PageHeader 
        title={`RFQs for PR #${prData?.data?.pr_number || prId}`}
        subTitle="Manage requests for quotation and purchase orders related to this purchase request"
      >
        <div className='flex gap-2 items-center'>
          <Button 
            variant="outline"
            onClick={() => navigate(`/purchase_request_details/${prId}`)}
            className={"font-bold flex items-center gap-2 text-primary border-primary hover:bg-primary/5"}
          >
            Back to PR Details
          </Button>
          <Button 
            onClick={() => navigate(`/purchase-requests/${prId}/create-rfq`)}
            className={"font-bold flex items-center gap-2"}>
            <Plus className="w-4 h-4" />
            Create RFQ
          </Button>
        </div>
      </PageHeader>

      <RFQFilter onFilter={handleFilter} onReset={handleReset} filters={filters} />

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
            <TabsTrigger
              value="quotations"
              className="rounded-lg px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-sm"
            >
              Quotations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rfq" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <RFQTable prId={prId} view="rfq" filters={filters} />
            </div>
          </TabsContent>

          <TabsContent value="po" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <RFQTable prId={prId} view="po" filters={filters} />
            </div>
          </TabsContent>

          <TabsContent value="quotations" className="mt-0">
            <QuotationTable
              data={quotationsData}
              isLoading={isQuotationsLoading}
              page={quotationPage}
              setPage={setQuotationPage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
