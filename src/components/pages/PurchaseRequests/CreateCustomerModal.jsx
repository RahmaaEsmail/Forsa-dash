// import React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
// import { Button } from "../../ui/button";
// import CustomInput from "../../shared/CustomInput";
// import { useForm, FormProvider } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { handleAddCustomer } from "../../../services/customers";
// import { toast } from "sonner"; // Using sonner for toasts as seen in ui folder

// export default function CreateCustomerModal({ open, onOpenChange, initialName, onCreated }) {
//   const queryClient = useQueryClient();
//   const methods = useForm({
//     defaultValues: {
//       company_name: initialName || "",
//       first_name: "",
//       last_name: "",
//       email: "",
//     },
//   });

//   React.useEffect(() => {
//     if (open) {
//       methods.reset({ company_name: initialName || "", first_name: "", last_name: "", email: "" });
//     }
//   }, [open, initialName, methods]);

//   const { mutate, isPending } = useMutation({
//     mutationFn: handleAddCustomer,
//     onSuccess: (res) => {
//       toast.success("Customer created successfully");
//       queryClient.invalidateQueries(["customers"]);
//       if (onCreated && res?.data?.id) {
//          onCreated(res.data.id);
//       } else if (onCreated && res?.id) {
//          onCreated(res.id);
//       }
//       onOpenChange(false);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to create customer");
//     }
//   });

//   const onSubmit = (data) => {
//     mutate({ body: data });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Customer</DialogTitle>
//         </DialogHeader>
//         <FormProvider {...methods}>
//           <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
//             <CustomInput
//               register={methods.register}
//               name="company_name"
//               label="Company Name"
//               isRequired
//               errors={methods.formState.errors.company_name}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <CustomInput
//                 register={methods.register}
//                 name="first_name"
//                 label="First Name"
//               />
//               <CustomInput
//                 register={methods.register}
//                 name="last_name"
//                 label="Last Name"
//               />
//             </div>
//             <CustomInput
//               register={methods.register}
//               name="email"
//               label="Email"
//               type="email"
//             />
//             <div className="flex justify-end gap-2 pt-4">
//               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isPending}>
//                 {isPending ? "Creating..." : "Save Customer"}
//               </Button>
//             </div>
//           </form>
//         </FormProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }


import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import CustomInput from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAddProduct } from "../../../services/products";
import { handleGetAllCategories } from "../../../services/categories";
import { toast } from "sonner"; 

export default function CreateProductModal({ open, onOpenChange, initialName, onCreated }) {
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name_en: initialName || "",
      name_ar: "",
      desc: "",
      category_id: "",
      sub_category_id: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      methods.reset({ 
        name_en: initialName || "", 
        name_ar: "",
        desc: "", 
        category_id: "", 
        sub_category_id: "" 
      });
    }
  }, [open, initialName, methods]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => handleGetAllCategories({ signal, per_page: 100 }),
    enabled: open,
  });

  const selectedCategory = methods.watch("category_id");
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } = useQuery({
    queryKey: ["categories", selectedCategory],
    queryFn: ({ signal }) => handleGetAllCategories({ signal, parent_id: selectedCategory, per_page: 100 }),
    enabled: open && !!selectedCategory,
  });

  const getOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option.name === "object" && option.name !== null) {
      return option.name.en || option.name.ar || "Unnamed Option";
    }
    return option.name || "Unnamed Option";
  };

  const categoryOptions = Array.isArray(categoriesData?.data) 
    ? categoriesData.data.map(c => ({ label: getOptionLabel(c), value: c.id })) 
    : [];
    
  const subCategoryOptions = Array.isArray(subCategoriesData?.data) 
    ? subCategoriesData.data.map(c => ({ label: getOptionLabel(c), value: c.id })) 
    : [];

  const { mutate, isPending } = useMutation({
    mutationFn: handleAddProduct,
    onSuccess: (res) => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries(["products"]);
      if (onCreated && res?.data?.id) {
        onCreated(res.data.id);
      } else if (onCreated && res?.id) {
        onCreated(res.id);
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  });

  const onSubmit = (data) => {
    // Create FormData object
    const formData = new FormData();
    
    // Handle name fields with bracket notation
    if (data.name_en) {
      formData.append("name[en]", data.name_en);
    }
    if (data.name_ar) {
      formData.append("name[ar]", data.name_ar);
    }
    
    // Handle description
    if (data.desc) {
      formData.append("description", data.desc);
    }
    
    // Handle category IDs
    if (data.category_id) {
      formData.append("category_id", data.category_id);
    }
    if (data.sub_category_id) {
      formData.append("sub_category_id", data.sub_category_id);
    }
    
    // Add any additional fields that might be needed
    // formData.append("is_active", "1"); // Example additional field
    
    // Log FormData contents for debugging (optional)
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    
    mutate({ body: formData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              register={methods.register}
              name="name_ar"
              label="Product Name in Arabic"
              isRequired
              errors={methods.formState.errors.name_ar}
              placeholder="أدخل اسم المنتج"
              dir="rtl"
            />
            <CustomInput
              register={methods.register}
              name="name_en"
              label="Product Name in English"
              isRequired
              errors={methods.formState.errors.name_en}
              placeholder="Enter product name"
            />
            <CustomInput
              register={methods.register}
              name="desc"
              label="Description"
              placeholder="Enter product description"
            />
            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                control={methods.control}
                name="category_id"
                label="Category"
                options={categoryOptions}
                isLoading={isCategoriesLoading}
                placeholder="Select Category"
              />
              <CustomSelect
                control={methods.control}
                name="sub_category_id"
                label="Sub Category"
                options={subCategoryOptions}
                isLoading={isSubCategoriesLoading}
                placeholder="Select Sub Category"
                disabled={!selectedCategory}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Save Product"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}