import React, { lazy, Suspense, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Card } from '../../../ui/card';
import { Circles } from 'react-loader-spinner';
import { Button } from '../../../ui/button';
import { FormProvider, useForm } from 'react-hook-form';

const SupplierMainInfo = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierMainInfo"))
const SupplierContact = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierContact"))
const SupplierAddress = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierAddress"))
const SupplierPaymentTerms = lazy(() => import("@/components/pages/Suppliers/AddSupplier/SupplierPaymentTerms"))

const tabs = [
  { id: "1", name: "General Info", component: <SupplierMainInfo /> },
  { id: "2", name: "Contacts", component: <SupplierContact /> },
  { id: "3", name: "Address", component: <SupplierAddress /> },
  { id: "4", name: "Payment Terms", component: <SupplierPaymentTerms /> },
];

export default function SuppliersTabs() {
  const defaultTab = useMemo(() => tabs[0]?.id ?? "1", []);
  const [selectedTabId, setSelectedTabId] = useState(defaultTab);

  const method = useForm({
    defaultValues: {
    code: "SUP001",
    first_name: "Abo",
    last_name: "Barakat",
    "name": {
        "en": "Abo Barakat Company",
        "ar": "شركة أبو بركات"
    },
    company_name: "Abo Barakat Trading Co.",
    email: "info@abobarakat.com",
    phone: "+966 56 745 3819",
    "mobile": "+966 56 745 3819",
    "website": "https://abobarakat.com",
    "tax_treatment": "VAT Registered",
    "vat_number": "314153890700003",
    "commercial_register": "7051294861",
    "language": "ar",
    "source_of_supply": "SA",
    "lead_time_days": 7,
    "minimum_order_value": 5000,
    "rating": 4.5,
    "notes": "Preferred supplier for steel products",
    "is_active": true,
    "category_ids": [1, 2],
    payment_terms: [
        {
            "payment_term_id": 5,
            "credit_limit": 100000,
            "credit_days": 30,
            "credit_status": "approved",
            "is_default": true
        }
    ],
    addresses: [
        {
            "type": "both",
            "label": "Main Office",
            "address_line_1": "123 Industrial Area",
            "address_line_2": "Building 5",
            "city": "Riyadh",
            "state": "Riyadh",
            "postal_code": "12345",
            "country": "Saudi Arabia",
            "is_default": true
        }
    ],
    contacts: [
        {
            "name": "Abo Barakat",
            "position": "Sales Manager",
            "email": "abo@abobarakat.com",
            "phone": "+966 56 745 3819",
            "mobile": "+966 56 745 3819",
            "whatsapp": "+966 56 745 3819",
            "is_primary": true,
            "receive_notifications": true
        }
    ],
    bank_accounts: [
        {
            "bank_name": "Al Rajhi Bank",
            "account_holder_name": "Abo Barakat Trading Co.",
            "account_number": "1234567890",
            "iban": "SA1234567890123456789012",
            "swift_code": "RJHISARI",
            "branch": "Riyadh Main",
            "currency": "SAR",
            "is_primary": true
        }
    ]
}
  })

  function onValid(values) {
    console.log("values", values);
  }

  function onInValid(errors) {
    console.log("errors", errors);
  }
  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onValid, onInValid)}>
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
              <Card className="rounded-tl-none px-8 rounded-tr-lg rounded-b-lg shadow-none border-[#E6EFF5]">
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
              onClick={() => console.log("cancel")}
            >
              Cancel
            </Button>

            <Button type="submit">
              {"Save Supplier"}
            </Button>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  )
}
