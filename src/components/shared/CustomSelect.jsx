// import React from "react";
// import { Controller } from "react-hook-form";
// import { Label } from "../ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";

// export default function CustomSelect({
//   control,
//   name,
//   label,
//   placeholder,
//   options = [],
//   isRequired,
//   errors,
//   disabled,
//   isLoading,
// }) {
//   const isSelectDisabled = disabled || isLoading;

//   const finalPlaceholder = isLoading
//     ? "Loading..."
//     : placeholder || "Select...";

//   const hasOptions = Array.isArray(options) && options.length > 0;

//   return (
//     <div className="flex flex-col gap-2">
//       {label && (
//         <Label className={"font-normal text-secondary text-lg"}>
//           {label} {isRequired ? <span className="text-red-500">*</span> : null}
//         </Label>
//       )}

//       <Controller
//         control={control}
//         name={name}
//         render={({ field }) => {
//           return (
//             <Select
//               disabled={isSelectDisabled}
//               value={field.value != null ? String(field.value) : ""}
//               onValueChange={(val) => field.onChange(val)}
//             >
//               <SelectTrigger className="w-full rounded-lg bg-input-bg p-6">
//                 <SelectValue placeholder={finalPlaceholder} />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectGroup>
//                   {label && <SelectLabel>{label}</SelectLabel>}

//                   {isLoading ? (
//                     <SelectItem value="__loading__" disabled>
//                       Loading...
//                     </SelectItem>
//                   ) : hasOptions ? (
//                     options.map((item) => (
//                       <SelectItem
//                         key={String(item.value)}
//                         value={String(item.value)}
//                         textValue={item.textValue || String(item.label)}
//                       >
//                         {item.label}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value="__empty__" disabled>
//                       No options found
//                     </SelectItem>
//                   )}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           );
//         }}
//       />

//       {errors?.message ? (
//         <p className="text-sm text-red-500">{errors.message}</p>
//       ) : null}
//     </div>
//   );
// }


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

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

import { Check } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function CustomSelect({
  control,
  name,
  label,
  placeholder,
  options = [],
  isRequired,
  errors,
  disabled,
  isLoading,
  multiple = false, // ✅ NEW: single or multiple
}) {
  const isSelectDisabled = disabled || isLoading;

  const finalPlaceholder = isLoading
    ? "Loading..."
    : placeholder || (multiple ? "Select options..." : "Select...");

  const hasOptions = Array.isArray(options) && options.length > 0;

  const getLabelByValue = (val) => {
    const found = options.find((o) => String(o.value) === String(val));
    return found ? found.label : String(val);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label className="font-normal text-secondary text-lg">
          {label} {isRequired ? <span className="text-red-500">*</span> : null}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          // ✅ normalize values
          const singleValue =
            field.value != null && !Array.isArray(field.value)
              ? String(field.value)
              : "";

          const multiValue = Array.isArray(field.value)
            ? field.value.map((v) => String(v))
            : [];

          // =========================
          // ✅ SINGLE SELECT MODE
          // =========================
          if (!multiple) {
            return (
              <Select
                disabled={isSelectDisabled}
                value={singleValue}
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger className="w-full rounded-lg bg-input-bg p-6">
                  <SelectValue placeholder={finalPlaceholder} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {label && <SelectLabel>{label}</SelectLabel>}

                    {isLoading ? (
                      <SelectItem value="__loading__" disabled>
                        Loading...
                      </SelectItem>
                    ) : hasOptions ? (
                      options.map((item) => (
                        <SelectItem
                          key={String(item.value)}
                          value={String(item.value)}
                          textValue={item.textValue || String(item.label)}
                        >
                          {item.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__empty__" disabled>
                        No options found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }

          // =========================
          // ✅ MULTI SELECT MODE
          // =========================
          const selectedLabels = multiValue.map((v) => getLabelByValue(v));

          const toggleValue = (v) => {
            const valueStr = String(v);
            const exists = multiValue.includes(valueStr);
            const next = exists
              ? multiValue.filter((x) => x !== valueStr)
              : [...multiValue, valueStr];

            field.onChange(next);
          };

          const removeValue = (v) => {
            const valueStr = String(v);
            field.onChange(multiValue.filter((x) => x !== valueStr));
          };

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSelectDisabled}
                  className={cn(
                    "w-full justify-between rounded-lg bg-input-bg p-6 h-5",
                    !multiValue.length ? "text-muted-foreground" : ""
                  )}
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    {isLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : multiValue.length ? (
                      selectedLabels.map((lbl, idx) => (
                        <Badge
                          key={`${lbl}-${idx}`}
                          variant="secondary"
                          className="px-2 py-1 text-white!"
                        >
                          {lbl}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        {finalPlaceholder}
                      </span>
                    )}
                  </div>

                  <span className="text-muted-foreground">▾</span>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search..." />

                  {!hasOptions && !isLoading ? (
                    <CommandEmpty>No options found</CommandEmpty>
                  ) : null}

                  <CommandGroup>
                    {isLoading ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        Loading...
                      </div>
                    ) : (
                      options.map((item) => {
                        const v = String(item.value);
                        const isSelected = multiValue.includes(v);

                        return (
                          <CommandItem
                            key={v}
                            value={item.textValue || String(item.label)}
                            onSelect={() => toggleValue(v)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandGroup>

                  {/* ✅ Optional: show selected chips with remove */}
                  {multiValue.length ? (
                    <div className="border-t p-3 flex flex-wrap gap-2">
                      {multiValue.map((v) => (
                        <Badge
                          key={v}
                          variant="secondary"
                          className="px-2 py-1 text-white! cursor-pointer"
                          onClick={() => removeValue(v)}
                          title="Click to remove"
                        >
                          {getLabelByValue(v)} ✕
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {errors?.message ? (
        <p className="text-sm text-red-500">{errors.message}</p>
      ) : null}
    </div>
  );
}