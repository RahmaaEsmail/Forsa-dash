import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CustomSelect({
  control,
  name,
  label,
  placeholder,
  options = [],
  isRequired,
  errors,
  disabled
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label className={"font-normal text-secondary text-lg"}>
          {label} {isRequired ? <span className="text-red-500">*</span> : null}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            disabled={disabled} value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger className="rounded-lg! w-full bg-input-bg! p-6">
              <SelectValue placeholder={placeholder || "Select..."} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {label && <SelectLabel>{label}</SelectLabel>}
                {options?.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    textValue={item.textValue || String(item.value)}
                  >
                    {item.label}
                  </SelectItem>
                ))}

              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />

      {errors?.message ? (
        <p className="text-sm text-red-500">{errors.message}</p>
      ) : null}
    </div>
  );
}
