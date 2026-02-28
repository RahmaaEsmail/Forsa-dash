// import React, { useEffect, useState, useMemo } from "react";
// import { Upload } from "lucide-react";
// import { useFormContext } from "react-hook-form";
// import CustomSelect from "../../../shared/CustomSelect";
// import CustomInput from "../../../shared/CustomInput";
// import CustomTextarea from "../../../shared/CustomTextarea";
// import { useQuery } from "@tanstack/react-query";
// import categoriesAllOptions from "../../../../hooks/categories/categoriesAllOptions";
// import subCategoriesOptions from "../../../../hooks/categories/subCategoryOptions";
// import getAllUnitsOptions from "../../../../hooks/units/getAllUnitsOptions";

// export default function AddProductForm() {
//   const {
//     register,
//     setValue,
//     handleSubmit,
//     watch,
//     control,
//     formState: { errors },
//   } = useFormContext();

//   const [imagePreview, setImagePreview] = useState("");
//   const [imgFile, selectedCategory] = watch(["image", "category"]);
  
//   const { data: allCategoriesOptions, isLoading: fetch_categories } = useQuery(categoriesAllOptions());
//   const { data: all_units, isLoading: fetch_units } = useQuery(getAllUnitsOptions());
//   // خيارات الفئات الرئيسية للـ Select
//   const mainCategoryOptions = useMemo(() => {
//     return allCategoriesOptions?.data?.map(item => ({
//       label: `${item?.name?.en} - ${item?.name?.ar}`,
//       value: item?.id
//     }));
//   }, [allCategoriesOptions]);

//   const all_units_options = useMemo(() => {
//     return all_units?.data?.map(item => ({label : item?.name, value:item?.id}))
//   },[all_units])

//   // إعادة تعيين الفئة الفرعية عند تغيير الفئة الرئيسية
//   useEffect(() => {
//     if (!selectedCategory) {
//       setValue("subcategory", "", { shouldValidate: true });
//     }
//   }, [selectedCategory, setValue]);

//   useEffect(() => {
//     if (!(imgFile instanceof File)) {
//       setImagePreview("");
//       return;
//     }

//     const url = URL.createObjectURL(imgFile);
//     setImagePreview(url);

//     return () => URL.revokeObjectURL(url);
//   }, [imgFile]);

//   function handleFileChange(e) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setValue("image", file, { shouldTouch: true, shouldValidate: true });
//   }


//   return (
//     <form  className="flex flex-col gap-7">
//       <div className="grid grid-cols-[300px_auto] gap-3">
//         <label htmlFor="image_file" className="cursor-pointer">
//           {imagePreview ? (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-56 h-56 object-cover rounded-main"
//             />
//           ) : (
//             <div className="w-full flex flex-col gap-2 rounded-main justify-center items-center h-full border border-dashed border-primary">
//               <Upload className="w-8 h-8 font-bold" />
//               <div className="flex flex-col gap-2">
//                 <h5 className="text-lg">Upload Image*</h5>
//               </div>
//             </div>
//           )}

//           <input
//             onChange={handleFileChange}
//             type="file"
//             id="image_file"
//             accept="image/*"
//             className="hidden"
//           />
//         </label>

//         <div className="grid grid-cols-2 gap-7">
//           <CustomInput
//             errors={errors?.name_ar}
//             placeholder={"e.g. حديد تسليح 16مم"}
//             register={register}
//             name={"name_ar"}
//             isRequired
//             label={"Product Name in Arabic"}
//           />

//           <CustomInput
//             errors={errors?.name_en}
//             placeholder={"e.g. Steel Rebar 16mm"}
//             label={"Product Name in English"}
//             isRequired
//             register={register}
//             name="name_en"
//           />

//           <CustomInput
//             errors={errors?.product_code}
//             placeholder={"e.g. STRB-16-001"}
//             label={"Product Code"}
//             isRequired
//             register={register}
//             name="product_code"
//           />

//           <CustomInput
//             errors={errors?.product_sku}
//             placeholder={"e.g. SKU-12345"}
//             label={"Product SKU"}
//             isRequired
//             register={register}
//             name="product_sku"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-7">
//         <CustomSelect
//           control={control}
//           name="category"
//           multiple={false}
//           errors={errors?.category}
//           label={"Main Category"}
//           isRequired
//           placeholder={fetch_categories ? "Loading categories..." : "Choose main category"}
//           options={mainCategoryOptions}
//           disabled={fetch_categories}
//           isLoading={fetch_categories}
//         />

//       </div>

//       <div className="grid grid-cols-2 gap-7">
//         <CustomInput
//           errors={errors?.brand}
//           label={"Brand"}
//           placeholder={"e.g. Emirates Steel"}
//           register={register}
//           name="brand"
//         />
         
//            <CustomSelect
//           control={control}
//           name="unit_of_measure"
//           errors={errors?.unit_of_measure}
//           label={"Unit of measure"}
//           isRequired
//           multiple={true}
//           placeholder={fetch_units ? "Loading units..." : "Choose Unit"}
//           options={all_units_options}
//           disabled={fetch_units}
//           isLoading={fetch_units}
//         />
//         {/* <CustomInput
//           errors={errors?.unit_of_measure}
//           label={"Unit of measure"}
//           placeholder={"e.g. Ton / Piece / Bundle"}
//           register={register}
//           name="unit_of_measure"
//         /> */}
//       </div>

//       <CustomTextarea
//         errors={errors?.description_ar}
//         placeholder="وصف مختصر..."
//         name={"description_ar"}
//         label={"Short description in Arabic"}
//         register={register}
//       />

//       <CustomTextarea
//         errors={errors?.description_en}
//         placeholder="Short description..."
//         name={"description_en"}
//         label={"Short description in English"}
//         register={register}
//       />
//     </form>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CustomSelect from "../../../shared/CustomSelect";
import CustomInput from "../../../shared/CustomInput";
import CustomTextarea from "../../../shared/CustomTextarea";
import { useQuery } from "@tanstack/react-query";
import categoriesAllOptions from "../../../../hooks/categories/categoriesAllOptions";
import getAllUnitsOptions from "../../../../hooks/units/getAllUnitsOptions";

export default function AddProductForm() {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const [imagePreview, setImagePreview] = useState("");

  // ✅ watch image + category
  const [imgValue, selectedCategory] = watch(["image", "category"]);

  const { data: allCategoriesOptions, isLoading: fetch_categories } = useQuery(
    categoriesAllOptions()
  );
  const { data: all_units, isLoading: fetch_units } = useQuery(
    getAllUnitsOptions()
  );

  // ✅ main categories options
  const mainCategoryOptions = useMemo(() => {
    return (
      allCategoriesOptions?.data?.map((item) => ({
        label: `${item?.name?.en} - ${item?.name?.ar}`,
        value: item?.id,
      })) ?? []
    );
  }, [allCategoriesOptions]);

  // ✅ units options
  const all_units_options = useMemo(() => {
    return (
      all_units?.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) ?? []
    );
  }, [all_units]);

  // ✅ لو بتستخدم subcategory لاحقًا: reset عند تغيير category
  useEffect(() => {
    if (!selectedCategory) {
      setValue("subcategory", "", { shouldValidate: true });
    }
  }, [selectedCategory, setValue]);

  // ✅ HANDLE EDIT IMAGE:
  // - لو imgValue = File => preview منها
  // - لو imgValue = URL string => preview منها
  // - لو null/empty => مفيش preview
  useEffect(() => {
    // clear
    if (!imgValue) {
      setImagePreview("");
      return;
    }

    // 1) File chosen by user
    if (imgValue instanceof File) {
      const url = URL.createObjectURL(imgValue);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }

    // 2) URL from API (edit mode after reset)
    if (typeof imgValue === "string") {
      setImagePreview(imgValue);
      return;
    }

    setImagePreview("");
  }, [imgValue]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ set as File so submit can append image
    setValue("image", file, { shouldTouch: true, shouldValidate: true });
  }

  // ✅ OPTIONAL: زر يمسح الصورة المختارة الجديدة ويرجع للـ URL لو موجود
  function clearNewImage() {
    // لو edit وعندك URL في imagePreview مش File -> سيبه
    // هنا هنرجّع image = "" عشان يبقى واضح مفيش File
    setValue("image", "", { shouldTouch: true, shouldValidate: true });
  }

  return (
    <form className="flex flex-col gap-7">
      <div className="grid grid-cols-[300px_auto] gap-3">
        <label htmlFor="image_file" className="cursor-pointer">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-56 h-56 object-cover rounded-main"
              />
              {/* لو عايز زر clear */}
              {/* <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearNewImage();
                }}
                className="absolute top-2 right-2 bg-white/90 border rounded-md px-2 py-1 text-xs"
              >
                Remove
              </button> */}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 rounded-main justify-center items-center h-full border border-dashed border-primary">
              <Upload className="w-8 h-8 font-bold" />
              <div className="flex flex-col gap-2">
                <h5 className="text-lg">Upload Image*</h5>
              </div>
            </div>
          )}

          <input
            onChange={handleFileChange}
            type="file"
            id="image_file"
            accept="image/*"
            className="hidden"
          />
        </label>

        <div className="grid grid-cols-2 gap-7">
          <CustomInput
            errors={errors?.name_ar}
            placeholder={"e.g. حديد تسليح 16مم"}
            register={register}
            name={"name_ar"}
            isRequired
            label={"Product Name in Arabic"}
          />

          <CustomInput
            errors={errors?.name_en}
            placeholder={"e.g. Steel Rebar 16mm"}
            label={"Product Name in English"}
            isRequired
            register={register}
            name="name_en"
          />

          <CustomInput
            errors={errors?.product_code}
            placeholder={"e.g. STRB-16-001"}
            label={"Product Code"}
            isRequired
            register={register}
            name="product_code"
          />

          <CustomInput
            errors={errors?.product_sku}
            placeholder={"e.g. SKU-12345"}
            label={"Product SKU"}
            isRequired
            register={register}
            name="product_sku"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-7">
        <CustomSelect
          control={control}
          name="category"
          multiple={false}
          errors={errors?.category}
          label={"Main Category"}
          isRequired
          placeholder={
            fetch_categories ? "Loading categories..." : "Choose main category"
          }
          options={mainCategoryOptions}
          disabled={fetch_categories}
          isLoading={fetch_categories}
        />
      </div>

      <div className="grid grid-cols-2 gap-7">
        <CustomInput
          errors={errors?.brand}
          label={"Brand"}
          placeholder={"e.g. Emirates Steel"}
          register={register}
          name="brand"
        />

        <CustomSelect
          control={control}
          name="unit_of_measure"
          errors={errors?.unit_of_measure}
          label={"Unit of measure"}
          isRequired
          multiple={true}
          placeholder={fetch_units ? "Loading units..." : "Choose Unit"}
          options={all_units_options}
          disabled={fetch_units}
          isLoading={fetch_units}
        />
      </div>

      <CustomTextarea
        errors={errors?.description}
        placeholder="وصف مختصر..."
        name={"description"}
        label={"Short description"}
        register={register}
      />

      {/* <CustomTextarea
        errors={errors?.description_en}
        placeholder="Short description..."
        name={"description_en"}
        label={"Short description in English"}
        register={register}
      /> */}
    </form>
  );
}