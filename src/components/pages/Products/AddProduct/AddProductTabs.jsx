import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Card } from "../../../ui/card";
import { Circles } from "react-loader-spinner";
import { Button } from "../../../ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeAddProductSchema } from "../../../../validations/basidProductSchema";
import { toast } from "sonner";
import useAddProduct from "../../../../hooks/products/useAddProduct";
import { useLocation } from "react-router-dom";
import useProductDetails from "../../../../hooks/products/useProductDetails";
import Loading from "../../../shared/Loading";
import useUpdateProduct from "../../../../hooks/products/useUpdateProduct";

const ProductGeneralInfo = lazy(() =>
  import("@/components/pages/Products/AddProduct/ProductGeneralInfo")
);
const ProductPriceInfo = lazy(() =>
  import("@/components/pages/Products/AddProduct/AddProductPrice")
);
const ProductAttachementInfo = lazy(() =>
  import("@/components/pages/Products/AddProduct/ProductAttachementInfo")
);
const ProductInventoryInfo = lazy(() =>
  import("@/components/pages/Products/AddProduct/ProductInventoryForm")
);

const tabs = [
  { id: "1", name: "General Info", component: <ProductGeneralInfo /> },
  { id: "2", name: "Pricing", component: <ProductPriceInfo /> },
  { id: "3", name: "Inventory & Procurement", component: <ProductInventoryInfo /> },
  { id: "4", name: "Attachments", component: <ProductAttachementInfo /> },
];

// ✅ Helper: map API product -> RHF values
function mapProductToForm(product) {
  if (!product) return null;

  return {
    // General
    name_ar: product?.name?.ar ?? "",
    name_en: product?.name?.en ?? "",
    product_code: product?.model ?? "",
    product_sku: product?.model ?? "",
    category: product?.category?.id ? String(product.category.id) : "",
    subcategory: "",
    brand: product?.brand ?? "",
    unit_of_measure: Array.isArray(product?.units)
      ? product.units.map((u) => String(u.id))
      : [],
    description: product?.description?? "",
    image: product?.image ?? null, // ✅ غالبًا URL في edit

    // Pricing
    currency: product?.currency ?? "",
    cost_price: product?.cost_price ?? "",
    selling_price: product?.selling_price ?? "",
    discount_role: product?.default_discount_rule ?? "",

    // Inventory
    supplier: product?.default_supplier_id ? String(product.default_supplier_id) : "",
    max_stock: product?.max_stock ?? "",
    min_stock: product?.minimum_stock ?? "",
    avg_time: product?.average_lead_time ?? "",
    storage_location_code: product?.storage_location_code ?? "",

    // Attachments (existing)
    attachment: Array.isArray(product?.attachments) ? product.attachments : [],

    // ✅ new files only (always empty at reset)
    attachment_files: [],
  };
}

export default function AddProductTabs() {
  const defaultTab = useMemo(() => tabs[0]?.id ?? "1", []);
  const [selectedTabId, setSelectedTabId] = useState(defaultTab);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  // ✅ Determine mode early
  const mode = id ? "edit" : "create";

  // data
  const { isPending, mutate } = useAddProduct();
  const {
    mutate: productDetailsMutate,
    data,
    isPending: isPendingProductDetails,
  } = useProductDetails();

  const {
    mutate: editProduct,
    isPending: isEditing,
    error: error_edit,
  } = useUpdateProduct();

  useEffect(() => {
    if (id) productDetailsMutate({ id });
  }, [id, productDetailsMutate]);

  // ✅ IMPORTANT: mode-aware schema
  const schema = useMemo(() => makeAddProductSchema(mode), [mode]);

  // ✅ defaultValues ثابتة (مهم!)
  const method = useForm({
    mode: "onBlur",
    defaultValues: {
      name_ar: "",
      name_en: "",
      product_code: "",
      product_sku: "",
      category: "",
      subcategory: "",
      brand: "",
      unit_of_measure: [],
      description: "",
      image: null,

      currency: "",
      cost_price: "",
      selling_price: "",
      discount_role: "",

      supplier: "",
      max_stock: "",
      min_stock: "",
      avg_time: "",
      storage_location_code: "",

      // existing attachment data (URLs etc.) for edit
      attachment: [],

      // ✅ NEW: files only
      attachment_files: [],
    },
    resolver: zodResolver(schema),
    shouldUnregister: false,
  });

  // ✅ لما الداتا توصل: reset الفورم بقيم mapped
  useEffect(() => {
    const product = data?.data;
    if (!product) return;

    const mapped = mapProductToForm(product);
    if (mapped) method.reset(mapped);
  }, [data, method]);

  function onValid(values) {
    console.log("FORM VALUES =>", values);

    const formData = new FormData();

    // ✅ edit ولا add؟
    if (id) formData.append("id", id);

    formData.append("name[en]", values?.name_en ?? "");
    formData.append("name[ar]", values?.name_ar ?? "");
    formData.append("description", values?.description ?? "");

    formData.append("brand", values?.brand ?? "");
    formData.append("model", values?.product_sku ?? "");
    formData.append("category_id", values?.category ?? "");

    formData.append("currency", values?.currency ?? "");
    formData.append("cost_price", values?.cost_price ?? "");
    formData.append("selling_price", values?.selling_price ?? "");
    formData.append("default_discount_rule", values?.discount_role ?? "");
    formData.append("default_supplier_id", values?.supplier ?? "");

    formData.append("minimum_stock", values?.min_stock ?? "");
    formData.append("max_stock", values?.max_stock ?? "");
    formData.append("average_lead_time", values?.avg_time ?? "");
    formData.append("storage_location_code", values?.storage_location_code ?? "");

    formData.append("has_variants", "0");
    formData.append("is_active", "1");

    // ✅ units (multi)
    if (Array.isArray(values?.unit_of_measure)) {
      values.unit_of_measure.forEach((uId, idx) => {
        formData.append(`units[${idx}]`, String(uId));
      });
    }

    // ✅ image:
    // - create: required File
    // - edit: if it's URL/string => don't send it
    if (values?.image instanceof File) {
      formData.append("image", values.image);
    }

    // ✅ attachments:
    // send ONLY new files
    if (Array.isArray(values?.attachment_files) && values.attachment_files.length) {
      values.attachment_files.forEach((file) => {
        if (file instanceof File) formData.append("attachments[]", file);
      });
    }

    if (!id) {
      mutate({ body: formData });
    } else {
      editProduct({ body: formData, id });
    }
  }

  function onInValid(errors) {
    const keys = Object.keys(errors);
    console.log("error", errors);
    toast.error(errors[keys[0]]?.message);
  }

  if (id && isPendingProductDetails) return <Loading />;

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

            <Button disabled={isPending || isEditing} type="submit">
              {(isPending || isEditing) ? "Saving...." : "Save Product"}
            </Button>
          </div>
        </Tabs>
      </form>
    </FormProvider>
  );
}