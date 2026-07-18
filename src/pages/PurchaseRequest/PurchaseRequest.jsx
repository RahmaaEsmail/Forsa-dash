import React from "react";
import PageHeader from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import QuotationsFilter from "../../components/pages/PurchaseRequests/PurchaseRequestFilter";
import QuotationStats from "../../components/pages/PurchaseRequests/PurchaseRequestStats";
import QuotationTable from "../../components/pages/PurchaseRequests/PurchaseRequestTable";
import { useNavigate } from "react-router-dom";
import purchaseRequestOptions from "../../hooks/purchaseRequest/purchaseRequestOptions";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ExportExcelModal from "../../components/shared/ExportExcelModal";

const PR_COL_MAP = {
  pr_number: "PR Number",
  pr_date: "PR Date",
  status: "Status",
  required_date: "Required Date",
  delivery_address: "Delivery Address",
  notes: "Notes",
  rejection_reason: "Rejection Reason",
  cancellation_reason: "Cancellation Reason",
};

export default function PurchaseRequest() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState({
    search: "",
    date: "",
    status: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const cleanFilter = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filter).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
  }, [filter]);

  const { data: purchase_data } = useQuery(
    purchaseRequestOptions({ page, per_page: 10, ...cleanFilter }),
  );

  return (
    <div className="flex pb-6 flex-col gap-10">
      <PageHeader title={"Purchase Request"}>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="border-primary text-primary font-bold hover:bg-primary/5 gap-2"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4" />
            {selectedRowKeys.length > 0
              ? `Export Selected (${selectedRowKeys.length})`
              : "Export Excel"}
          </Button>
          <Button
            onClick={() => navigate(`/create_purchase_request`)}
            className={"font-bold"}
          >
            Create
          </Button>
        </div>
      </PageHeader>

      <QuotationsFilter filter={filter} setFilter={setFilter} />
      {/* <QuotationStats stats={purchase_data?.statistics} /> */}
      <QuotationTable
        page={page}
        setPage={setPage}
        purchase_data={purchase_data}
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
      />

      <ExportExcelModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        data={purchase_data?.data || []}
        selectedRowKeys={selectedRowKeys}
        columnMap={PR_COL_MAP}
        filename="purchase_requests"
      />
    </div>
  );
}
