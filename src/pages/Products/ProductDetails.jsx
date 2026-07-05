import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Pagination from "../../components/shared/Pagination";
import { useParams } from "react-router-dom";
import useProductDetails from "../../hooks/products/useProductDetails";
import Loading from "../../components/shared/Loading";
import {
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import ActivityLog from "../../layout/ActivityLog/ActivityLog";
import useProductPurchaseHistory from "@/hooks/products/useGetProductPurchaseHistory";
import useProductSalesHistory from "@/hooks/products/useGetProductSalesHistory";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  rfq_sent: "bg-blue-100 text-blue-700",
  buyer_approval: "bg-yellow-100 text-yellow-700",
  price_gathering_approval: "bg-orange-100 text-orange-700",
  po_approval: "bg-purple-100 text-purple-700",
  purchase_ordered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colorClass}`}
    >
      {status?.replace(/_/g, " ")}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
      <PackageSearch className="w-10 h-10 opacity-40" />
      <p className="text-sm font-medium">No {label} found</p>
    </div>
  );
}

// ─── Table Wrapper ────────────────────────────────────────────────────────────
function HistoryTable({
  title,
  icon: Icon,
  color,
  isLoading,
  pagination,
  children,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${color}`}>
        <div className="p-2 rounded-lg bg-white/60">
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-base">{title}</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">{children}</div>
          {pagination && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20">
              {pagination}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Shared th / td classes ───────────────────────────────────────────────────
const TH =
  "px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap";
const TD = "px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap";
const TR = "border-b border-slate-50 hover:bg-slate-50/60 transition-colors";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const {
    mutate: handleGetProductDetails,
    data,
    isPending,
  } = useProductDetails();
  const {
    mutate: handleGetProductPurchaseHistory,
    data: purchase_data,
    isPending: isPurchase_loading,
  } = useProductPurchaseHistory();
  const {
    mutate: handleGetProductSalesHistory,
    data: sales_data,
    isPending: is_sales_loading,
  } = useProductSalesHistory();
  const [showLog, setShowLog] = useState(false);

  const [purchasePage, setPurchasePage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const itemsPerPage = 10;

  const product = data?.data;
  const purchaseRows = purchase_data?.data || [];
  const salesRows = sales_data?.data || [];

  // Hybrid pagination handling
  const hasPurchaseMeta = !!purchase_data?.meta;
  const purchaseTotal = hasPurchaseMeta
    ? purchase_data?.meta?.total || 0
    : purchaseRows.length;
  const displayPurchaseRows = useMemo(() => {
    if (hasPurchaseMeta) return purchaseRows;
    const start = (purchasePage - 1) * itemsPerPage;
    return purchaseRows.slice(start, start + itemsPerPage);
  }, [purchaseRows, purchasePage, hasPurchaseMeta]);

  const hasSalesMeta = !!sales_data?.meta;
  const salesTotal = hasSalesMeta
    ? sales_data?.meta?.total || 0
    : salesRows.length;
  const displaySalesRows = useMemo(() => {
    if (hasSalesMeta) return salesRows;
    const start = (salesPage - 1) * itemsPerPage;
    return salesRows.slice(start, start + itemsPerPage);
  }, [salesRows, salesPage, hasSalesMeta]);

  useEffect(() => {
    if (id) {
      handleGetProductDetails({ id });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      handleGetProductPurchaseHistory({
        id,
        page: purchasePage,
        per_page: itemsPerPage,
      });
    }
  }, [id, purchasePage]);

  useEffect(() => {
    if (id) {
      handleGetProductSalesHistory({
        id,
        page: salesPage,
        per_page: itemsPerPage,
      });
    }
  }, [id, salesPage]);

  if (isPending) return <Loading />;
  if (!product)
    return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="flex h-full min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 pb-6 overflow-y-auto">
        <PageHeader
          title={`Product: ${product.name.en}`}
          subTitle={`Model: ${product.model} | Brand: ${product.brand}`}
        >
          <Button
            variant="outline"
            className={`h-10 px-4 gap-2 font-bold ${showLog ? "bg-primary/10 border-primary text-primary" : "border-slate-300 text-slate-600"}`}
            onClick={() => setShowLog((v) => !v)}
            title="Activity Log"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </PageHeader>

        {/* ── Product Info Card ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-6 rounded-xl shadow-sm">
          {/* Left: Image */}
          <div className="flex flex-col gap-4">
            <img
              src={product.image || "/images/imageplaceholder.png"}
              alt={product.name?.en || "Product Image"}
              className="w-full h-auto rounded-lg border object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/imageplaceholder.png";
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {product.attachments?.map((file, index) => (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  className="text-xs bg-blue-50 text-blue-600 p-2 rounded hover:underline"
                >
                  Attachment {index + 1} (PDF)
                </a>
              ))}
            </div>
          </div>

          {/* Right: Details & Pricing */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {product.name.en}
              </h2>
              <p className="text-gray-500">Category: {product.category.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Selling Price</p>
                <p className="text-xl font-bold text-green-600">
                  {product.selling_price} {product.currency}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Cost Price</p>
                <p className="text-xl font-semibold text-gray-700">
                  {product.cost_price} {product.currency}
                </p>
              </div>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">Stock Status</p>
                <span
                  className={`px-2 py-1 rounded text-xs ${product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {product.status}
                </span>
              </div>
              {product?.minimum_stock && (
                <div>
                  <p className="text-sm text-gray-500">Min Stock</p>
                  <p className="font-medium">{product.minimum_stock}</p>
                </div>
              )}
              {product?.max_stock && (
                <div>
                  <p className="text-sm text-gray-500">Max Stock</p>
                  <p className="font-medium">{product.max_stock}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Available Units</p>
              <div className="flex gap-2 flex-wrap">
                {product.units.map((unit) => (
                  <span
                    key={unit.id}
                    className="border px-3 py-1 rounded-full text-sm"
                  >
                    {unit.name?.en} - {unit?.name?.ar}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Purchase History ───────────────────────────────────────────── */}
        <HistoryTable
          title="Purchase History"
          icon={ShoppingCart}
          color="bg-blue-50 text-blue-700"
          isLoading={isPurchase_loading}
          pagination={
            purchaseTotal > itemsPerPage && (
              <Pagination
                page={purchasePage}
                per_page={itemsPerPage}
                total={purchaseTotal}
                onPageChange={setPurchasePage}
              />
            )
          }
        >
          {displayPurchaseRows.length === 0 ? (
            <EmptyState label="purchase records" />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={TH}>RFQ / PO Number</th>
                  <th className={TH}>Supplier</th>
                  <th className={TH}>Date</th>
                  <th className={TH}>Qty</th>
                  <th className={TH}>Unit Price</th>
                  <th className={TH}>Line Total</th>
                  <th className={TH}>Currency</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayPurchaseRows.map((row, i) => (
                  <tr key={row.rfq_item_id ?? i} className={TR}>
                    <td className={`${TD} font-medium text-primary`}>
                      {row.display_number || row.rfq_number || "—"}
                      {row.po_number && (
                        <span className="ml-2 text-[10px] text-slate-400">
                          PO: {row.po_number}
                        </span>
                      )}
                    </td>
                    <td className={TD}>{row.supplier?.company_name || "—"}</td>
                    <td className={TD}>
                      {row.date ? new Date(row.date).toLocaleDateString() : "—"}
                    </td>
                    <td className={TD}>{row.quantity ?? "—"}</td>
                    <td className={TD}>
                      {row.unit_price != null
                        ? Number(row.unit_price).toLocaleString()
                        : "—"}
                    </td>
                    <td className={`${TD} font-semibold`}>
                      {row.line_total != null
                        ? Number(row.line_total).toLocaleString()
                        : "—"}
                    </td>
                    <td className={TD}>{row.currency?.code || "—"}</td>
                    <td className={TD}>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </HistoryTable>

        {/* ── Sales History ──────────────────────────────────────────────── */}
        <HistoryTable
          title="Sales History"
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-700"
          isLoading={is_sales_loading}
          pagination={
            salesTotal > itemsPerPage && (
              <Pagination
                page={salesPage}
                per_page={itemsPerPage}
                total={salesTotal}
                onPageChange={setSalesPage}
              />
            )
          }
        >
          {displaySalesRows.length === 0 ? (
            <EmptyState label="sales records" />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={TH}>Quotation Number</th>
                  <th className={TH}>Customer</th>
                  <th className={TH}>Date</th>
                  <th className={TH}>Qty</th>
                  <th className={TH}>Selling Price</th>
                  <th className={TH}>Cost Price</th>
                  <th className={TH}>Line Total</th>
                  <th className={TH}>Margin %</th>
                  <th className={TH}>Currency</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {displaySalesRows.map((row, i) => (
                  <tr key={row.quotation_item_id ?? i} className={TR}>
                    <td className={`${TD} font-medium text-primary`}>
                      {row.quotation_number || "—"}
                    </td>
                    <td className={TD}>
                      {row.customer?.company_name || row.customer?.name || "—"}
                    </td>
                    <td className={TD}>
                      {row.date ? new Date(row.date).toLocaleDateString() : "—"}
                    </td>
                    <td className={TD}>{row.quantity ?? "—"}</td>
                    <td className={TD}>
                      {row.selling_price != null
                        ? Number(row.selling_price).toLocaleString()
                        : "—"}
                    </td>
                    <td className={TD}>
                      {row.cost_price != null
                        ? Number(row.cost_price).toLocaleString()
                        : "—"}
                    </td>
                    <td className={`${TD} font-semibold`}>
                      {row.line_total != null
                        ? Number(row.line_total).toLocaleString()
                        : row.total != null
                          ? Number(row.total).toLocaleString()
                          : "—"}
                    </td>
                    <td className={TD}>
                      {row.margin_percentage != null ? (
                        <span
                          className={`font-semibold ${Number(row.margin_percentage) >= 0 ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {Number(row.margin_percentage).toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={TD}>{row.currency?.code || "—"}</td>
                    <td className={TD}>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </HistoryTable>
      </div>

      {/* Activity Log Chat Panel */}
      {showLog && (
        <ActivityLog
          modelType="product"
          modelId={id}
          onClose={() => setShowLog(false)}
        />
      )}
    </div>
  );
}
