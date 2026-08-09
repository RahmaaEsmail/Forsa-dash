import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Register Arabic font
Font.register({
  family: "Cairo",
  src: "https://fonts.gstatic.com/s/cairo/v20/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgsQQ.ttf",
});

// Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 130,
    paddingHorizontal: 35,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#C94544",
    paddingBottom: 12,
    marginBottom: 18,
  },
  logo: {
    width: 100,
    height: 45,
    objectFit: "contain",
  },
  companyInfo: {
    textAlign: "right",
    fontSize: 8,
    color: "#666666",
    lineHeight: 1.5,
    maxWidth: "55%",
  },
  companyName: {
    fontSize: 9,
    fontWeight: "extrabold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  // Title
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C94544",
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  // Cards Grid
  cardsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 6,
    padding: 10,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#C94544",
    marginBottom: 5,
  },
  cardLabel: {
    fontSize: 7.5,
    color: "#999999",
    marginBottom: 1,
  },
  cardValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  cardText: {
    fontSize: 8,
    color: "#555555",
    marginBottom: 1,
  },
  // Table
  table: {
    marginTop: 8,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f3f5",
    borderBottomWidth: 2,
    borderBottomColor: "#dee2e6",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 8,
    fontWeight: "bold",
    color: "#495057",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f3f5",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
    minHeight: 30,
  },
  colNo: { width: "6%", textAlign: "center", fontSize: 8 },
  colDesc: { width: "34%", paddingRight: 4 },
  colQty: { width: "8%", textAlign: "center", fontSize: 8 },
  colUnit: { width: "10%", textAlign: "center", fontSize: 8 },
  colPrice: { width: "18%", textAlign: "right", fontSize: 8 },
  colTotal: {
    width: "18%",
    textAlign: "right",
    fontSize: 8,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 1,
  },
  itemSub: {
    fontSize: 7.5,
    color: "#999999",
    fontStyle: "italic",
  },
  // Totals
  totalsContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 12,
  },
  totalsBox: {
    width: "55%",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 9,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#C94544",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "extrabold",
    color: "#C94544",
  },
  currencySmall: {
    fontSize: 7,
    color: "#999999",
    fontWeight: "normal",
  },
  // Terms
  termsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 12,
  },
  termsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 7.5,
    color: "#666666",
    lineHeight: 1.5,
    marginBottom: 1,
  },
  // Signatures
  signatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    marginTop: 4,
  },
  signatureBox: {
    alignItems: "center",
    flex: 1,
  },
  signatureLine: {
    width: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#495057",
  },
  signatureStamp: {
    backgroundColor: "#fef2f2",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  signatureStampText: {
    color: "#C94544",
    fontWeight: "extrabold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // FOOTER - Fixed on every page
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    backgroundColor: "#C94544",
    borderRadius: 6,
    padding: 10,
  },
  footerContent: {
    flexDirection: "column",
    gap: 4,
  },
  footerBankTitle: {
    fontSize: 7.5,
    fontWeight: "extrabold",
    color: "#ffffff",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  footerBanks: {
    flexDirection: "row",
    gap: 6,
  },
  footerBank: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerBankLogo: {
    width: 20,
    height: 20,
    backgroundColor: "#ffffff",
    padding: 2,
    borderRadius: 2,
    objectFit: "contain",
  },
  footerBankInfo: {
    flex: 1,
  },
  footerBankName: {
    fontSize: 7.5,
    fontWeight: "extrabold",
    color: "#ffffff",
    marginBottom: 1,
  },
  footerBankText: {
    fontSize: 6.5,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.3,
  },
  footerBankIban: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#ffffff",
  },
  footerDivider: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    marginVertical: 4,
  },
  footerCompany: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 1,
  },
  footerCompanyDetails: {
    fontSize: 6,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7,
    color: "#999999",
  },
});

// Fixed Footer Component
const FixedFooter = ({
  companyName,
  companyVat,
  companyCrn,
  bankOneName,
  bankOneHolder,
  bankOneIban,
  bankOneImage,
  bankTwoName,
  bankTwoHolder,
  bankTwoIban,
  bankTwoImage,
}) => (
  <View style={styles.footer} fixed>
    <View style={styles.footerContent}>
      <Text style={styles.footerBankTitle}>
        For bank transfer process please use one of the following bank accounts
      </Text>

      <View style={styles.footerBanks}>
        {/* Bank 1 */}
        {(bankOneName || bankOneIban) && (
          <View style={styles.footerBank}>
            {bankOneImage && (
              <Image src={bankOneImage} style={styles.footerBankLogo} />
            )}
            <View style={styles.footerBankInfo}>
              <Text style={styles.footerBankName}>{bankOneName}</Text>
              <Text style={styles.footerBankText}>Name: {bankOneHolder}</Text>
              <Text style={styles.footerBankIban}>IBAN: {bankOneIban}</Text>
            </View>
          </View>
        )}

        {/* Bank 2 */}
        {(bankTwoName || bankTwoIban) && (
          <View style={styles.footerBank}>
            {bankTwoImage && (
              <Image src={bankTwoImage} style={styles.footerBankLogo} />
            )}
            <View style={styles.footerBankInfo}>
              <Text style={styles.footerBankName}>{bankTwoName}</Text>
              <Text style={styles.footerBankText}>Name: {bankTwoHolder}</Text>
              <Text style={styles.footerBankIban}>IBAN: {bankTwoIban}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footerDivider} />

      <Text style={styles.footerCompany}>{companyName}</Text>
      <Text style={styles.footerCompanyDetails}>
        VAT No. {companyVat} &nbsp;&nbsp;&nbsp;&nbsp; CRN. {companyCrn}
      </Text>
    </View>
  </View>
);

// Main PDF Component
export const QuotationPDF = ({ quotation, isProforma, settings }) => {
  const number = isProforma
    ? quotation?.quotation_number?.replace(/^(QUO|QUC)-?/, "PI-") || ""
    : quotation?.quotation_number || "";
  const documentTitle = isProforma ? "Proforma Invoice" : "Quotation";

  const getSetting = (key) => {
    const val = settings?.data?.find((s) => s.key === key)?.value;
    return val === "null" || !val ? null : val;
  };

  const getSettingFileUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value;
    return `https://api.forsa.cloud/${value.replace(/^\//, "")}`;
  };

  const companyName =
    getSetting("company_name") ||
    getSetting("name") ||
    "BRKZ International Information Technology Company";
  const companyAddress =
    getSetting("address") || getSetting("company_address") || "Cairo, Egypt";
  const companyVat =
    getSetting("vat") ||
    getSetting("vat_number") ||
    getSetting("company_tax_number") ||
    "300123456700003";
  const companyCrn =
    getSetting("company_crn") ||
    getSetting("crn") ||
    getSetting("company_registration_number") ||
    getSetting("commercial_register") ||
    "311411370400003";
  const companyPhone =
    getSetting("phone") || getSetting("company_phone") || "+966 55 598 0730";
  const companyEmail =
    getSetting("email") ||
    getSetting("company_email") ||
    "Sales@forsageneraltrading.com";

  const bankOneName =
    getSetting("bank_one_name") ||
    "Saudi National Bank | البنك الأهلي السعودي (SNB)";
  const bankOneHolder =
    getSetting("bank_one_account_holder") ||
    "Company B.R.K.Z. Alalamiyyah for Information Technology";
  const bankOneIban = getSetting("bank_one_iban") || "SA6610000020000000249108";
  const bankOneImage = getSetting("bank_one_image")
    ? getSettingFileUrl(getSetting("bank_one_image"))
    : "/images/snb-logo.png";

  const bankTwoName =
    getSetting("bank_two_name") || "Alrajhi Bank | مصرف الراجحي";
  const bankTwoHolder = getSetting("bank_two_account_holder") || "BRKZ IT CO";
  const bankTwoIban = getSetting("bank_two_iban") || "SA8380000611608010256585";
  const bankTwoImage = getSetting("bank_two_image")
    ? getSettingFileUrl(getSetting("bank_two_image"))
    : "/images/alrajhi-logo.png";

  const termsAndConditionsText =
    getSetting("rfq_terms_and_conditions") ||
    getSetting("terms_and_conditions");

  const formatAmount = (val) => {
    if (!val) return "0.00";
    return parseFloat(val).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const items = quotation?.items || [];
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const startIdx = pageIndex * itemsPerPage;
        const endIdx = Math.min(startIdx + itemsPerPage, items.length);
        const pageItems = items.slice(startIdx, endIdx);
        const isLastPage = pageIndex === totalPages - 1;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Image src="data:image/png;base64,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" style={styles.logo} />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{companyName}</Text>
                <Text>
                  {companyAddress} | VAT: {companyVat}
                </Text>
                <Text style={{ marginTop: 2 }}>
                  📞 {companyPhone} &nbsp;|&nbsp; ✉️ {companyEmail}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{documentTitle}</Text>

            {/* Cards Section - Only on first page */}
            {pageIndex === 0 && (
              <View style={styles.cardsGrid}>
                {/* Bill To */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Bill To</Text>
                  <Text style={[styles.cardValue, { fontSize: 10 }]}>
                    {quotation?.customer?.company_name ||
                      "ABC Construction Co."}
                  </Text>
                  <Text style={styles.cardText}>
                    📍 King Abdullah Road, Al Khobar
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.cardLabel}>Project:</Text> Al Khobar
                    Commercial Complex
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.cardLabel}>Vendor:</Text> Eng. Ahmed
                    Al-Sayed
                  </Text>
                </View>

                {/* Quote Details */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {isProforma ? "Invoice Details" : "Quote Details"}
                  </Text>
                  <View style={{ marginTop: 2 }}>
                    <View style={{ flexDirection: "row", marginBottom: 4 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardLabel}>
                          {isProforma
                            ? "Proforma Invoice No:"
                            : "Quotation No:"}
                        </Text>
                        <Text style={styles.cardValue}>{number}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardLabel}>Date:</Text>
                        <Text style={styles.cardValue}>
                          {quotation?.quotation_date
                            ? format(
                                new Date(quotation.quotation_date),
                                "dd/MM/yyyy",
                              )
                            : "N/A"}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardLabel}>Validity:</Text>
                        <Text style={styles.cardValue}>15 Days</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardLabel}>Currency:</Text>
                        <Text style={styles.cardValue}>
                          {quotation?.currency?.code || "SAR"} (
                          {quotation?.currency?.name || "Saudi Riyal"})
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 6,
                      paddingTop: 6,
                      borderTopWidth: 1,
                      borderTopColor: "#e9ecef",
                    }}
                  >
                    <Text style={styles.cardLabel}>Payment Terms:</Text>
                    <Text style={styles.cardValue}>
                      50% Advance, 50% on Delivery
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colNo}>#</Text>
                <Text style={styles.colDesc}>Description</Text>
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colUnit}>Unit</Text>
                <Text style={styles.colPrice}>Unit Price</Text>
                <Text style={styles.colTotal}>Total</Text>
              </View>

              {pageItems.map((item, index) => (
                <View key={item.id || index} style={styles.tableRow}>
                  <Text style={styles.colNo}>{startIdx + index + 1}</Text>
                  <View style={styles.colDesc}>
                    <Text style={styles.itemName}>
                      {item.item_name || "Steel Rebar"}
                    </Text>
                    <Text style={styles.itemSub}>
                      {item.item?.name || "حديد تسليح"}
                    </Text>
                  </View>
                  <Text style={styles.colQty}>
                    {parseInt(item.quantity) || 0}
                  </Text>
                  <Text style={styles.colUnit}>{item.unit?.name || "Pcs"}</Text>
                  <Text style={styles.colPrice}>
                    {formatAmount(item.selling_price)}
                  </Text>
                  <Text style={styles.colTotal}>
                    {formatAmount(item.line_total)}
                  </Text>
                </View>
              ))}

              {pageItems.length === 0 && (
                <View
                  style={[
                    styles.tableRow,
                    { justifyContent: "center", paddingVertical: 15 },
                  ]}
                >
                  <Text style={{ color: "#999999", fontSize: 9 }}>
                    No items available in this quotation.
                  </Text>
                </View>
              )}
            </View>

            {/* Totals - Only on last page */}
            {isLastPage && (
              <>
                <View style={styles.totalsContainer}>
                  <View style={styles.totalsBox}>
                    <View style={styles.totalRow}>
                      <Text>Subtotal</Text>
                      <Text>
                        {formatAmount(quotation?.subtotal)}{" "}
                        <Text style={styles.currencySmall}>SAR</Text>
                      </Text>
                    </View>
                    <View style={styles.totalRow}>
                      <Text>VAT (15%)</Text>
                      <Text>
                        {formatAmount(quotation?.tax_amount)}{" "}
                        <Text style={styles.currencySmall}>SAR</Text>
                      </Text>
                    </View>
                    <View style={styles.grandTotalRow}>
                      <Text style={styles.grandTotalLabel}>Grand Total</Text>
                      <Text style={styles.grandTotalValue}>
                        {formatAmount(quotation?.total_amount)}{" "}
                        <Text style={{ fontSize: 8 }}>SAR</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Terms & Conditions */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>Terms & Conditions</Text>
                  {termsAndConditionsText ? (
                    <Text style={styles.termsText}>
                      {termsAndConditionsText}
                    </Text>
                  ) : (
                    <>
                      <Text style={styles.termsText}>
                        • Prices are valid for 15 Days from the date of
                        quotation.
                      </Text>
                      <Text style={styles.termsText}>
                        • Delivery within 3-5 working days from PO confirmation.
                      </Text>
                      <Text style={styles.termsText}>
                        • Goods once sold cannot be returned unless
                        manufacturing defect.
                      </Text>
                      <Text style={styles.termsText}>
                        • All disputes subject to Riyadh jurisdiction.
                      </Text>
                    </>
                  )}
                </View>

                {/* Signatures */}
                <View style={styles.signatures}>
                  <View style={styles.signatureBox}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>Received By</Text>
                  </View>
                  <View style={styles.signatureBox}>
                    <View style={styles.signatureStamp}>
                      <Text style={styles.signatureStampText}>
                        Forsa Approved
                      </Text>
                    </View>
                  </View>
                  <View style={styles.signatureBox}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>
                      Authorized Signature
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Page Number */}
            <Text style={styles.pageNumber} fixed>
              Page {pageIndex + 1} of {totalPages}
            </Text>

            {/* Fixed Footer */}
            <FixedFooter
              companyName={companyName}
              companyVat={companyVat}
              companyCrn={companyCrn}
              bankOneName={bankOneName}
              bankOneHolder={bankOneHolder}
              bankOneIban={bankOneIban}
              bankOneImage={bankOneImage}
              bankTwoName={bankTwoName}
              bankTwoHolder={bankTwoHolder}
              bankTwoIban={bankTwoIban}
              bankTwoImage={bankTwoImage}
            />
          </Page>
        );
      })}
    </Document>
  );
};

// Download Button Component
export const DownloadQuotationButton = React.forwardRef(
  ({ quotation, isProforma, settings, children, onDownload }, ref) => {
    return (
      <PDFDownloadLink
        document={
          <QuotationPDF
            quotation={quotation}
            isProforma={isProforma}
            settings={settings}
          />
        }
        fileName={`${isProforma ? "PI" : "QUO"}-${quotation?.quotation_number || "document"}.pdf`}
        ref={ref}
      >
        {({ loading, error }) => {
          if (error) {
            console.error("PDF Generation Error:", error);
            return children;
          }
          return loading ? (
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 gap-2 font-bold hover:bg-slate-50 h-11 px-6 transition-all shadow-sm"
              disabled
            >
              <Download className="w-4 h-4 text-slate-500 animate-pulse" />{" "}
              Generating...
            </Button>
          ) : (
            children
          );
        }}
      </PDFDownloadLink>
    );
  },
);

DownloadQuotationButton.displayName = "DownloadQuotationButton";

export default QuotationPDF;
