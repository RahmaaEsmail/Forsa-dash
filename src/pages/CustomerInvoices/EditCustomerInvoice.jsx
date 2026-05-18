import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Info,
  CreditCard,
  Layers,
  User
} from 'lucide-react'
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import CustomInput from '../../components/shared/CustomInput'
import CustomTable from '../../components/shared/CustomTable'
import Loading from '../../components/shared/Loading'
import { toast } from 'sonner'
import useCustomerInvoiceDetails from '../../hooks/customer-invoices/useCustomerInvoiceDetails'
import useUpdateCustomerInvoice from '../../hooks/customer-invoices/useUpdateCustomerInvoice'

export default function EditCustomerInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: invoiceResponse, isLoading } = useCustomerInvoiceDetails(id);
  const updateMutation = useUpdateCustomerInvoice();

  const invoice = invoiceResponse?.data;

  const methods = useForm({
    defaultValues: {
      reference_number: "",
      notes: ""
    }
  });

  const { register, control, handleSubmit, setValue, formState: { errors } } = methods;

  useEffect(() => {
    if (invoice) {
      if (invoice.status !== 'draft') {
        toast.error("Only draft invoices can be edited.");
        navigate(`/customer-invoices/${id}/details`);
        return;
      }
      setValue("reference_number", invoice.reference_number || "");
      setValue("notes", invoice.notes || "");
    }
  }, [invoice, setValue, navigate, id]);

  const onSubmit = (values) => {
    const payload = {
      reference_number: values.reference_number,
      notes: values.notes
    };

    updateMutation.mutate({ id, body: payload }, {
      onSuccess: () => {
        navigate(`/customer-invoices/${id}/details`);
      }
    });
  };

  const columns = [
    {
      title: "Product / Description",
      className: "text-left px-6 py-4",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">
            {record.item_name || record.item?.name || 'N/A'}
          </span>
        </div>
      )
    },
    {
      title: "Quantity",
      className: "text-center px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {Number(record.quantity || 0).toLocaleString()} {record.unit?.name || record.unit_name || ''}
        </span>
      )
    },
    {
      title: "Unit Price",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {Number(record.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    },
    {
      title: "Total Amount",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-extrabold text-primary text-sm">
          {Number(record.line_total || record.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {invoice?.currency?.code || 'SAR'}
        </span>
      )
    }
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 pb-16">
        <PageHeader 
          title="Edit Customer Invoice" 
          subTitle={`Update reference and notes for draft Invoice #${invoice?.invoice_number}`}
        >
          <div className="flex gap-3 items-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate(`/customer-invoices/${id}/details`)}
              className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>

            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Updating..." : "Update Invoice"}
            </Button>
          </div>
        </PageHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Form Fields */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Invoice fields Card */}
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base">Editable Fields</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Reference logs and terms update</p>
                </div>
              </div>

              <CardContent className="p-8 flex flex-col gap-6">
                <div>
                  {/* Reference Number */}
                  <CustomInput 
                    label="Reference Number"
                    name="reference_number"
                    register={register}
                    isRequired={false}
                    placeholder="e.g. PO-CLIENT-2026-001-REV"
                    errors={errors?.reference_number}
                  />
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Notes</label>
                  <textarea
                    {...register("notes")}
                    className="w-full min-h-[120px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                    placeholder="Enter updated terms or note for the customer invoice..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Read-only Line Items Preview */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-base">Line Items Preview (Read Only)</h3>
              </div>
              <div className="p-0">
                <CustomTable
                  columns={columns}
                  dataSource={invoice?.items || []}
                  rowKey="id"
                  className="border-none p-0 animate-pulse-none"
                  tableClassName="w-full border-separate border-spacing-0 opacity-80"
                  headerClassName="bg-slate-50/80 text-slate-500 border-b uppercase text-[10px] tracking-wider font-bold py-3.5"
                  rowClassName="border-b last:border-b-0"
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Customer & Summary Info Card */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Customer Details Card */}
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base">Customer Profile</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Reference client contact</p>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
                <div className="flex justify-between items-start py-2 border-b border-slate-50 gap-2">
                  <span className="font-medium text-slate-400 shrink-0">Company</span>
                  <span className="font-bold text-slate-800 text-right leading-snug">
                    {invoice?.customer?.company_name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 gap-2">
                  <span className="font-medium text-slate-400 shrink-0">Email</span>
                  <span className="font-semibold text-slate-700 text-right truncate">
                    {invoice?.customer?.email || 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Calculations Summary Card */}
            
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
