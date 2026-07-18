import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Card } from '../../../ui/card';
import { Circles } from 'react-loader-spinner';
import { Button } from '../../../ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAddSupplier from '../../../../hooks/suppliers/useAddSupplier';
import useUpdateSupplier from '../../../../hooks/suppliers/useUpdateSupplier';
import { useQuery } from '@tanstack/react-query';
import { handleGetSupplierDetails } from '../../../../services/suppliers';

const SupplierMainInfo = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierMainInfo"))
const SupplierContact = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierContact"))
const SupplierAddress = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierAddress"))
const SupplierPaymentTerms = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierPaymentTerms"))
const SupplierBankAccounts = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierBankAccounts"))

const tabs = [
  { id: "1", name: "General Info", component: <SupplierMainInfo /> },
  { id: "2", name: "Contacts", component: <SupplierContact /> },
  { id: "3", name: "Address", component: <SupplierAddress /> },
  { id: "4", name: "Payment Terms", component: <SupplierPaymentTerms /> },
  // { id: "5", name: "Bank Accounts", component: <SupplierBankAccounts /> },
];

export default function SuppliersTabs() {
  const defaultTab = useMemo(() => tabs[0]?.id ?? "1", []);
  const [selectedTabId, setSelectedTabId] = useState(defaultTab);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const { mutate: addSupplier, isPending: isAdding } = useAddSupplier();
  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier();

  const isPending = isAdding || isUpdating;

  const { data: supplierResponse, isLoading: isSupplierLoading } = useQuery({
    queryKey: ["supplier", editId],
    queryFn: ({ signal }) => handleGetSupplierDetails({ id: editId, signal }),
    enabled: !!editId,
  });

  const method = useForm({
    defaultValues: {
      code: "",
      first_name: "",
      last_name: "",
      name: {
        en: "",
        ar: ""
      },
      company_name: "",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      tax_treatment: "",
      vat_number: "",
      commercial_register: "",
      language: "ar",
      source_of_supply: "SA",
      lead_time_days: "",
      minimum_order_value: "",
      rating: "",
      notes: "",
      is_active: true,
      category_ids: [],
      payment_terms: [
        {
          payment_term_id: "",
          credit_limit: "",
          credit_days: "",
          credit_status: "approved",
          is_default: true
        }
      ],
      addresses: [
        {
          type: "both",
          label: "Main Office",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Saudi Arabia",
          is_default: true
        }
      ],
      contacts: [],
      bank_accounts: []
    }
  });

  // Prepopulate form on Edit
  useEffect(() => {
    if (supplierResponse?.data) {
      const supplier = supplierResponse.data;
      const category_ids_arr = Array.isArray(supplier.categories)
        ? supplier.categories.map(item => item.id.toString())
        : supplier.categories 
          ? [supplier.categories.toString()] 
          : [];

          console.log("supplier", supplier);
      method.reset({
        code: supplier.code || "",
        first_name: supplier.first_name || "",
        last_name: supplier.last_name || "",
        name: {
          en: supplier.name?.en || "",
          ar: supplier.name?.ar || ""
        },
        company_name: supplier.company_name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        mobile: supplier.mobile || "",
        website: supplier.website || "",
        tax_treatment: supplier.tax_treatment || "",
        vat_number: supplier.vat_number || "",
        commercial_register: supplier.commercial_register || "",
        language: supplier.language || "ar",
        source_of_supply: supplier.source_of_supply || "SA",
        lead_time_days: supplier.lead_time_days || "",
        minimum_order_value: supplier.minimum_order_value || "",
        rating: supplier.rating || "",
        notes: supplier.notes || "",
        is_active: supplier.is_active ?? true,
        categories: category_ids_arr,
        payment_terms: supplier.payment_terms && supplier.payment_terms.length > 0 
          ? supplier.payment_terms.map(t => ({
              payment_term_id: t.id?.toString() || "",
              credit_limit: t.credit_limit || "",
              credit_days: t.credit_days || "",
              credit_status: t.credit_status || "approved",
              is_default: t.is_default ?? true
            }))
          : [
              {
                payment_term_id: "",
                credit_limit: "",
                credit_days: "",
                credit_status: "approved",
                is_default: true
              }
            ],
        addresses: supplier.addresses && supplier.addresses.length > 0
          ? supplier.addresses.map(a => ({
              type: a.type || "both",
              label: a.label || "Main Office",
              address_line_1: a.address_line_1 || "",
              address_line_2: a.address_line_2 || "",
              city: a.city || "",
              state: a.state || "",
              postal_code: a.postal_code || "",
              country: a.country || "Saudi Arabia",
              is_default: a.is_default ?? true
            }))
          : [
              {
                type: "both",
                label: "Main Office",
                address_line_1: "",
                address_line_2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "Saudi Arabia",
                is_default: true
              }
            ],
        contacts: supplier.contacts && supplier.contacts.length > 0
          ? supplier.contacts.map(c => ({
              name: c.name || "",
              email: c.email || "",
              phone: c.phone || "",
              mobile: c.mobile || "",
              position: c.position || "",
              is_primary: c.is_primary ?? false
            }))
          : [],
        bank_accounts: supplier.bank_accounts && supplier.bank_accounts.length > 0
          ? supplier.bank_accounts.map(b => ({
              bank_name: b.bank_name || "",
              account_holder_name: b.account_holder_name || "",
              account_number: b.account_number || "",
              iban: b.iban || "",
              swift_code: b.swift_code || "",
              branch: b.branch || "",
              currency: b.currency || "SAR",
              is_primary: b.is_primary ?? true
            }))
          : []
      });
    }
  }, [supplierResponse, method]);

  function onValid(values) {
    // Convert array of string IDs to array of integers
    const processedValues = {
      ...values,
      category_ids: Array.isArray(values.categories)
        ? values.categories.map(id => parseInt(id)).filter(id => !isNaN(id))
        : []
    };
    delete processedValues.categories;

    // Filter out payment terms that have no payment_term_id set
    if (processedValues.payment_terms) {
      processedValues.payment_terms = processedValues.payment_terms.filter(
        term => term.payment_term_id !== "" && term.payment_term_id !== null && term.payment_term_id !== undefined
      );
    }

    if (editId) {
      updateSupplier({ id: editId, body: processedValues }, {
        onSuccess: (data) => {
          if (data?.success) {
            toast.success("Supplier updated successfully");
            navigate('/suppliers');
          }
        }
      });
    } else {
      addSupplier({ body: processedValues }, {
        onSuccess: (data) => {
          if (data?.success) {
            toast.success("Supplier created successfully");
            navigate('/suppliers');
          }
        }
      });
    }
  }

  function onInValid(errors) {
    console.log("errors", errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      toast.error(`Please check the ${firstError} field`);
    }
  }

  if (editId && isSupplierLoading) {
    return (
      <div className="h-[400px] w-full flex justify-center items-center">
        <Circles height="50" width="50" color="#C94544" ariaLabel="circles-loading" visible />
      </div>
    );
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onValid, onInValid)}>
        <Tabs className="gap-0" value={selectedTabId} onValueChange={setSelectedTabId}>
          <TabsList className="bg-white rounded-tl-lg p-0 h-12 rounded-b-none rounded-tr-lg w-fit overflow-x-auto max-w-full">
            {tabs.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex-1 shadow-none! data-[state=active]:shadow-none! rounded-none p-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-secondary data-[state=active]:font-bold text-[#B2B8CF] text-base whitespace-nowrap"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0">
              <Card className="rounded-tl-none px-8 rounded-tr-lg rounded-b-lg shadow-none border-[#E6EFF5] min-h-[400px]">
                <Suspense
                  fallback={
                    <div className="h-full py-6 w-full flex justify-center items-center">
                      <Circles height="50" width="50" color="#C94544" ariaLabel="circles-loading" visible />
                    </div>
                  }
                >
                  {item.component}
                </Suspense>
              </Card>
            </TabsContent>
          ))}

          <div className="flex mt-5 w-fit ms-auto gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/suppliers')}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Supplier"}
            </Button>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  )
}
