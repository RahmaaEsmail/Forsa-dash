import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm, useFieldArray } from 'react-hook-form'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  FileText, 
  Info, 
  CreditCard, 
  FileCheck,
  Percent,
  Calendar,
  Layers
} from 'lucide-react'

// Hooks & Services
import { useQuotationDetails } from '../../hooks/quotations/useQuotationDetails'
import useListPaymentTerms from '../../hooks/paymentTerms/useListPaymentTerms'
import useCreateCustomerInvoice from '../../hooks/customer-invoices/useCreateCustomerInvoice'

// Components
import PageHeader from '../../components/shared/PageHeader'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import CustomInput from '../../components/shared/CustomInput'
import CustomSelect from '../../components/shared/CustomSelect'
import CustomTable from '../../components/shared/CustomTable'
import { Input } from '../../components/ui/input'
import Loading from '../../components/shared/Loading'
import { toast } from 'sonner'

export default function CreateCustomerInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data Fetching
  const { data: quotationResponse, isLoading: isQuotationLoading } = useQuotationDetails(id);
  const { data: paymentTermsResponse, isLoading: isTermsLoading } = useListPaymentTerms();
  const createCustomerInvoice = useCreateCustomerInvoice();

  const quotation = quotationResponse?.data;
  const paymentTerms = paymentTermsResponse?.data || [];

  // Form Setup
  const methods = useForm({
    defaultValues: {
      payment_term_id: "",
      reference_number: "",
      notes: "",
      items: []
    }
  });

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = methods;
  
  const { fields, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Pre-populate Form when Quotation is fetched
  useEffect(() => {
    if (quotation) {
      // Set default payment term if quotation has one, or default to empty
      if (quotation.payment_term_id) {
        setValue("payment_term_id", quotation.payment_term_id.toString());
      }

      const formattedItems = quotation.items?.map(item => ({
        quotation_item_id: item.id,
        item_name: item.item_name || item.item?.name || 'Item',
        quantity: Number(item.quantity) || 0,
        selling_price: Number(item.selling_price) || 0,
        discount_percentage: 0,
        unit_name: item.unit?.name || item.unit_name || ''
      })) || [];

      setValue("items", formattedItems);
    }
  }, [quotation, setValue]);

  // Live updates/computations for totals
  const watchedItems = watch("items") || [];
  
  const calculations = watchedItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.selling_price) || 0;
    const disc = Number(item.discount_percentage) || 0;
    
    const subtotal = qty * price;
    const discountVal = subtotal * (disc / 100);
    const itemTotal = subtotal - discountVal;

    return {
      subtotal: acc.subtotal + subtotal,
      discount: acc.discount + discountVal,
      grandTotal: acc.grandTotal + itemTotal
    };
  }, { subtotal: 0, discount: 0, grandTotal: 0 });

  // Form Submission
  const onSubmit = (values) => {
    if (!values.payment_term_id) {
      toast.error("Please select a payment term.");
      return;
    }

    if (!values.items || values.items.length === 0) {
      toast.error("At least one item must be included in the invoice.");
      return;
    }

    // Build Postman payload structure
    const payload = {
      payment_term_id: Number(values.payment_term_id),
      reference_number: values.reference_number,
      notes: values.notes,
      items: values.items.map(item => ({
        quotation_item_id: Number(item.quotation_item_id),
        quantity: Number(item.quantity),
        discount_percentage: Number(item.discount_percentage) || 0
      }))
    };

    createCustomerInvoice.mutate({ quotationId: id, body: payload }, {
      onSuccess: () => {
        navigate('/customer-invoices');
      }
    });
  };

  if (isQuotationLoading || isTermsLoading) {
    return <Loading />;
  }

  // Format Payment Terms Options for CustomSelect
  const paymentTermsOptions = paymentTerms.map(term => {
    const labelEN = term.name?.en || '';
    const labelAR = term.name?.ar || '';
    const displayLabel = labelEN && labelAR ? `${labelEN} (${labelAR})` : (labelEN || labelAR || term.code || 'Payment Term');
    return {
      value: term.id.toString(),
      label: displayLabel,
      textValue: displayLabel
    };
  });

  const columns = [
    {
      title: "Product / Description",
      className: "text-left px-6 py-4",
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">
            {record.item_name}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Quotation Item ID: {record.quotation_item_id}
          </span>
        </div>
      )
    },
    {
      title: "Unit Price",
      className: "text-right px-6 py-4",
      render: (_, record) => (
        <span className="font-bold text-slate-700 text-sm">
          {record.selling_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quotation?.currency?.code || 'AED'}
        </span>
      )
    },
    {
      title: "Quantity",
      className: "px-6 py-4",
      render: (_, __, index) => (
        <div className="flex items-center gap-2 max-w-[150px]">
          <Input 
            type="number" 
            disabled
            {...register(`items.${index}.quantity`, { valueAsNumber: true, required: true })} 
            className="bg-slate-50 border-none h-11 rounded-xl text-center font-bold w-24 text-slate-800"
          />
          <span className="text-xs text-slate-400 font-bold">{fields[index]?.unit_name}</span>
        </div>
      )
    },
    {
      title: "Discount %",
      className: "px-6 py-4",
      render: (_, __, index) => (
        <div className="relative flex items-center max-w-[120px]">
          <Input 
            type="number" 
            min="0"
            max="100"
            {...register(`items.${index}.discount_percentage`, { valueAsNumber: true })} 
            className="bg-slate-50 border-none h-11 rounded-xl pr-8 text-center font-bold w-24 text-slate-800"
          />
          <Percent className="absolute right-2 w-3.5 h-3.5 text-slate-400" />
        </div>
      )
    },
    {
      title: "Total Amount",
      className: "text-right px-6 py-4",
      render: (_, record) => {
        const qty = Number(record.quantity) || 0;
        const price = Number(record.selling_price) || 0;
        const disc = Number(record.discount_percentage) || 0;
        const total = qty * price * (1 - disc / 100);
        return (
          <span className="font-extrabold text-primary text-sm">
            {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quotation?.currency?.code || 'AED'}
          </span>
        );
      }
    },
    {
      title: "",
      width: "50px",
      render: (_, __, index) => (
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
          onClick={() => remove(index)}
        >
          <Trash2 className="w-4.5 h-4.5" />
        </Button>
      )
    }
  ];

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 pb-16">
        <PageHeader 
          title="Create Customer Invoice" 
          subTitle={`Generate a client invoice directly from Quotation #${quotation?.quotation_number}`}
        >
          <div className="flex gap-3 items-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate('/quotations')}
              className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 gap-2 font-bold hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={createCustomerInvoice.isPending}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {createCustomerInvoice.isPending ? "Generating..." : "Save Invoice"}
            </Button>
          </div>
        </PageHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Columns: Form Fields and Items Table */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* General Info Card */}
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base">Invoice Details</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Define payment terms and references</p>
                </div>
              </div>

              <CardContent className="p-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Payment Term */}
                  <CustomSelect
                    control={control}
                    name="payment_term_id"
                    label="Payment Term"
                    placeholder="Select payment term..."
                    isRequired={true}
                    options={paymentTermsOptions}
                    errors={errors?.payment_term_id}
                  />

                  {/* Reference Number */}
                  <CustomInput 
                    label="Reference Number"
                    name="reference_number"
                    register={register}
                    isRequired={false}
                    placeholder="e.g. PO-CLIENT-2026-001"
                    errors={errors?.reference_number}
                  />
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Notes</label>
                  <textarea
                    {...register("notes")}
                    className="w-full min-h-[120px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                    placeholder="Enter additional terms or note for the customer invoice..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items Table Card */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-none rounded-md px-2 text-xs">
                    Items
                  </Badge>
                  Invoice Line Items
                </h3>
              </div>
              <div className="p-0">
                {fields.length > 0 ? (
                  <CustomTable
                    columns={columns}
                    dataSource={fields}
                    rowKey="id"
                    className="border-none p-0"
                    tableClassName="w-full border-separate border-spacing-0"
                    headerClassName="bg-slate-50/80 text-slate-500 border-b uppercase text-[10px] tracking-wider font-bold py-3.5"
                    rowClassName="border-b last:border-b-0 hover:bg-slate-50/20 transition-colors"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                    <Info className="w-8 h-8 text-slate-300" />
                    No items left in this invoice.
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        const formattedItems = quotation?.items?.map(item => ({
                          quotation_item_id: item.id,
                          item_name: item.item_name || item.item?.name || 'Item',
                          quantity: Number(item.quantity) || 0,
                          selling_price: Number(item.selling_price) || 0,
                          discount_percentage: 0,
                          unit_name: item.unit?.name || item.unit_name || ''
                        })) || [];
                        setValue("items", formattedItems);
                      }}
                      className="mt-2 text-primary border-primary hover:bg-primary/5"
                    >
                      Reload Items from Quotation
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Source Quotation & Totals Summary */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Source Quotation Info Card */}
            <Card className="p-0 border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <div className="p-5 border-b bg-slate-50/50 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-base">Quotation Info</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Reference source details</p>
                </div>
              </div>

              <CardContent className="p-6 flex flex-col gap-4 text-sm text-slate-600">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-medium text-slate-400">Quotation Number</span>
                  <span className="font-bold text-slate-800">#{quotation?.quotation_number}</span>
                </div>
                <div className="flex justify-between items-start py-2 border-b border-slate-50">
                  <span className="font-medium text-slate-400">Customer</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {quotation?.customer?.company_name || quotation?.customer?.name?.trim() || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-medium text-slate-400">Quotation Date</span>
                  <span className="font-semibold text-slate-800">
                    {quotation?.quotation_date || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="font-medium text-slate-400">Total Amount</span>
                  <span className="font-bold text-slate-800">
                    {Number(quotation?.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {quotation?.currency?.code}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-slate-400">Status</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none capitalize px-2 py-0.5 rounded-md text-[10px]">
                    {quotation?.status?.replace(/_/g, ' ')}
                  </Badge>
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
