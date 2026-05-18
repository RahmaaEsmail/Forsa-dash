import React, { useCallback, useState } from 'react'
import useListPaymentTerms from '../../hooks/paymentTerms/useListPaymentTerms'
import Loading from '../../components/shared/Loading';
import PageHeader from '../../components/shared/PageHeader';
import Pagination from '../../components/shared/Pagination';
import { Badge } from '../../components/ui/badge';
import CustomTable from '../../components/shared/CustomTable';
import { Input } from '../../components/ui/input';
import { Search, Filter, CheckCircle2, XCircle, CreditCard, Wallet } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select"

export default function PaymentTerms() {
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const debouncedSearch = useDebounce(search, 500);

  const { data: payment_terms, isLoading } = useListPaymentTerms({
    params: {
      page,
      per_page: perPage,
      search: debouncedSearch,
      is_active: isActiveFilter === "all" ? undefined : (isActiveFilter === "active" ? 1 : 0),
      type: typeFilter === "all" ? undefined : typeFilter,
    }
  });
   
  const columns = [
     {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render:(_,row) => <p>{row?.name?.en}-{row?.name?.ar}</p>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render:(_,row) => <p>{row?.description?.en}-{row?.description?.ar}</p>
    },
        {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
       {
      title: "Default Days",
      dataIndex: "default_days",
      key: "default_days",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (status) => (
        <Badge className={`capitalize px-3 py-1 rounded-full ${status ? "bg-green-100 text-green-700" :  'bg-red-100 text-slate-700'}`}>
          {status ? "Active" : "In Active"}
        </Badge>
      )
    },
  ]

  const handlePageChange = useCallback((pageNum) => {
    setPage(pageNum);
  }, []);

 
  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader
        title={"Payment  Terms"}
        subTitle={
          "Manage all Payment Terms."
        }
      >

      </PageHeader>
      
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search code or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Filter className="w-4 h-4" />
              Status:
            </div>
            <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
              <SelectTrigger className="w-40 h-11 rounded-xl border-slate-100 bg-slate-50/50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active" className="text-emerald-600">Active</SelectItem>
                <SelectItem value="inactive" className="text-slate-400">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <CreditCard className="w-4 h-4" />
              Type:
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 h-11 rounded-xl border-slate-100 bg-slate-50/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Credit
                  </div>
                </SelectItem>
                <SelectItem value="advance">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3 h-3" /> Advance
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* <ProductFilterations setFilter={setFilters} filter={filters} /> */}

      {isLoading ? (
        <Loading />
      ) : (
        <>
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <CustomTable
                    columns={columns}
                    dataSource={payment_terms?.data || []}
                    rowKey="id"
                  />
                </div>
          <Pagination
            total={payment_terms?.meta?.total ?? payment_terms?.data?.length ?? 0}
            page={page}
            per_page={perPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
