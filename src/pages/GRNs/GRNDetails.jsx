import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import {
  useGRNDetails,
  useApproveGRN,
  useRejectGRN,
} from "../../hooks/grns/useGRNs";
import useListSettings from "../../hooks/Settings/useListSettings";
import Loading from "../../components/shared/Loading";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import CustomTable from "../../components/shared/CustomTable";
import {
  Edit,
  FileText,
  ChevronRight,
  CheckCircle,
  XCircle,
  Printer,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { downloadAsPDF } from "../../utils/downloadPDF";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const safeText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

export default function GRNDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: grnResponse, isLoading } = useGRNDetails(id);
  const { data: settingsData } = useListSettings();
  const approveGRN = useApproveGRN();
  const rejectGRN = useRejectGRN();
  const [rejectReason, setRejectReason] = React.useState("");
  const [isRejectOpen, setIsRejectOpen] = React.useState(false);

  const getSetting = (key) =>
    settingsData?.data?.find((s) => s.key === key)?.value;
  const companyPhone =
    getSetting("phone") || getSetting("company_phone") || "+966 55 598 0730";
  const companyEmail =
    getSetting("email") ||
    getSetting("company_email") ||
    "procurement@forsa.com";
  const companyVat =
    getSetting("vat") || getSetting("vat_number") || "300123456700003";
  const companyAddress =
    getSetting("address") ||
    getSetting("company_address") ||
    "King Fahd Road, Olaya District, Riyadh 12211";

  const handleDownloadPDF = async () => {
    const element = document.getElementById("printable-grn-area");
    if (!element) return;
    const grnNumber = grn?.grn_number || id;
    await downloadAsPDF(element, {
      filename: `GRN-${grnNumber}.pdf`,
      margin: [10, 10, 10, 10],
    });
  };

  if (isLoading) return <Loading />;

  const grn = grnResponse?.data;

  const totalReceived =
    grn?.items?.reduce(
      (acc, item) => acc + (Number(item.quantity_received) || 0),
      0,
    ) || 0;
  const totalAccepted =
    grn?.items?.reduce(
      (acc, item) => acc + (Number(item.quantity_accepted) || 0),
      0,
    ) || 0;
  const totalRejected =
    grn?.items?.reduce(
      (acc, item) => acc + (Number(item.quantity_rejected) || 0),
      0,
    ) || 0;

  const columns = [
    {
      title: "Product",
      className: "text-left px-6",
      render: (_, record) => (
        <div className="text-left font-medium text-slate-900">
          {record.item?.name || record.item_name || "Item"}
          {record.sku && (
            <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider mt-0.5">
              {record.sku}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Expected",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center text-slate-600">
          {record.quantity_expected}{" "}
          <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      ),
    },
    {
      title: "Received",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-slate-900">
          {record.quantity_received}{" "}
          <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      ),
    },
    {
      title: "Accepted",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-emerald-600">
          {record.quantity_accepted}{" "}
          <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      ),
    },
    {
      title: "Rejected",
      className: "px-6",
      render: (_, record) => (
        <div className="text-center font-bold text-red-600">
          {record.quantity_rejected}{" "}
          <span className="text-xs text-slate-400">{record.unit?.name}</span>
        </div>
      ),
    },
    {
      title: "Status",
      className: "px-6",
      render: (_, record) => (
        <Badge
          variant="outline"
          className={`capitalize text-[10px] font-bold ${
            record.status === "accepted"
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : record.status === "rejected"
                ? "text-red-600 border-red-200 bg-red-50"
                : ""
          }`}
        >
          {record.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          #printable-grn-area-wrapper {
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-grn-area-wrapper * { visibility: visible !important; }
          @page { size: A4; margin: 0; }
        }
      `,
        }}
      />

      <div className="mx-auto max-w-7xl space-y-6 no-print">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate("/grns")}
          >
            GRNs
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">GRN Details</span>
        </div>

        <PageHeader
          title={`GRN #${grn?.grn_number || id}`}
          subTitle="Detailed view of received goods from supplier."
        >
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2"
            >
              <Printer className="w-4 h-4" /> Download PDF
            </Button>

            {grn?.status === "draft" && (
              <>
                <Button
                  onClick={() => navigate(`/grns/${id}/edit`)}
                  className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>

                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 px-6 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reject GRN</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this Goods
                        Received Note.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="min-h-[100px] rounded-xl border-slate-200"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        disabled={!rejectReason || rejectGRN.isPending}
                        onClick={() => {
                          rejectGRN.mutate(
                            { id, reason: rejectReason },
                            {
                              onSuccess: () => {
                                setIsRejectOpen(false);
                                setRejectReason("");
                              },
                            },
                          );
                        }}
                      >
                        {rejectGRN.isPending
                          ? "Rejecting..."
                          : "Confirm Rejection"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to approve this GRN?",
                      )
                    ) {
                      approveGRN.mutate({ id });
                    }
                  }}
                  disabled={approveGRN.isPending}
                  className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg shadow-emerald-200/50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {approveGRN.isPending ? "Approving..." : "Approve GRN"}
                </Button>
              </>
            )}
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Status
                  </p>
                  <Badge className="capitalize px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 border-none font-bold">
                    {grn?.status?.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Received Date
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    {grn?.received_date}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Purchase Order / RFQ
                  </p>
                  <p className="text-base font-bold text-primary">
                    #{grn?.rfq?.rfq_number}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Supplier
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    {grn?.rfq?.supplier?.company_name}
                  </p>
                </div>
              </div>

              {grn?.supplier_reference && (
                <div className="pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    Supplier Reference Document
                  </p>
                  <a
                    href={grn.supplier_reference}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl w-fit text-primary font-bold hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <FileText className="w-5 h-5" />
                    View Delivery Note / Document
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl h-fit">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                GRN Summary
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">
                    Total Items:
                  </span>
                  <span className="font-bold text-slate-900">
                    {grn?.items?.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">
                    Total Received:
                  </span>
                  <span className="font-bold text-slate-900">
                    {totalReceived}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium text-emerald-600">
                    Total Accepted:
                  </span>
                  <span className="font-bold text-emerald-600">
                    {totalAccepted}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium text-red-600">
                    Total Rejected:
                  </span>
                  <span className="font-bold text-red-600">
                    {totalRejected}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            Received Items List
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-2 py-0.5"
            >
              {grn?.items?.length}
            </Badge>
          </h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <CustomTable
              columns={columns}
              dataSource={grn?.items || []}
              rowKey="id"
              className="border-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINT CANVAS — GOODS RECEIVED NOTE                                        */}
      {/* ========================================================================= */}
      <div id="printable-grn-area-wrapper" className="bg-white py-6">
        <div
          className="max-w-[850px] mx-auto bg-white p-12 border border-slate-200 rounded-sm"
          id="printable-grn-area"
        >
          {/* Brand Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div>
              <img
                src="/images/LOGO.svg"
                className="h-20 w-36 object-cover mb-2"
                alt="Logo"
              />
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              <h2 className="font-extrabold text-sm text-slate-900 tracking-wide">
                FORSA TRADING & CONTRACTING
              </h2>
              <p>
                {companyAddress} | VAT: {companyVat}
              </p>
              <p>Procurement Hub Stream &nbsp;|&nbsp; email: {companyEmail}</p>
            </div>
          </div>

          {/* Document Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight uppercase border-b pb-2 flex justify-between">
            <span>GOODS RECEIVED NOTE</span>
            <span className="text-slate-400 font-normal text-xs font-mono">
              STATUS: {safeText(grn?.status).toUpperCase().replace(/_/g, " ")}
            </span>
          </h3>

          {/* Reference Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] space-y-1">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1 flex items-center gap-1">
                <Package className="w-3 h-3 text-slate-400" /> Supplier
              </h4>
              <p>
                <span className="text-slate-400">Company:</span>{" "}
                <strong className="text-slate-800">
                  {safeText(grn?.rfq?.supplier?.company_name)}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">VAT No:</span>{" "}
                {safeText(grn?.rfq?.supplier?.vat_number)}
              </p>
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                {safeText(grn?.rfq?.supplier?.email)}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] space-y-1">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">
                Registry Data
              </h4>
              <p>
                <span className="text-slate-400">GRN Number:</span>{" "}
                <strong>{safeText(grn?.grn_number)}</strong>
              </p>
              <p>
                <span className="text-slate-400">Received Date:</span>{" "}
                <strong>{formatDate(grn?.received_date)}</strong>
              </p>
              <p>
                <span className="text-slate-400">Linked PO / RFQ:</span>{" "}
                <strong>
                  #{safeText(grn?.rfq?.po_number || grn?.rfq?.rfq_number)}
                </strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-2">
            Received Items
          </h4>
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-400 text-[10px] font-bold text-slate-800 uppercase bg-slate-50">
                <th className="py-2 px-1 w-8 text-center">No.</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2 text-center">Unit</th>
                <th className="py-2 px-2 text-right">Expected</th>
                <th className="py-2 px-2 text-right">Received</th>
                <th className="py-2 px-2 text-right">Accepted</th>
                <th className="py-2 px-2 text-right">Rejected</th>
                <th className="py-2 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
              {grn?.items?.map((item, index) => (
                <tr key={item.id || index} className="align-top">
                  <td className="py-3 px-1 text-center text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-slate-900 block">
                      {item.item?.name || item.item_name}
                    </span>
                    {item.sku && (
                      <span className="text-[9px] text-slate-400 font-mono block uppercase">
                        SKU: {item.sku}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-500">
                    {safeText(item.unit?.name)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    {item.quantity_expected ?? "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-bold font-mono">
                    {item.quantity_received ?? "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-emerald-700 font-mono">
                    {item.quantity_accepted ?? "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-red-600 font-mono">
                    {item.quantity_rejected ?? "—"}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {safeText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-72 space-y-1.5 text-[11px] border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-500 px-2">
                <span>Total Items</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {grn?.items?.length ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 px-2">
                <span>Total Received</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {totalReceived}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 px-2">
                <span>Total Accepted</span>
                <span className="font-semibold font-mono">{totalAccepted}</span>
              </div>
              <div className="flex justify-between text-red-600 px-2">
                <span>Total Rejected</span>
                <span className="font-semibold font-mono">{totalRejected}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {grn?.notes && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 text-[11px]">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] mb-1">
                Notes
              </h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {grn.notes}
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 text-center text-[11px] font-bold text-slate-700 pt-12 border-t border-slate-200 mt-12">
            <div className="space-y-10">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Warehouse / Receiving Officer</p>
            </div>
            <div className="space-y-10">
              <div className="h-px bg-slate-200 mx-4"></div>
              <p>Authorized Approver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
