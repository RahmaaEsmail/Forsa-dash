import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useFormContext } from "react-hook-form";
import CustomSelect from "../../../shared/CustomSelect";
import CustomInput from "../../../shared/CustomInput";
import CustomTextarea from "../../../shared/CustomTextarea";

export default function AddProductForm() {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const [imagePreview, setImagePreview] = useState("");
  const [imgFile ,selectedCategory] = watch(["image", "category"]);

  useEffect(() => {
    if (!(imgFile instanceof File)) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(imgFile);
    setImagePreview(url);

    // ✅ cleanup صح
    return () => URL.revokeObjectURL(url);
  }, [imgFile]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("image", file, { shouldTouch: true, shouldValidate: true });
  }

  function onSubmit(values) {
    console.log("values", values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      <div className="grid grid-cols-[300px_auto] gap-3">
        <label htmlFor="image_file" className="cursor-pointer">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-56 h-56 object-cover rounded-main"
            />
          ) : (
            <div className="w-full flex flex-col gap-2 rounded-main justify-center items-center h-full border border-dashed border-primary">
              <Upload className="w-8 h-8 font-bold" />
              <div className="flex flex-col gap-2">
                <h5 className="text-lg">Upload Image*</h5>
                {/* <p className="text-center">(Optional)</p> */}
              </div>
            </div>
          )}

          {/* ✅ hidden بدل invisible + accept */}
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
            placeholder={"e.g. Steel Rebar 16mm"}
            register={register}
            name={"name_ar"}
            isRequired
            label={"Product Name in Arabic"}
          />

          <CustomInput
            errors={errors?.name_en}
            placeholder={"e.g. STRB-16"}
            label={"Product Name in English"}
            isRequired
            register={register}
            name="name_en"
          />

          <CustomInput
            errors={errors?.product_code}
            placeholder={"e.g. Emirates Steel"}
            label={"Product Code"}
            isRequired
            register={register}
            name="product_code"
          />

          <CustomInput
            errors={errors?.product_sku}
            placeholder={"e.g.Ton/Piece/Bundle"}
            label={"Product SKUs"}
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
          errors={errors?.category}
          label={"Category"}
          isRequired
          placeholder="Choose category"
          options={[
            { label: "Category 1", value: "category_1" },
            { label: "Category 2", value: "category_2" },
          ]}
        />

        <CustomSelect
          control={control}
          name="subcategory"
          errors={errors?.subcategory}
          label={"SubCategory"}
          isRequired
          disabled={!selectedCategory}
          placeholder="Choose subcategory"
          options={[
            { label: "Sub 1", value: "sub_1" },
            { label: "Sub 2", value: "sub_2" },
          ]}
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

        <CustomInput
          errors={errors?.unit_of_measure}
          label={"Unit of measure"}
          placeholder={"e.g. Ton / Piece / Bundle"}
          register={register}
          name="unit_of_measure"
        />
      </div>

      <CustomTextarea
        errors={errors?.description_ar}
        placeholder="Short description..."
        name={"description_ar"}
        label={"Short description in arabic"}
        register={register}
      />

       <CustomTextarea
        errors={errors?.description_en}
        placeholder="Short description..."
        name={"description_en"}
        label={"Short description in english"}
        register={register}
      />

      
    </form>
  );
}
