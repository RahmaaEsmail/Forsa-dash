import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Card } from '../../../ui/card';
import { Circles } from 'react-loader-spinner';
import { Button } from '../../../ui/button';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { handleAddCustomer, handleUpdateCustomer } from '../../../../services/customers';
import useGetCustomerDetails from '../../../../hooks/customers/useGetCustomerDetails';

const CustomerMainInfo = lazy(() => import("@/components/pages/Customers/AddCustomer/CustomerMainInfo"));
const CustomerContact = lazy(() => import("@/components/pages/Customers/AddCustomer/CustomerContact"));
const CustomerAddress = lazy(() => import("@/components/pages/Customers/AddCustomer/CustomerAddress"));
const CustomerPaymentTerms = lazy(() => import("@/components/pages/Customers/AddCustomer/CustomerPaymentTerms"));

export default function CustomersTabs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("id");

  const method = useForm({
    defaultValues: {
      customer_type: "company",
      company_name: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      tax_number: "",
      commercial_register: "",
      sales_user_id: "",
      notes: "",
      is_active: true,
      addresses: [{
        type: "both",
        label: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: true
      }],
      contacts: [{
        name: "",
        position: "",
        email: "",
        phone: "",
        mobile: "",
        whatsapp: "",
        is_primary: true,
        receive_notifications: true
      }],
      payment_terms: [{
        payment_term_id: "",
        credit_limit: 0,
        credit_days: 0,
        credit_status: "none",
        is_default: true
      }]
    }
  });

  const { data: customerDetails, isLoading: isFetchingDetails } = useGetCustomerDetails({ id: customerId });

  useEffect(() => {
    if (customerDetails?.data) {
      const d = customerDetails.data;
      method.reset({
        customer_type: d.customer_type || "company",
        company_name: d.company_name || "",
        first_name: d.first_name || "",
        last_name: d.last_name || "",
        email: d.email || "",
        phone: d.phone || "",
        mobile: d.mobile || "",
        website: d.website || "",
        tax_number: d.tax_number || "",
        commercial_register: d.commercial_register || "",
        sales_user_id: d.sales_user_id || "",
        notes: d.notes || "",
        is_active: d.is_active ?? true,
        addresses: d.addresses?.length ? d.addresses.map(a => ({
          type: a.type || "both",
          label: a.label || "",
          address_line_1: a.address_line_1 || "",
          address_line_2: a.address_line_2 || "",
          city: a.city || "",
          state: a.state || "",
          postal_code: a.postal_code || "",
          country: a.country || "",
          is_default: !!a.is_default
        })) : [{ type: "both", label: "", address_line_1: "", address_line_2: "", city: "", state: "", postal_code: "", country: "", is_default: true }],
        contacts: d.contacts?.length ? d.contacts.map(c => ({
          name: c.name || "",
          position: c.position || "",
          email: c.email || "",
          phone: c.phone || "",
          mobile: c.mobile || "",
          whatsapp: c.whatsapp || "",
          is_primary: !!c.is_primary,
          receive_notifications: !!c.receive_notifications
        })) : [{ name: "", position: "", email: "", phone: "", mobile: "", whatsapp: "", is_primary: true, receive_notifications: true }],
        payment_terms: d.payment_terms?.length ? d.payment_terms.map(p => ({
          payment_term_id: p.payment_term_id || "",
          credit_limit: p.credit_limit || 0,
          credit_days: p.credit_days || 0,
          credit_status: p.credit_status || "none",
          is_default: !!p.is_default
        })) : [{ payment_term_id: "", credit_limit: 0, credit_days: 0, credit_status: "none", is_default: true }]
      });
    }
  }, [customerDetails, method]);

  const customerType = useWatch({ control: method.control, name: "customer_type" });

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: "1", name: "General Info", component: <CustomerMainInfo /> },
      { id: "3", name: "Address", component: <CustomerAddress /> },
      { id: "4", name: "Payment Terms", component: <CustomerPaymentTerms /> },
    ];
    if (customerType === 'company') {
      baseTabs.splice(1, 0, { id: "2", name: "Contacts", component: <CustomerContact /> });
    }
    return baseTabs;
  }, [customerType]);

  const [selectedTabId, setSelectedTabId] = useState("1");

  // Keep selected tab in sync if "Contacts" tab is unmounted
  useEffect(() => {
    if (customerType === 'individual' && selectedTabId === "2") {
      setSelectedTabId("1");
    }
  }, [customerType, selectedTabId]);

  const { mutate, isPending } = useMutation({
    mutationFn: customerId ? (data) => handleUpdateCustomer({ id: customerId, body: data }) : handleAddCustomer,
    onSuccess: (res) => {
        toast.success(res?.message || "Customer saved successfully!");
        queryClient.invalidateQueries(["customers"]);
        navigate("/customers");
    },
    onError: (err) => {
        toast.error(err?.response?.data?.error?.message || err?.message || "Failed to save customer");
    }
  });

  function onValid(values) {
    const payload = {
        ...values,
        payment_terms: values.payment_terms.map(t => ({
           ...t,
           payment_term_id: Number(t.payment_term_id) || undefined,
           credit_limit: Number(t.credit_limit) || 0,
           credit_days: Number(t.credit_days) || 0,
        }))
    };
    
    // Clean up irrelevant payload data
    if (customerType === 'individual') {
        payload.company_name = undefined;
        payload.tax_number = undefined;
        payload.commercial_register = undefined;
        payload.website = undefined;
        payload.contacts = undefined;
    } else {
        payload.first_name = undefined;
        payload.last_name = undefined;
        payload.sales_user_id = undefined;
    }
    
    mutate({ body: payload });
  }

  if (customerId && isFetchingDetails) {
    return (
      <div className="flex h-64 items-center justify-center w-full">
        <Circles height="50" width="50" color="#C94544" ariaLabel="circles-loading" visible />
      </div>
    );
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onValid)}>
        <Tabs className="gap-0" value={selectedTabId} onValueChange={setSelectedTabId}>
          <TabsList className="bg-white rounded-tl-lg p-0 h-12 rounded-b-none rounded-tr-lg w-fit">
            {tabs.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex-1 shadow-none! data-[state=active]:shadow-none! rounded-none p-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-secondary data-[state=active]:font-bold text-[#B2B8CF] text-base"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0 ">
              <Card className="rounded-tl-none px-8 rounded-tr-lg rounded-b-lg shadow-none border-[#E6EFF5] min-h-[300px]">
                <Suspense
                  fallback={
                    <div className="h-full py-6 w-full flex justify-center">
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
              className="border border-primary bg-white text-primary hover:bg-primary hover:text-white"
              onClick={() => navigate("/customers")}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  )
}
