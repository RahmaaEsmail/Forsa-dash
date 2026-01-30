import React, { lazy, Suspense, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Card } from "../../../ui/card";
import { Circles } from "react-loader-spinner";
import { Button } from "../../../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema } from "../../../../validations/basidProductSchema";
import { useProductStore } from "../../../../store/zustand/productStore";
import { toast } from "sonner";
import useAddProduct from "../../../../hooks/products/useAddProduct";

const ProductGeneralInfo = lazy(() =>
  import("@/components/pages/Products/AddProduct/ProductGeneralInfo")
);
const ProductPriceInfo = lazy(() => import("@/components/pages/Products/AddProduct/AddProductPrice"))
const ProductAttachementInfo = lazy(() => import("@/components/pages/Products/AddProduct/ProductAttachementInfo"));
const ProductInventoryInfo = lazy(() => import("@/components/pages/Products/AddProduct/ProductInventoryForm"));

const tabs = [
  { id: "1", name: "General Info", component: <ProductGeneralInfo /> },
  { id: "2", name: "Pricing", component: <ProductPriceInfo /> },
  { id: "3", name: "Inventory & Procurement", component: <ProductInventoryInfo /> },
  { id: "4", name: "Attachments", component: <ProductAttachementInfo /> },
];

export default function AddProductTabs() {
  // add product react query
  const {isPending , mutate} = useAddProduct()
  // zustand 
  const {all_products , add_product} = useProductStore();
  const defaultTab = useMemo(() => tabs[0]?.id ?? "1", []);
  const [selectedTabId, setSelectedTabId] = useState(defaultTab);
  
  const method = useForm({
    mode:"onBlur",
   defaultValues: {
      // General
      name_ar: "",
      name_en: "",
      product_code: "",
      product_sku: "",
      category: "",
      subcategory: "",
      brand: "",
      unit_of_measure: "",
      desc: "",
      image: null,

      // Pricing
      currency: "",
      cost_price: "",
      selling_price: "",
      discount_role: "",

      // Inventory
      // مثال:
      stock: "",
      min_stock: "",
      procurement_type: "",
      storage_location_code:"",

      // Attachment
      attachment: null,
    },
    resolver : zodResolver(addProductSchema),
    shouldUnregister : false
  })

 function onValid(values) {
  console.log(values);
   
  const formData = new FormData();
  formData.append("name[en]", values?.name_en); 
  formData.append("name[ar]", values?.name_ar); 
  formData.append("description[ar]", values?.description_ar); 
  formData.append("description[en]", values?.description_en); 
  formData.append("brand", values?.brand); 
  formData.append("model", ""); 
  formData.append("category_id", 1); 
  formData.append("currency", values?.currency); 
  formData.append("cost_price", values?.cost_price); 
  formData.append("selling_price", values?.selling_price);
  formData.append("default_discount_rule", values?.default_discount_rule ?? "");
  formData.append("default_supplier_id","");
  formData.append("minimum_stock",values?.min_stock);
  formData.append("max_stock",values?.max_stock);
  formData.append("average_lead_time",values?.avg_time);
  formData.append("storage_location_code",values?.storage_location_code);
  formData.append("image",values?.image)
  formData.append("has_variants",false)
  formData.append("is_active",true)
  formData.append("image",values?.image)

  values?.attachment?.length > 0 && 
  values?.attachment?.forEach(attach => {
       formData.append("attachments[]",attach)

  });

  mutate({
    body : formData,
  }, {
    onSuccess : (res) => {
      console.log("res success",res);
    },
    onError :(res) => {
      console.log("res error",res);
    }
  })
 }

  function onInValid(errors) {
    console.log("errors",errors)
    const keys = Object.keys(errors);
    console.log(errors[keys[0]])
   toast.error(errors[keys[0]]?.message)
  }
  
  console.log(all_products);

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onValid , onInValid)}>
        <Tabs
        className="gap-0"
        value={selectedTabId}
        onValueChange={setSelectedTabId}
      >
        <TabsList className="bg-white rounded-tl-lg p-0 h-12 rounded-b-none rounded-tr-lg w-fit">
          {tabs.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="flex-1 shadow-none! data-[state=active]:shadow-none! rounded-none  p-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-secondary data-[state=active]:font-bold text-[#B2B8CF] text-base"
            >
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((item) => (
          <TabsContent key={item.id} value={item.id} className="mt-0 ">
            <Card className="rounded-tl-none px-8 rounded-tr-lg rounded-b-lg shadow-none border-[#E6EFF5]">
              <Suspense fallback={<div className="h-full py-6 w-full flex justify-center">
                <Circles
                  height="50"
                  width="50"
                  color="#C94544"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>}>
                {item.component}
              </Suspense>
            </Card>
          </TabsContent>
        ))}

              <div className="flex mt-5 w-fit ms-auto gap-2 items-center">
        {/* ✅ مهم */}
        <Button
          type="button"
          className="border border-primary bg-white text-primary hover:bg-primary hover:text-white"
          onClick={() => console.log("cancel")}
        >
          Cancel
        </Button>

        <Button disabled={isPending} type="submit">
          {isPending ? "Saving...." : "Save Product"}
        </Button>
      </div>
      </Tabs>
      </form>
    </FormProvider>
  );
}
